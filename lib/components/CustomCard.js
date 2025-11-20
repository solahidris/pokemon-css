import { useRef, useState, useEffect } from 'react';

// Inline useSpring hook - completely self-contained
function useSpring(initialValue, settings = { stiffness: 0.066, damping: 0.25 }) {
  const [value, setValue] = useState(initialValue);
  const [targetValue, setTargetValue] = useState(initialValue);
  const [velocity, setVelocity] = useState(
    typeof initialValue === 'object' 
      ? Object.keys(initialValue).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
      : 0
  );
  const settingsRef = useRef(settings);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const animate = () => {
      const { stiffness, damping } = settingsRef.current;
      
      if (typeof value === 'object') {
        let hasChanged = false;
        const newValue = {};
        const newVelocity = {};
        
        Object.keys(value).forEach(key => {
          const diff = targetValue[key] - value[key];
          if (Math.abs(diff) > 0.001 || Math.abs(velocity[key]) > 0.001) {
            hasChanged = true;
            newVelocity[key] = velocity[key] + diff * stiffness;
            newVelocity[key] *= 1 - damping;
            newValue[key] = value[key] + newVelocity[key];
          } else {
            newValue[key] = targetValue[key];
            newVelocity[key] = 0;
          }
        });
        
        if (hasChanged) {
          setValue(newValue);
          setVelocity(newVelocity);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      } else {
        const diff = targetValue - value;
        if (Math.abs(diff) > 0.001 || Math.abs(velocity) > 0.001) {
          const newVelocity = velocity + diff * stiffness;
          const dampedVelocity = newVelocity * (1 - damping);
          setValue(value + dampedVelocity);
          setVelocity(dampedVelocity);
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, targetValue, velocity]);

  const set = (newTargetValue, options = {}) => {
    if (options.hard) {
      setValue(newTargetValue);
      setTargetValue(newTargetValue);
      setVelocity(
        typeof newTargetValue === 'object'
          ? Object.keys(newTargetValue).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
          : 0
      );
    } else {
      setTargetValue(newTargetValue);
    }
  };

  return [value, set, settingsRef];
}

const imageUrl = 'https://images.unsplash.com/photo-1542779283-429940ce8336?w=500&h=700&fit=crop';
const backImageUrl = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

export default function CustomCard({ img = imageUrl, backimg = backImageUrl, disableClickEnlarge = false, disableHoverCardGlow = false }) {
  const cardRef = useRef(null);
  const [interact, setInteract] = useState(false);
  const [active, setActive] = useState(false);
  
  // Use backimg if provided, otherwise default to img
  const backImage = backimg || img;
  
  const [springRotate, setSpringRotate] = useSpring({ x: 0, y: 0 }, { stiffness: 0.066, damping: 0.25 });
  const [springGlare, setSpringGlare] = useSpring({ x: 50, y: 50, o: 0 }, { stiffness: 0.033, damping: 0.11 });
  const [springBackground, setSpringBackground] = useSpring({ x: 50, y: 50 }, { stiffness: 0.033, damping: 0.11 });
  const [springScale, setSpringScale] = useSpring(1, { stiffness: 0.033, damping: 0.45 });
  const [springTranslate, setSpringTranslate] = useSpring({ x: 0, y: 0 }, { stiffness: 0.033, damping: 0.45 });
  const [springRotateDelta, setSpringRotateDelta] = useSpring({ x: 0, y: 0 }, { stiffness: 0.033, damping: 0.45 });

  const round = (num, fix = 3) => parseFloat(num.toFixed(fix));

  const handleMouseMove = (e) => {
    if (!interact) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const percent = {
      x: round((100 / rect.width) * absolute.x),
      y: round((100 / rect.height) * absolute.y),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    setSpringBackground({
      x: percent.x,
      y: percent.y,
    });
    
    setSpringRotate({
      x: round(-(center.x / 3.5)),
      y: round(center.y / 2),
    });
    
    setSpringGlare({
      x: percent.x,
      y: percent.y,
      o: 1,
    });
  };

  const handleMouseEnter = () => {
    setInteract(true);
  };

  const handleMouseLeave = () => {
    setInteract(false);
    if (!active) {
      setSpringRotate({ x: 0, y: 0 });
      setSpringGlare({ x: 50, y: 50, o: 0 });
      setSpringBackground({ x: 50, y: 50 });
    }
  };

  const handleClick = () => {
    if (disableClickEnlarge) return; // Do nothing if click enlarge is disabled
    
    if (!active) {
      // Activate: enlarge and center the card with flip
      setActive(true);
      const rect = cardRef.current.getBoundingClientRect();
      const view = document.documentElement;
      
      const deltaX = round(view.clientWidth / 2 - rect.x - rect.width / 2);
      const deltaY = round(view.clientHeight / 2 - rect.y - rect.height / 2);
      
      setSpringTranslate({ x: deltaX, y: deltaY });
      
      const scaleW = (window.innerWidth / rect.width) * 0.9;
      const scaleH = (window.innerHeight / rect.height) * 0.9;
      const scaleF = 1.75;
      setSpringScale(Math.min(scaleW, scaleH, scaleF));
      
      // Always flip 360 degrees on activation
      setSpringRotateDelta({ x: 360, y: 0 });
    } else {
      // Deactivate: zoom out without flipping (4x faster)
      setActive(false);
      
      // Instantly reset rotation delta to prevent flip animation
      setSpringRotateDelta({ x: 0, y: 0 }, { hard: true });
      
      // Use 8x faster spring settings for zoom out
      setSpringScale(1, { stiffness: 0.132, damping: 0.45 });
      setSpringTranslate({ x: 0, y: 0 }, { stiffness: 0.132, damping: 0.45 });
      
      setSpringRotate({ x: 0, y: 0 });
      setSpringGlare({ x: 50, y: 50, o: 0 });
      setSpringBackground({ x: 50, y: 50 });
    }
  };

  return (
    <>
      {/* Backdrop - click to close */}
      {active && (
        <div
          onClick={handleClick}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            cursor: 'pointer',
            animation: 'fadeIn 0.3s ease-out',
          }}
        />
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      
      <div
        ref={cardRef}
        onPointerMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          width: '100%',
          aspectRatio: '0.718',
          transform: 'translate3d(0px, 0px, 0.01px)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          zIndex: active ? 120 : (interact ? 120 : 1),
          outline: '1px solid transparent',
          position: active ? 'relative' : 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'grid',
            perspective: '600px',
            transformStyle: 'preserve-3d',
            transformOrigin: 'center',
            willChange: 'transform',
            outline: '1px solid transparent',
            transform: `translate3d(${springTranslate.x}px, ${springTranslate.y}px, 0.1px) scale(${springScale})`,
            transition: active ? 'none' : 'transform 0.3s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              aspectRatio: '0.718',
              borderRadius: '4.55% / 3.5%',
              transform: `rotateY(${springRotate.x + springRotateDelta.x}deg) rotateX(${springRotate.y + springRotateDelta.y}deg)`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center',
              willChange: 'transform, box-shadow',
              cursor: disableClickEnlarge ? 'default' : 'pointer',
              outline: '1px solid transparent',
              transition: 'box-shadow 0.4s ease',
              boxShadow: (active || interact) && !disableHoverCardGlow
                ? '0 0 3px -1px white, 0 0 3px 1px hsl(47, 100%, 78%), 0 0 12px 2px hsl(175, 100%, 90%), 0px 10px 20px -5px black, 0 0 40px -30px hsl(175, 100%, 90%), 0 0 50px -20px hsl(175, 100%, 90%)'
                : '0 0 3px -1px transparent, 0 0 2px 1px transparent, 0 0 5px 0px transparent, 0px 10px 20px -5px black, 0 2px 15px -5px black, 0 0 20px 0px transparent',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridArea: '1/1',
                aspectRatio: '0.718',
                borderRadius: '4.55% / 3.5%',
                transformStyle: 'preserve-3d',
                pointerEvents: 'none',
              }}
            >
              {/* Back of card - same image, flipped */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  gridArea: '1/1',
                  aspectRatio: '0.718',
                  borderRadius: '4.55% / 3.5%',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(180deg) translateZ(1px)',
                  backfaceVisibility: 'visible',
                  overflow: 'hidden',
                  filter: 'brightness(0.07) saturate(0.25)',
                }}
              >
                <img
                  src={backImage}
                  alt="Custom card back"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    aspectRatio: '0.718',
                    borderRadius: '4.55% / 3.5%',
                    imageRendering: 'optimizeQuality',
                  }}
                />
              </div>
              
              {/* Front of card with effects */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'grid',
                  gridArea: '1/1',
                  aspectRatio: '0.718',
                  borderRadius: '4.55% / 3.5%',
                  transformStyle: 'preserve-3d',
                  transform: 'translate3d(0px, 0px, 0.01px)',
                  backfaceVisibility: 'hidden',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={img}
                  alt="Custom card"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'grid',
                    gridArea: '1/1',
                    aspectRatio: '0.718',
                    borderRadius: '4.55% / 3.5%',
                    imageRendering: 'optimizeQuality',
                    transformStyle: 'preserve-3d',
                    transform: 'translate3d(0px, 0px, 0.01px)',
                    pointerEvents: 'none',
                  }}
                />
                
                {/* Shine effect */}
                <div
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridArea: '1/1',
                    aspectRatio: '0.718',
                    borderRadius: '4.55% / 3.5%',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    transform: 'translateZ(1px)',
                    zIndex: 3,
                    background: 'transparent',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(.85) contrast(1.75) saturate(.65)',
                    mixBlendMode: 'color-dodge',
                    opacity: springGlare.o,
                  }}
                />
                
                {/* Glare spotlight */}
                <div
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridArea: '1/1',
                    aspectRatio: '0.718',
                    borderRadius: '4.55% / 3.5%',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    transform: 'translateZ(1.41px)',
                    backgroundImage: `radial-gradient(farthest-corner circle at ${springGlare.x}% ${springGlare.y}%, hsla(0, 0%, 100%, 0.8) 10%, hsla(0, 0%, 100%, 0.65) 20%, hsla(0, 0%, 0%, 0.5) 90%)`,
                    opacity: springGlare.o,
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
