import { useContext, useEffect, useRef, useState } from 'react';
import { ActiveCardContext } from '../contexts/ActiveCardContext';
import useSpring from '../hooks/useSpring';
import useOrientation from '../hooks/useOrientation';

export default function CustomCard({ img }) {
  const cardRef = useRef(null);
  const [active, setActive] = useContext(ActiveCardContext);
  const [isHovered, setIsHovered] = useState(false);
  const [interact, setInteract] = useState(false);
  const [springRotate, setSpringRotate] = useSpring({ stiffness: 0.066, damping: 0.25 });
  const [springGlare, setSpringGlare] = useSpring({ stiffness: 0.033, damping: 0.11 });
  const orientation = useOrientation();

  const round = (num, fix = 3) => parseFloat(num.toFixed(fix));
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  useEffect(() => {
    if (active !== cardRef.current) {
      setInteract(false);
    }
  }, [active]);

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
    setIsHovered(true);
    setInteract(true);
    setActive(cardRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setInteract(false);
    setSpringRotate({ x: 0, y: 0 });
    setSpringGlare({ x: 50, y: 50, o: 0 });
  };

  const transform = `rotateY(${springRotate.x}deg) rotateX(${springRotate.y}deg)`;

  return (
    <div
      ref={cardRef}
      className="custom-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        willChange: 'transform',
      }}
    >
      <div
        className="custom-card__image"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />
      <div
        className="custom-card__shine"
        style={{
          backgroundPosition: `${springGlare.x}% ${springGlare.y}%`,
          opacity: springGlare.o,
        }}
      />
      <style jsx>{`
        .custom-card {
          position: relative;
          width: 100%;
          aspect-ratio: 5/7;
          border-radius: 5%;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
          cursor: pointer;
          box-shadow: 
            0 10px 30px -5px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .custom-card__image {
          position: absolute;
          inset: 0;
          border-radius: 5%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
        }

        .custom-card__shine {
          position: absolute;
          inset: 0;
          border-radius: 5%;
          background: radial-gradient(
            farthest-corner circle at var(--x, 50%) var(--y, 50%),
            rgba(255, 255, 255, 0.8) 10%,
            rgba(255, 255, 255, 0.6) 20%,
            rgba(0, 0, 0, 0.5) 90%
          );
          mix-blend-mode: color-dodge;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .custom-card:hover {
          box-shadow: 
            0 20px 40px -10px rgba(0, 0, 0, 0.5),
            0 0 0 2px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

