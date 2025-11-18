import { useEffect, useRef, useState } from 'react';
import { useActiveCard } from '../contexts/ActiveCardContext';
import { useOrientation } from '../hooks/useOrientation';
import { useSpring } from '../hooks/useSpring';
import { clamp, round, adjust } from '../helpers/Math';

export default function Card({
  id = '',
  name = '',
  number = '',
  set = '',
  types = '',
  subtypes = 'basic',
  supertype = 'pokémon',
  rarity = 'common',
  img = '',
  back = 'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg',
  foil = '',
  mask = '',
  showcase = false,
}) {
  const { activeCard, setActiveCard } = useActiveCard();
  const { orientation, resetBaseOrientation } = useOrientation();

  const randomSeed = useRef({
    x: Math.random(),
    y: Math.random(),
  });

  const cosmosPosition = useRef({
    x: Math.floor(randomSeed.current.x * 734),
    y: Math.floor(randomSeed.current.y * 1280),
  });

  const [isTrainerGallery, setIsTrainerGallery] = useState(false);
  const [backImg] = useState(back);
  const [frontImg, setFrontImg] = useState('');
  const imgBase = img.startsWith('http') ? '' : 'https://images.pokemontcg.io/';

  const thisCard = useRef(null);
  const repositionTimer = useRef(null);
  const showcaseInterval = useRef(null);
  const showcaseTimerStart = useRef(null);
  const showcaseTimerEnd = useRef(null);

  const [active, setActive] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [firstPop, setFirstPop] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showcaseRunning, setShowcaseRunning] = useState(showcase);
  const [foilStyles, setFoilStyles] = useState('');

  // Set foil styles immediately when foil/mask props are available
  useEffect(() => {
    if (mask || foil) {
      const styles = [];
      if (mask) styles.push(`--mask: url(${mask})`);
      if (foil) styles.push(`--foil: url(${foil})`);
      if (styles.length > 0) {
        setFoilStyles(styles.join('; '));
        console.log(`${name} - Setting foil styles:`, styles.join('; '));
        console.log(`${name} - Rarity:`, rarity);
      }
    }
  }, [mask, foil, name, rarity]);

  const springInteractSettings = { stiffness: 0.066, damping: 0.25 };
  const springPopoverSettings = { stiffness: 0.033, damping: 0.45 };

  const [springRotate, setSpringRotate, springRotateSettings] = useSpring({ x: 0, y: 0 }, springInteractSettings);
  const [springGlare, setSpringGlare, springGlareSettings] = useSpring({ x: 50, y: 50, o: 0 }, springInteractSettings);
  const [springBackground, setSpringBackground, springBackgroundSettings] = useSpring({ x: 50, y: 50 }, springInteractSettings);
  const [springRotateDelta, setSpringRotateDelta] = useSpring({ x: 0, y: 0 }, springPopoverSettings);
  const [springTranslate, setSpringTranslate] = useSpring({ x: 0, y: 0 }, springPopoverSettings);
  const [springScale, setSpringScale] = useSpring(1, springPopoverSettings);

  const endShowcase = () => {
    if (showcaseRunning) {
      clearTimeout(showcaseTimerEnd.current);
      clearTimeout(showcaseTimerStart.current);
      clearInterval(showcaseInterval.current);
      setShowcaseRunning(false);
    }
  };

  const interact = (e) => {
    endShowcase();

    if (!isVisible) {
      setInteracting(false);
      return;
    }

    // prevent other background cards being interacted with
    if (activeCard && activeCard !== thisCard.current) {
      setInteracting(false);
      return;
    }

    setInteracting(true);

    if (e.type === 'touchmove') {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }

    const $el = e.target;
    const rect = $el.getBoundingClientRect();
    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const percent = {
      x: clamp(round((100 / rect.width) * absolute.x)),
      y: clamp(round((100 / rect.height) * absolute.y)),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    updateSprings(
      {
        x: adjust(percent.x, 0, 100, 37, 63),
        y: adjust(percent.y, 0, 100, 33, 67),
      },
      {
        x: round(-(center.x / 3.5)),
        y: round(center.y / 2),
      },
      {
        x: round(percent.x),
        y: round(percent.y),
        o: 1,
      }
    );
  };

  const interactEnd = (e, delay = 500) => {
    setTimeout(function () {
      const snapStiff = 0.01;
      const snapDamp = 0.06;
      setInteracting(false);

      springRotateSettings.current.stiffness = snapStiff;
      springRotateSettings.current.damping = snapDamp;
      setSpringRotate({ x: 0, y: 0 }, { soft: 1 });

      springGlareSettings.current.stiffness = snapStiff;
      springGlareSettings.current.damping = snapDamp;
      setSpringGlare({ x: 50, y: 50, o: 0 }, { soft: 1 });

      springBackgroundSettings.current.stiffness = snapStiff;
      springBackgroundSettings.current.damping = snapDamp;
      setSpringBackground({ x: 50, y: 50 }, { soft: 1 });
    }, delay);
  };

  const activate = (e) => {
    if (activeCard && activeCard === thisCard.current) {
      setActiveCard(undefined);
    } else {
      setActiveCard(thisCard.current);
      resetBaseOrientation();
      
      if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
        gtag('event', 'select_item', {
          item_list_id: 'cards_list',
          item_list_name: 'Pokemon Cards',
          items: [
            {
              item_id: id,
              item_name: name,
              item_category: set,
              item_category2: supertype,
              item_category3: subtypes,
              item_category4: rarity,
            },
          ],
        });
      }
    }
  };

  const deactivate = (e) => {
    interactEnd();
    setActiveCard(undefined);
  };

  const reposition = (e) => {
    clearTimeout(repositionTimer.current);
    repositionTimer.current = setTimeout(() => {
      if (activeCard && activeCard === thisCard.current) {
        setCenter();
      }
    }, 300);
  };

  const setCenter = () => {
    const rect = thisCard.current.getBoundingClientRect();
    const view = document.documentElement;

    const delta = {
      x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
      y: round(view.clientHeight / 2 - rect.y - rect.height / 2),
    };
    setSpringTranslate({
      x: delta.x,
      y: delta.y,
    });
  };

  const popover = () => {
    const rect = thisCard.current.getBoundingClientRect();
    let delay = 100;
    let scaleW = (window.innerWidth / rect.width) * 0.9;
    let scaleH = (window.innerHeight / rect.height) * 0.9;
    let scaleF = 1.75;
    setCenter();
    if (firstPop) {
      delay = 1000;
      setSpringRotateDelta({
        x: 360,
        y: 0,
      });
    }
    setFirstPop(false);
    setSpringScale(Math.min(scaleW, scaleH, scaleF));
    interactEnd(null, delay);
  };

  const retreat = () => {
    setSpringScale(1, { soft: true });
    setSpringTranslate({ x: 0, y: 0 }, { soft: true });
    setSpringRotateDelta({ x: 0, y: 0 }, { soft: true });
    interactEnd(null, 100);
  };

  const reset = () => {
    interactEnd(null, 0);
    setSpringScale(1, { hard: true });
    setSpringTranslate({ x: 0, y: 0 }, { hard: true });
    setSpringRotateDelta({ x: 0, y: 0 }, { hard: true });
    setSpringRotate({ x: 0, y: 0 }, { hard: true });
  };

  useEffect(() => {
    if (activeCard && activeCard === thisCard.current) {
      popover();
      setActive(true);
    } else {
      retreat();
      setActive(false);
    }
  }, [activeCard]);

  const staticStyles = `
    --seedx: ${randomSeed.current.x};
    --seedy: ${randomSeed.current.y};
    --cosmosbg: ${cosmosPosition.current.x}px ${cosmosPosition.current.y}px;
  `;

  const dynamicStyles = `
    --pointer-x: ${springGlare.x}%;
    --pointer-y: ${springGlare.y}%;
    --pointer-from-center: ${clamp(
      Math.sqrt((springGlare.y - 50) * (springGlare.y - 50) + (springGlare.x - 50) * (springGlare.x - 50)) / 50,
      0,
      1
    )};
    --pointer-from-top: ${springGlare.y / 100};
    --pointer-from-left: ${springGlare.x / 100};
    --card-opacity: ${springGlare.o};
    --rotate-x: ${springRotate.x + springRotateDelta.x}deg;
    --rotate-y: ${springRotate.y + springRotateDelta.y}deg;
    --background-x: ${springBackground.x}%;
    --background-y: ${springBackground.y}%;
    --card-scale: ${springScale};
    --translate-x: ${springTranslate.x}px;
    --translate-y: ${springTranslate.y}px;
  `;

  useEffect(() => {
    let processedRarity = rarity.toLowerCase();
    let processedSupertype = supertype.toLowerCase();
    let processedNumber = number.toLowerCase();
    setIsTrainerGallery(!!processedNumber.match(/^[tg]g/i) || !!(id === 'swshp-SWSH076' || id === 'swshp-SWSH077'));
  }, [rarity, supertype, number, id]);

  const orientate = (orientationData) => {
    const x = orientationData.relative.gamma;
    const y = orientationData.relative.beta;
    const limit = { x: 16, y: 18 };

    const degrees = {
      x: clamp(x, -limit.x, limit.x),
      y: clamp(y, -limit.y, limit.y),
    };

    updateSprings(
      {
        x: adjust(degrees.x, -limit.x, limit.x, 37, 63),
        y: adjust(degrees.y, -limit.y, limit.y, 33, 67),
      },
      {
        x: round(degrees.x * -1),
        y: round(degrees.y),
      },
      {
        x: adjust(degrees.x, -limit.x, limit.x, 0, 100),
        y: adjust(degrees.y, -limit.y, limit.y, 0, 100),
        o: 1,
      }
    );
  };

  const updateSprings = (background, rotate, glare) => {
    springBackgroundSettings.current.stiffness = springInteractSettings.stiffness;
    springBackgroundSettings.current.damping = springInteractSettings.damping;
    springRotateSettings.current.stiffness = springInteractSettings.stiffness;
    springRotateSettings.current.damping = springInteractSettings.damping;
    springGlareSettings.current.stiffness = springInteractSettings.stiffness;
    springGlareSettings.current.damping = springInteractSettings.damping;

    setSpringBackground(background);
    setSpringRotate(rotate);
    setSpringGlare(glare);
  };

  useEffect(() => {
    if (activeCard && activeCard === thisCard.current) {
      setInteracting(true);
      orientate(orientation);
    }
  }, [activeCard, orientation]);

  useEffect(() => {
    const handleVisibilityChange = (e) => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
      endShowcase();
      reset();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const imageLoader = (e) => {
    setLoading(false);
  };

  useEffect(() => {
    // set the front image on mount
    setFrontImg(imgBase + img);

    // run a cute little animation on load for showcase card
    if (showcase && isVisible) {
      const s = 0.02;
      const d = 0.5;
      let r = 0;
      showcaseTimerStart.current = setTimeout(() => {
        setInteracting(true);
        setActive(true);
        springRotateSettings.current.stiffness = s;
        springRotateSettings.current.damping = d;
        springGlareSettings.current.stiffness = s;
        springGlareSettings.current.damping = d;
        springBackgroundSettings.current.stiffness = s;
        springBackgroundSettings.current.damping = d;
        if (isVisible) {
          showcaseInterval.current = setInterval(function () {
            r += 0.05;
            setSpringRotate({ x: Math.sin(r) * 25, y: Math.cos(r) * 25 });
            setSpringGlare({
              x: 55 + Math.sin(r) * 55,
              y: 55 + Math.cos(r) * 55,
              o: 0.8,
            });
            setSpringBackground({
              x: 20 + Math.sin(r) * 20,
              y: 20 + Math.cos(r) * 20,
            });
          }, 20);
          showcaseTimerEnd.current = setTimeout(() => {
            clearInterval(showcaseInterval.current);
            interactEnd(null, 0);
          }, 4000);
        } else {
          setInteracting(false);
          setActive(false);
          return;
        }
      }, 2000);
    }

    return () => {
      clearTimeout(showcaseTimerStart.current);
      clearTimeout(showcaseTimerEnd.current);
      clearInterval(showcaseInterval.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = reposition;
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeCard]);

  let processedTypes = types;
  let processedSubtypes = subtypes;
  
  if (Array.isArray(types)) {
    processedTypes = types.join(' ').toLowerCase();
  }
  if (Array.isArray(subtypes)) {
    processedSubtypes = subtypes.join(' ').toLowerCase();
  }

  // Combine static and dynamic styles for the card element
  const combinedCardStyles = {};
  const cardStyleString = staticStyles + dynamicStyles + foilStyles;
  cardStyleString.split(';').forEach(style => {
    const trimmedStyle = style.trim();
    if (trimmedStyle) {
      const colonIndex = trimmedStyle.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmedStyle.substring(0, colonIndex).trim();
        const value = trimmedStyle.substring(colonIndex + 1).trim();
        if (key && value) {
          combinedCardStyles[key] = value;
        }
      }
    }
  });

  const combinedFrontStyles = {};
  const frontStyleString = staticStyles;
  frontStyleString.split(';').forEach(style => {
    const trimmedStyle = style.trim();
    if (trimmedStyle) {
      const colonIndex = trimmedStyle.indexOf(':');
      if (colonIndex > 0) {
        const key = trimmedStyle.substring(0, colonIndex).trim();
        const value = trimmedStyle.substring(colonIndex + 1).trim();
        if (key && value) {
          combinedFrontStyles[key] = value;
        }
      }
    }
  });

  return (
    <div
      className={`card ${processedTypes} interactive ${active ? 'active' : ''} ${interacting ? 'interacting' : ''} ${loading ? 'loading' : ''} ${mask ? 'masked' : ''}`}
      data-number={number}
      data-set={set}
      data-subtypes={processedSubtypes}
      data-supertype={supertype}
      data-rarity={rarity.toLowerCase()}
      data-trainer-gallery={isTrainerGallery}
      style={combinedCardStyles}
      ref={thisCard}
    >
      <div className="card__translater">
        <button
          className="card__rotator"
          onClick={activate}
          onPointerMove={interact}
          onMouseOut={interactEnd}
          onBlur={deactivate}
          aria-label={`Expand the Pokemon Card; ${name}.`}
          tabIndex="0"
        >
          <img
            className="card__back"
            src={backImg}
            alt="The back of a Pokemon Card, a Pokeball in the center with Pokemon logo above and below"
            loading="lazy"
            width="660"
            height="921"
          />
          <div className="card__front" style={combinedFrontStyles}>
            <img
              src={frontImg}
              alt={`Front design of the ${name} Pokemon Card, with the stats and info around the edge`}
              onLoad={imageLoader}
              loading="lazy"
              width="660"
              height="921"
            />
            <div className="card__shine"></div>
            <div className="card__glare"></div>
          </div>
        </button>
      </div>
    </div>
  );
}

