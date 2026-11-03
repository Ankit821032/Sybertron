import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { randomBytes } from 'node:crypto'
import { passwordHash, verifyPassword, createDatabase, registerFields, snapshot } from '../server/site-content'

test('CMS authentication, content persistence, formatting, media and server SEO', async () => {
  const folder=fs.mkdtempSync(path.join(tmpdir(),'sybertron-test-'))
  process.env.CMS_TEST='1';process.env.DATABASE_PATH=path.join(folder,'test.sqlite');process.env.UPLOAD_DIR=path.join(folder,'uploads');process.env.SITE_URL='http://localhost:4000'
  const {app,db}=await import('../server/index')
  const password=randomBytes(24).toString('hex'),hash=passwordHash(password)
  assert.ok(verifyPassword(password,hash));assert.equal(verifyPassword('wrong',hash),false)
  db.prepare('INSERT INTO cms_admins VALUES(?,?)').run('qa@example.invalid',hash)
  const server=app.listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve))
  const address=server.address() as any,base=`http://127.0.0.1:${address.port}`
  let cookie='',csrf=''
  async function request(url:string,method='GET',body?:any,auth=true,token=csrf) {
    return fetch(base+url,{method,headers:{'content-type':'application/json',...(auth?{cookie,'x-csrf-token':token}:{})},body:body===undefined?undefined:JSON.stringify(body)})
  }
  try {
    assert.equal((await request('/api/admin/content', 'GET',undefined,false)).status,401)
    assert.equal((await request('/api/sections','POST',{},false)).status,404)
    assert.equal((await request('/api/admin/login','POST',{email:'qa@example.invalid',password:'wrong'},false)).status,401)
    const login=await request('/api/admin/login','POST',{email:'qa@example.invalid',password},false)
    assert.equal(login.status,200);cookie=login.headers.get('set-cookie')!.split(';')[0];csrf=(await login.json()).csrf
    assert.match(login.headers.get('set-cookie')!,/HttpOnly; SameSite=Strict/)
    const pages=(await (await request('/api/admin/pages')).json()).pages
    assert.ok(pages.length>40)
    let fieldCount=0
    const imageUrls=new Set<string>()
    for(const page of pages.filter((p:any)=>p.path!=='*')) {
      const response=await request(page.path);assert.equal(response.status,200,page.path)
      const html=await response.text();assert.match(html,/<link rel="canonical"/);assert.match(html,/window\.__CMS__/)
      for(const match of html.matchAll(/<img\b[^>]*src="(\/images\/[^"?]+)"/g))imageUrls.add(match[1])
      const data=snapshot(db,page.path);fieldCount+=Object.keys(data.fields).filter(k=>!k.startsWith('library:')).length
    }
    console.log(`Verified ${pages.length-1} routes, ${fieldCount} page/shared fields and ${Object.keys(snapshot(db,'*').fields).length} shared/library fields`)
    assert.ok(imageUrls.size>=15)
    for(const image of imageUrls){const response=await request(image);assert.equal(response.status,200,image);assert.match(response.headers.get('content-type')||'',/image\/webp/);assert.ok((await response.arrayBuffer()).byteLength>1000)}
    const bundled=(await (await request('/api/admin/media')).json()).media
    assert.equal(bundled.filter((p:any)=>p.id.startsWith('stock:')).length,19)
    const content=await (await request('/api/admin/content?page=%2F')).json()
    const field:any=Object.values(content.fields).find((f:any)=>f.kind==='text'&&f.original.startsWith('Websites, apps, AI and cloud engineering'))
    assert.ok(field)
    const edit={page:field.page,id:field.id,revision:field.revision,value:'CMS integration proof <script>alert(1)</script>',format:{bold:true,italic:true,highlight:'#ffff00',color:'red'}}
    assert.equal((await request('/api/admin/field','PUT',edit,true,'bad-csrf')).status,403)
    const saved=await request('/api/admin/field','PUT',edit);assert.equal(saved.status,200)
    const updated=await saved.json();assert.equal(updated.format.bold,true);assert.equal(updated.format.color,undefined)
    assert.equal((await request('/api/admin/field','PUT',edit)).status,409)
    const html=await (await request('/')).text();assert.match(html,/CMS integration proof &lt;script&gt;/);assert.match(html,/font-weight:700/);assert.match(html,/background-color:#ffff00/)
    const history=await (await request('/api/admin/history?page='+encodeURIComponent(field.page)+'&id='+encodeURIComponent(field.id))).json();assert.equal(history.history.length,1)
    // Verify reopening the file sees the committed content.
    const reopened=createDatabase(process.env.DATABASE_PATH);assert.equal(snapshot(reopened,field.page).fields[field.id].value,edit.value);reopened.close()
    const link:any=Object.values(content.fields).find((f:any)=>f.kind==='href')
    assert.equal((await request('/api/admin/field','PUT',{page:link.page,id:link.id,revision:link.revision,value:'javascript:alert(1)'})).status,400)
    const shared:any=Object.values(content.fields).find((f:any)=>f.page==='*'&&f.kind==='text'&&f.original==='Services')
    assert.ok(shared);assert.equal((await request('/api/admin/field','PUT',{page:'*',id:shared.id,revision:shared.revision,value:'Shared service label',format:{}})).status,200)
    assert.match(await (await request('/about')).text(),/Shared service label/)
    const library:any=Object.values(content.fields).find((f:any)=>f.id.startsWith('library:text:')&&f.original==='What do you want')
    assert.ok(library);assert.equal((await request('/api/admin/field','PUT',{page:'*',id:library.id,revision:library.revision,value:'Build your next idea',format:{}})).status,200)
    assert.match(await (await request('/')).text(),/Build.*your.*next.*idea/s)
    const seo={title:'Managed SEO title',description:'Managed SEO description',keywords:'test',canonical:'https://example.com/custom',ogImage:'/logo-horizontal-black.png',noindex:true}
    assert.equal((await request('/api/admin/seo','PUT',{page:'/about',seo})).status,200)
    const about=await (await request('/about')).text();assert.match(about,/<title>Managed SEO title<\/title>/);assert.match(about,/content="Managed SEO description"/);assert.match(about,/https:\/\/example.com\/custom/);assert.match(about,/noindex, follow/)
    assert.equal((await request('/api/admin/seo','PUT',{page:'/about',seo:{...seo,canonical:'javascript:evil'}})).status,400)
    const sitemap=await (await request('/sitemap.xml')).text();assert.match(sitemap,/<urlset/);assert.ok(!sitemap.includes('<loc>http://localhost:4000/about</loc>'))
    assert.match(await (await request('/robots.txt')).text(),/Disallow: \/admin/)
    assert.equal((await request('/not-a-page')).status,404)
    const image=fs.readFileSync('public/favicon-32.png').toString('base64')
    const upload=await request('/api/admin/media','POST',{type:'image/png',base64:image});assert.equal(upload.status,200)
    const media=await upload.json();assert.equal((await request(media.url)).status,200)
    const aboutContent=await (await request('/api/admin/content?page=%2Fabout')).json()
    const imageField:any=Object.values(aboutContent.fields).find((f:any)=>f.kind==='src'&&f.original==='/images/team.webp')
    assert.ok(imageField)
    assert.equal((await request('/api/admin/field','PUT',{page:imageField.page,id:imageField.id,revision:imageField.revision,value:media.url,format:{}})).status,200)
    assert.ok((await (await request('/about')).text()).includes(`src="${media.url}"`))
    assert.equal((await request('/api/admin/media','POST',{type:'image/png',base64:Buffer.from('<script>bad</script>').toString('base64')})).status,400)
    assert.equal((await request('/api/admin/media','POST',{type:'image/svg+xml',base64:image})).status,400)
    const backup=await (await request('/api/admin/export')).json();assert.ok(backup.fields.length>1000);assert.equal(backup.admins,undefined)
    assert.equal((await request('/api/admin/logout','POST',{})).status,200);assert.equal((await request('/api/admin/me')).status,401)
  } finally { await new Promise<void>(resolve=>server.close(()=>resolve()));db.close() }
})
