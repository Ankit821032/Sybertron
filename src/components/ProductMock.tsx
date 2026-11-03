import type { Mock } from '@/data/products'
import { productPhoto } from '@/data/photos'
import Photo from './Photo'
// Real industry photography replaces the former sample dashboard illustration.
export default function ProductMock({m}:{m:Mock}) {
  return <div className="pm pm-photo"><Photo kind={productPhoto(m.crumb+' '+m.title)} caption="Product use-case photography" /></div>
}
