import React, { createContext, useContext, type ReactNode } from 'react'

export type Field = { id: string; source: string; kind: string; original: string; value?: string; format?: Record<string, unknown> }
export type Snapshot = { fields: Record<string, Field>; seo?: any }
export const CmsContext = createContext<{ path: string; snapshot: Snapshot; collect?: (field: Field) => void }>({ path: '/', snapshot: { fields: {} } })
export function hash(text: string) { let n = 2166136261; for (let i = 0; i < text.length; i++) n = Math.imul(n ^ text.charCodeAt(i), 16777619); return (n >>> 0).toString(36) }
export function fieldId(source: string, kind: string, original: string) { return `${source}:${kind}:${hash(original)}` }
export function CmsElement({ cmsTag: tag, cmsSource: source, children, ...props }: any) {
  const ctx = useContext(CmsContext)
  const lookup = (kind: string, original: string) => {
    const id = fieldId(source, kind, original)
    const item = { id, source, kind, original }
    ctx.collect?.(item)
    const local=ctx.snapshot.fields[id], shared=ctx.snapshot.fields['library:'+kind+':'+hash(original)]
    return { id: shared?.value != null && local?.value == null ? shared.id : id, saved: local?.value != null ? local : shared?.value != null ? shared : local }
  }
  if (tag === 'svg') {
    const {id,saved} = lookup('illustration', 'Built-in illustration')
    if (saved?.value) return React.createElement('img', {className:props.className,style:props.style,src:saved.value,alt:props['aria-label']||'Illustration','data-cms-attributes':id})
    props['data-cms-attributes'] = id
  }
  const attributes: string[] = props['data-cms-attributes'] ? [props['data-cms-attributes']] : []
  for (const key of ['src', 'alt', 'title', 'placeholder', 'href', 'poster', 'aria-label']) {
    if (typeof props[key] !== 'string') continue
    const { id, saved } = lookup(key, props[key]); attributes.push(id)
    if (saved) props[key] = saved.value ?? props[key]
  }
  if (typeof props.style?.backgroundImage === 'string') {
    const { saved } = lookup('backgroundImage', props.style.backgroundImage)
    if (saved?.value != null) props.style = { ...props.style, backgroundImage: `url(${JSON.stringify(saved.value)})` }
  }
  const text = (child: ReactNode): ReactNode => {
    if (Array.isArray(child)) return child.map(text)
    if (typeof child !== 'string' || !child.trim() || /^\d{2}:\d{2}$/.test(child)) return child
    const { id, saved } = lookup('text', child)
    const f: any = saved?.format ?? {}
    // React escapes text; rich formatting is structured data, never raw HTML.
    return React.createElement('cms-text', { key: id, 'data-cms-field': id, style: { fontWeight: f.bold ? 700 : undefined, fontStyle: f.italic ? 'italic' : undefined,
      textDecoration: [f.underline ? 'underline' : '', f.strike ? 'line-through' : ''].filter(Boolean).join(' ') || undefined,
      backgroundColor: f.highlight || undefined, color: f.color || undefined, whiteSpace: 'pre-wrap' } }, saved?.value ?? child)
  }
  // Editing live form values would overwrite visitor input, so only labels/placeholders are managed.
  const noWrap = ['input', 'textarea', 'option', 'source', 'img'].includes(tag)
  return React.createElement(tag, { ...props, 'data-cms-attributes': attributes.join('|') || undefined }, noWrap ? children : React.Children.map(children, text))
}

export function useCmsPhrase(original: string) {
  const ctx = useContext(CmsContext), source = 'motion/SplitWords', id = fieldId(source,'text',original)
  ctx.collect?.({id,source,kind:'text',original})
  const local=ctx.snapshot.fields[id],shared=ctx.snapshot.fields['library:text:'+hash(original)],saved=local?.value!=null?local:shared?.value!=null?shared:local, f:any=saved?.format||{}
  return {id:saved?.id||id,text:saved?.value??original,style:{fontWeight:f.bold?700:undefined,fontStyle:f.italic?'italic':undefined,textDecoration:[f.underline?'underline':'',f.strike?'line-through':''].filter(Boolean).join(' ')||undefined,color:f.color||undefined,backgroundColor:f.highlight||undefined}}
}

export function useCmsMetric(original: number) {
  const ctx=useContext(CmsContext),source='motion/useCountUp',id=fieldId(source,'number',String(original))
  ctx.collect?.({id,source,kind:'number',original:String(original)})
  const saved=ctx.snapshot.fields[id],n=Number(saved?.value??original)
  return Number.isFinite(n)?n:original
}
