import { photos } from '@/data/photos'
export default function Photo({kind,caption,className=''}:{kind:string;caption?:string;className?:string}) {
  const photo=photos[kind]||photos.code
  return <figure className={`real-photo ${className}`}>
    <img src={photo.file} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
    {caption&&<figcaption>{caption}</figcaption>}
  </figure>
}
