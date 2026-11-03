import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { hash } from '../src/cms/runtime'
// Catalog literal content even when it starts inside a closed FAQ, carousel or tab.
const fields = new Map<string,any>()
function walk(dir:string) { for(const item of fs.readdirSync(dir,{withFileTypes:true})) {
  const filename=path.join(dir,item.name)
  if(item.isDirectory()){if(!['cms','chat'].includes(item.name))walk(filename);continue}
  if(!/\.(ts|tsx)$/.test(item.name)||['router.ts','main.tsx','entry-server.tsx'].includes(item.name))continue
  const source=ts.createSourceFile(filename,fs.readFileSync(filename,'utf8'),ts.ScriptTarget.Latest,true)
  function visit(node:ts.Node) {
    if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)) {
      let text=node.text
      const parent=node.parent
      if(ts.isImportDeclaration(parent)||ts.isExportDeclaration(parent)||ts.isLiteralTypeNode(parent))return
      const attr=ts.isJsxAttribute(parent)?parent.name.getText(source):''
      if(['className','id','type','role','target','rel','name','htmlFor','autoComplete','cmsTag','cmsSource','data-reveal','data-parallax'].includes(attr))return
      const key=ts.isPropertyAssignment(parent)?parent.name.getText(source):''
      if(['id','slug','cat','tone','accent','className','variant','tz','color','background','fontFamily'].includes(key))return
      if(text.length<3||text.length>30000||!/[A-Za-z]/.test(text)||(!/\s/.test(text)&&!/^[A-Z]|^https?:|^\/|@/.test(text)))return
      const kind=['src','alt','href','poster','title','placeholder','aria-label'].includes(attr)?attr:'text'
      const id='library:'+kind+':'+hash(text)
      if(!fields.has(id))fields.set(id,{id,kind,source:'Content library/'+path.relative('src',filename).replaceAll('\\','/'),original:text})
    }
    ts.forEachChild(node,visit)
  }visit(source)
}}
walk('src');fs.mkdirSync('server/generated',{recursive:true});fs.writeFileSync('server/generated/content-library.json',JSON.stringify([...fields.values()]));console.log(`Cataloged ${fields.size} reusable content strings`)
