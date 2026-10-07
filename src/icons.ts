import { CategoryId } from './types';
import RingSvg from '../public/image/Ring.svg?raw';
import PendantSvg from '../public/image/Pendant.svg?raw';
import BraceletSvg from '../public/image/Bracelet.svg?raw';
import NecklaceSvg from '../public/image/Necklace.svg?raw';
import EarringSvg from '../public/image/Earring.svg?raw';

export const CATEGORY_ICONS: Record<CategoryId, string> = {
  ring: RingSvg,
  'pendant-bead': PendantSvg,
  bracelet: BraceletSvg,
  necklace: NecklaceSvg,
  earring: EarringSvg,
};