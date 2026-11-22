const DEFINITIONS = `
  <radialGradient id="sun-core" cx="38%" cy="32%" r="68%"><stop stop-color="#FFF8B0"/><stop offset=".28" stop-color="#FFD65A"/><stop offset=".68" stop-color="#FF8A24"/><stop offset="1" stop-color="#D94312"/></radialGradient>
  <radialGradient id="mercury" cx="34%" cy="28%"><stop stop-color="#E8E5DE"/><stop offset=".55" stop-color="#A7A8AA"/><stop offset="1" stop-color="#555B66"/></radialGradient>
  <radialGradient id="venus" cx="32%" cy="26%"><stop stop-color="#FFF0B8"/><stop offset=".52" stop-color="#DDA34A"/><stop offset="1" stop-color="#8B4B25"/></radialGradient>
  <radialGradient id="earth" cx="30%" cy="24%"><stop stop-color="#B9F2FF"/><stop offset=".25" stop-color="#278DD6"/><stop offset=".72" stop-color="#07529B"/><stop offset="1" stop-color="#06234D"/></radialGradient>
  <radialGradient id="mars" cx="30%" cy="25%"><stop stop-color="#FFC18A"/><stop offset=".5" stop-color="#D75B37"/><stop offset="1" stop-color="#6F251F"/></radialGradient>
  <radialGradient id="jupiter" cx="32%" cy="24%"><stop stop-color="#FFF1D7"/><stop offset=".65" stop-color="#C99B6C"/><stop offset="1" stop-color="#70462E"/></radialGradient>
  <radialGradient id="saturn" cx="30%" cy="25%"><stop stop-color="#FFF0C7"/><stop offset=".62" stop-color="#D9B477"/><stop offset="1" stop-color="#80603D"/></radialGradient>
  <radialGradient id="uranus" cx="30%" cy="24%"><stop stop-color="#D5FFFF"/><stop offset=".55" stop-color="#62C9D9"/><stop offset="1" stop-color="#176A91"/></radialGradient>
  <radialGradient id="neptune" cx="30%" cy="24%"><stop stop-color="#A8D5FF"/><stop offset=".5" stop-color="#2878E8"/><stop offset="1" stop-color="#092B87"/></radialGradient>
  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F8E6BD"/><stop offset=".5" stop-color="#B78A55"/><stop offset="1" stop-color="#F5D9A0"/></linearGradient>
  <clipPath id="clip-earth"><circle cx="50" cy="50" r="39"/></clipPath>
  <clipPath id="clip-jupiter"><circle cx="50" cy="50" r="39"/></clipPath>
`;

const ARTWORK = {
  'solar-system-logo': {
    viewBox: '0 0 100 100',
    body: `<g fill="none" stroke-linecap="round"><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-28 50 50)" stroke="#3B82F6" stroke-width="5"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(22 50 50)" stroke="#8B5CF6" stroke-width="3" opacity=".9"/><circle cx="50" cy="50" r="12" fill="#FBBF24" stroke="#FFF0A6" stroke-width="2"/><path d="M15 67 Q48 82 84 34" stroke="#EAF3FF" stroke-width="2" opacity=".9"/></g>`,
  },
  sun: {
    viewBox: '0 0 100 100',
    body: `<g stroke="#FFB347" stroke-width="3" stroke-linecap="round"><path d="M50 3v12M50 85v12M3 50h12M85 50h12M17 17l9 9M74 74l9 9M83 17l-9 9M26 74l-9 9"/></g><circle cx="50" cy="50" r="35" fill="url(#sun-core)" stroke="#FFE18A" stroke-width="2"/><g fill="none" stroke="#FFF1A6" opacity=".5"><path d="M23 43q20-15 53-2M25 59q23 13 49-1M38 19q-8 20 2 61"/></g>`,
  },
  mercury: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="39" fill="url(#mercury)"/><g fill="#59616C" opacity=".65"><circle cx="34" cy="33" r="7"/><circle cx="65" cy="28" r="4"/><circle cx="68" cy="60" r="9"/><circle cx="39" cy="70" r="5"/><circle cx="20" cy="55" r="3"/></g><g fill="none" stroke="#F1F0EC" opacity=".3"><circle cx="34" cy="33" r="10"/><circle cx="68" cy="60" r="12"/></g>`,
  },
  venus: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="39" fill="url(#venus)"/><g fill="none" stroke="#F7D58A" stroke-width="5" opacity=".65"><path d="M15 34q30-18 70-3M12 54q35-16 76 0M20 73q28-13 59-3"/></g><path d="M18 42q24-12 62-3" fill="none" stroke="#FFF0C0" stroke-width="3" opacity=".5"/>`,
  },
  earth: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="40" fill="url(#earth)"/><g clip-path="url(#clip-earth)" fill="#56B879" stroke="#B4E5A0" stroke-width="1.5"><path d="M18 28l14-9 13 5 4 12-9 8-2 12-12 4-9-13zM55 18l13 2 10 11-5 10-12 1-8-10zM57 53l14-7 13 8-4 17-12 12-9-11zM27 67l11-5 8 8-5 13-13 1z"/></g><path d="M14 43q20-15 70-5M16 58q31 12 66-2" fill="none" stroke="#B9E9FF" stroke-width="2" opacity=".35"/><circle cx="50" cy="50" r="39" fill="none" stroke="#A8E5FF" stroke-width="2" opacity=".7"/>`,
  },
  mars: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="39" fill="url(#mars)"/><g fill="#6E3028" opacity=".6"><ellipse cx="34" cy="35" rx="9" ry="6"/><circle cx="66" cy="58" r="7"/><circle cx="38" cy="68" r="4"/><circle cx="70" cy="30" r="3"/></g><path d="M20 25q18-13 36-8" fill="none" stroke="#FFD0A3" stroke-width="4" opacity=".35"/>`,
  },
  jupiter: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="39" fill="url(#jupiter)"/><g clip-path="url(#clip-jupiter)" fill="none" stroke-linecap="round"><path d="M9 25q40 12 82-1M7 39q42-10 86 5M8 57q42-12 84 3M13 75q35-13 74 3" stroke="#9B6848" stroke-width="8"/><path d="M10 31q42 9 80-2M8 49q43-7 84 5M12 67q38-9 76 5" stroke="#F7D9AE" stroke-width="4"/><ellipse cx="65" cy="59" rx="9" ry="5" fill="#B94E37" stroke="#E7A17B" stroke-width="2"/></g>`,
  },
  saturn: {
    viewBox: '0 0 120 100',
    body: `<ellipse cx="60" cy="53" rx="56" ry="17" transform="rotate(-23 60 53)" fill="none" stroke="url(#ring)" stroke-width="10"/><ellipse cx="60" cy="53" rx="56" ry="17" transform="rotate(-23 60 53)" fill="none" stroke="#FFF0C9" stroke-width="2" opacity=".8"/><circle cx="60" cy="50" r="30" fill="url(#saturn)"/><path d="M32 42q28-10 56 0M31 57q29 9 58-1" fill="none" stroke="#A77D4E" stroke-width="5" opacity=".6"/><path d="M17 70q37 8 86-30" fill="none" stroke="#F7E1B5" stroke-width="3" opacity=".7"/>`,
  },
  uranus: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="39" fill="url(#uranus)"/><path d="M15 36q35-9 70 1M12 57q38 8 76-3" fill="none" stroke="#C8FFFF" stroke-width="3" opacity=".3"/><circle cx="50" cy="50" r="38" fill="none" stroke="#B8F8FF" stroke-width="2" opacity=".4"/>`,
  },
  neptune: {
    viewBox: '0 0 100 100',
    body: `<circle cx="50" cy="50" r="39" fill="url(#neptune)"/><path d="M14 37q31-13 72 1M12 57q38 11 76-3M23 73q24-8 53 0" fill="none" stroke="#9FC9FF" stroke-width="4" opacity=".45"/><ellipse cx="65" cy="57" rx="10" ry="5" fill="#123A9D" opacity=".6"/>`,
  },
} as const;

export type ArtworkId = keyof typeof ARTWORK;

const SVG_CACHE = new Map<ArtworkId, string>();
const DATA_URI_CACHE = new Map<ArtworkId, string>();

export function getArtworkSvg(id: ArtworkId) {
  let svg = SVG_CACHE.get(id);
  if (!svg) {
    const artwork = ARTWORK[id];
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${artwork.viewBox}"><defs>${DEFINITIONS}</defs>${artwork.body}</svg>`;
    SVG_CACHE.set(id, svg);
  }
  return svg;
}

export function getArtworkDataUri(id: ArtworkId) {
  let dataUri = DATA_URI_CACHE.get(id);
  if (!dataUri) {
    dataUri = `data:image/svg+xml,${encodeURIComponent(getArtworkSvg(id))}`;
    DATA_URI_CACHE.set(id, dataUri);
  }
  return dataUri;
}
