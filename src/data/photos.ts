import credits from './photoCredits.json'
export const photos = Object.fromEntries(credits.map(p => [p.key,p]))
export const servicePhoto: Record<string,string> = {
  ai:'cloud','ai-agents':'code','ai-models':'cloud','web-portals':'team',ecommerce:'fashion','mobile-apps':'mobile',games:'gaming','ar-vr':'vr',marketing:'analytics',custom:'code',plugins:'code',erp:'logistics',saas:'analytics',
}
export const workPhoto: Record<string,string> = {
  aurum:'jewelry',fleetline:'logistics',learnloop:'education',skyforge:'gaming',landmark:'property',bloom:'flowers',nutribasket:'grocery',threadwell:'fashion',brewlab:'coffee',ledgerly:'analytics',clinichub:'healthcare',hiretrack:'collaboration',schoolsphere:'education',harbor:'team',atlas:'cloud',summit:'construction',greenfield:'education',fitpulse:'fitness',ridenow:'mobile',pocketwise:'analytics',tablechat:'coffee',pixelpirates:'gaming',neonracer:'gaming',orbitvr:'vr',
}
export function productPhoto(crumb:string) {
  const text=crumb.toLowerCase()
  for(const [pattern,photo] of [
    ['clinic|patient|health','healthcare'],['gym|fitness','fitness'],['school|learning|education','education'],['salon|retail|shop|commerce|order','fashion'],
    ['restaurant|dining|kitchen|table|cafe','coffee'],['fleet|stock|inventory|warehouse|asset|dispatch|jobs','logistics'],['property|facility|building|tenant','property'],
    ['vr|ar /|holo|tour','vr'],['security|backup|cloud|vault','cloud'],['people|attendance|leave|staff|visitor','collaboration'],['sales|billing|invoice|finance|payment|analytics|revenue','analytics'],['chat|ai','code']
  ]) if(new RegExp(pattern).test(text))return photo
  return 'team'
}
