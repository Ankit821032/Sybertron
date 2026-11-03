import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./motion.css"
import "./sybertron.css"
import "./about.css"
import "./products.css"
import "./productdetail.css"
import "./servicedetail.css"
import "./pages.css"
import "./work.css"
import "./urgent.css"
import "./photos.css"

import { CmsContext, type Field, type Snapshot } from './cms/runtime'
function Site() {
  const [snapshot, setSnapshot] = React.useState<Snapshot>((window as any).__CMS__ ?? {fields:{}})
  const [path, setPath] = React.useState(location.pathname)
  const editing = React.useRef(true)
  const fields = React.useRef(new Map<string, Field>())
  React.useEffect(() => {
    const sync = () => {
      const next = location.pathname
      if(next === path) return
      // A full request ensures correct server-rendered SEO/content on every page.
      location.assign(location.href)
    }
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [path])
  React.useEffect(() => {
    if (new URLSearchParams(location.search).get('cms-preview') !== '1') return
    const timer = setInterval(() => {
      parent.postMessage({type:'cms-fields', path, fields:[...fields.current.values()]}, location.origin)
    }, 1500)
    const mode=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===parent&&e.data?.type==='cms-mode')editing.current=e.data.editing!==false}
    window.addEventListener('message',mode)
    const click = (e: MouseEvent) => {
      if(!editing.current)return
      const el = (e.target as Element).closest('[data-cms-field], [data-cms-attributes]')
      if (!el) return
      e.preventDefault(); e.stopPropagation()
      parent.postMessage({type:'cms-select', id: el.getAttribute('data-cms-field') || el.getAttribute('data-cms-attributes')?.split('|')[0]}, location.origin)
    }
    document.addEventListener('click', click, true)
    return () => { clearInterval(timer); document.removeEventListener('click', click, true);window.removeEventListener('message',mode) }
  }, [path])
  return <CmsContext.Provider value={{path, snapshot, collect:f => fields.current.set(f.id,f)}}><App /></CmsContext.Provider>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<Site />)
