import type {ReactNode} from 'react'
import type {WorkItem} from '@/data/work'
import {workPhoto} from '@/data/photos'
import Photo from './Photo'
const visual=(id:string)=><Photo kind={workPhoto[id]||'code'} caption="Industry photography" />
export const mocks={aurum:()=>visual('aurum'),fleetline:()=>visual('fleetline'),learnloop:()=>visual('learnloop'),skyforge:()=>visual('skyforge'),landmark:()=>visual('landmark')} as const
export function WorkVisual({item}:{item:WorkItem}) {return visual(item.id)}
export function BrowserFrame({url,children}:{url:string;children:ReactNode}) {
  return <div className="frame"><div className="frame-bar"><div><i/><i/><i/></div><span>{url}</span></div><div className="frame-body">{children}</div></div>
}
