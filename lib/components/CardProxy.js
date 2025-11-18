import altArts from './alternate-arts.json';
import promos from './promos.json';
import Card from './Card';

export default function CardProxy({
  id = undefined,
  name = undefined,
  number = undefined,
  set = undefined,
  types = undefined,
  subtypes = undefined,
  supertype = undefined,
  rarity = undefined,
  isReverse = false,
  img = undefined,
  back = undefined,
  foil = undefined,
  mask = undefined,
  showcase = false,
}) {
  const server = process.env.NEXT_PUBLIC_CDN;

  // If no CDN is configured, return empty strings for foil/mask to use CSS-only effects
  const hasCDN = server && server !== 'your_cdn_url' && server !== '';

  /**
   * Shiny Vault Card (starts with sv)
   */
  const isShiny = isDefined(number) && number.toLowerCase().startsWith('sv');
  /**
   * Trainer / Galar Gallery Card (not shiny)
   */
  const isGallery = isDefined(number) && !!number.match(/^[tg]g/i);
  /**
   * Alternate Art Card (not shiny / gallery)
   */
  const isAlternate = isDefined(id) && altArts.includes(id) && !isShiny && !isGallery;
  /**
   * Promo Card
   */
  const isPromo = isDefined(set) && set === 'swshp';

  let processedRarity = rarity;

  if (isReverse) {
    processedRarity = rarity + ' Reverse Holo';
  }

  if (isGallery) {
    if (isDefined(processedRarity) && processedRarity.startsWith('Trainer Gallery')) {
      processedRarity = processedRarity.replace(/Trainer Gallery\s*/, '');
    }
    if (isDefined(processedRarity) && processedRarity.includes('Rare Holo V') && isDefined(subtypes) && subtypes.includes('VMAX')) {
      processedRarity = 'Rare Holo VMAX';
    }
    if (isDefined(processedRarity) && processedRarity.includes('Rare Holo V') && isDefined(subtypes) && subtypes.includes('VSTAR')) {
      processedRarity = 'Rare Holo VSTAR';
    }
  }

  if (isPromo) {
    if (id === 'swshp-SWSH076' || id === 'swshp-SWSH077') {
      processedRarity = 'Rare Secret';
    } else if (isDefined(subtypes) && subtypes.includes('V')) {
      processedRarity = 'Rare Holo V';
    } else if (isDefined(subtypes) && subtypes.includes('V-UNION')) {
      processedRarity = 'Rare Holo VUNION';
    } else if (isDefined(subtypes) && subtypes.includes('VMAX')) {
      processedRarity = 'Rare Holo VMAX';
    } else if (isDefined(subtypes) && subtypes.includes('VSTAR')) {
      processedRarity = 'Rare Holo VSTAR';
    } else if (isDefined(subtypes) && subtypes.includes('Radiant')) {
      processedRarity = 'Radiant Rare';
    }
  }

  function isDefined(v) {
    return typeof v !== 'undefined' && v !== null;
  }

  function cardImage() {
    if (isDefined(img)) {
      return img;
    }
    if (isDefined(set) && isDefined(number)) {
      return `https://images.pokemontcg.io/${set.toLowerCase()}/${number}_hires.png`;
    }
    return '';
  }

  function foilMaskImage(prop, type = 'masks') {
    // If no CDN configured or prop is explicitly false, return empty string
    if (!hasCDN || prop === false) {
      return '';
    }

    let etch = 'holo';
    let style = 'reverse';
    let ext = 'webp';

    if (isDefined(prop)) {
      if (prop === false) {
        return '';
      }
      return prop;
    }

    if (!isDefined(processedRarity) || !isDefined(subtypes) || !isDefined(supertype) || !isDefined(set) || !isDefined(number)) {
      return '';
    }

    const fRarity = processedRarity.toLowerCase();
    const fNumber = number.toString().toLowerCase().replace('swsh', '').padStart(3, '0');
    const fSet = set.toString().toLowerCase().replace(/(tg|gg|sv)/, '');

    if (fRarity === 'rare holo') {
      style = 'swholo';
    }

    if (fRarity === 'rare holo cosmos') {
      style = 'cosmos';
    }

    if (fRarity === 'radiant rare') {
      etch = 'etched';
      style = 'radiantholo';
    }

    if (fRarity === 'rare holo v' || fRarity === 'rare holo vunion' || fRarity === 'basic v') {
      etch = 'holo';
      style = 'sunpillar';
    }

    if (fRarity === 'rare holo vmax' || fRarity === 'rare ultra' || fRarity === 'rare holo vstar') {
      etch = 'etched';
      style = 'sunpillar';
    }

    if (fRarity === 'amazing rare' || fRarity === 'rare rainbow' || fRarity === 'rare secret') {
      etch = 'etched';
      style = 'swsecret';
    }

    if (isShiny) {
      etch = 'etched';
      style = 'sunpillar';

      if (fRarity === 'rare shiny v' || (fRarity === 'rare holo v' && fNumber.startsWith('sv'))) {
        processedRarity = 'Rare Shiny V';
      }

      if (fRarity === 'rare shiny vmax' || (fRarity === 'rare holo vmax' && fNumber.startsWith('sv'))) {
        style = 'swsecret';
        processedRarity = 'Rare Shiny VMAX';
      }
    }

    if (isGallery) {
      etch = 'holo';
      style = 'rainbow';

      if (fRarity.includes('rare holo v') || fRarity.includes('rare ultra')) {
        etch = 'etched';
        style = 'sunpillar';
      }

      if (fRarity.includes('rare secret')) {
        etch = 'etched';
        style = 'swsecret';
      }
    }

    if (isAlternate) {
      etch = 'etched';

      if (subtypes.includes('VMAX')) {
        style = 'swsecret';
        processedRarity = 'Rare Rainbow Alt';
      } else {
        style = 'sunpillar';
      }
    }

    if (isPromo) {
      let promoStyle = promos[id];
      if (promoStyle) {
        style = promoStyle.style.toLowerCase();
        etch = promoStyle.etch.toLowerCase();
        if (style === 'swholo') {
          processedRarity = 'Rare Holo';
        } else if (style === 'cosmos') {
          processedRarity = 'Rare Holo Cosmos';
        }
      }
    }

    return `${server}/foils/${fSet}/${type}/upscaled/${fNumber}_foil_${etch}_${style}_2x.${ext}`;
  }

  function foilImage() {
    return foilMaskImage(foil, 'foils');
  }

  function maskImage() {
    return foilMaskImage(mask, 'masks');
  }

  const proxy = {
    img: cardImage(),
    back,
    foil: foilImage(),
    mask: maskImage(),
    id,
    name,
    number,
    set,
    types,
    subtypes,
    supertype,
    rarity: processedRarity,
    showcase,
  };

  // Debug logging (temporary)
  if (process.env.NODE_ENV === 'development' && proxy.foil) {
    console.log('Card:', proxy.name, 'Foil URL:', proxy.foil, 'Mask URL:', proxy.mask);
  }

  return <Card {...proxy} />;
}

