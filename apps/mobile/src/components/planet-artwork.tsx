import { SvgXml } from 'react-native-svg';
import { getArtworkSvg, type ArtworkId } from '@solar-system/ui';

export function PlanetArtwork({ id, size }: { id: ArtworkId; size: number }) {
  return <SvgXml xml={getArtworkSvg(id)} width={size} height={size} />;
}
