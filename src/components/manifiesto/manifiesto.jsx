import { useEffect, useRef } from 'react';
import './manifiesto.css';

const ManifestoSection = () => {
  const overlayRef = useRef(null);
  const targetsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

useEffect(() => {
  const overlay = overlayRef.current;
  if (!overlay) return;

  const images = overlay.querySelectorAll('img');

  // multiplica o reduce aquí si quieres el efecto más fuerte o suave
  const RADIUS_FACTOR = 1.2;   // radio ≈ 1.2 × diagonal de la imagen
  const PUSH_FACTOR   = 3.5;   // empuje máx ≈ 3.5 × diagonal de la imagen
  const stiffness = 0.12;

  targetsRef.current = Array.from(images).map(img => ({
    element: img,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    originalTransform: img.dataset.transform || ''
  }));

  const mouse = mouseRef.current;

  const handleMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  const handleMouseLeave = () => {
    mouse.x = -1000;
    mouse.y = -1000;
  };

  let rafId;

  const updateImagePositions = () => {
    targetsRef.current.forEach(item => {
      const img = item.element;
      const rect = img.getBoundingClientRect();

      // tamaño característico de la imagen (diagonal)
      const diag = Math.hypot(rect.width, rect.height);

      // radio y empuje máximos adaptados al tamaño de la imagen
      const repulsionRadius = Math.max(60, diag * RADIUS_FACTOR);
      const maxPushDistance = Math.max(140, diag * PUSH_FACTOR);

      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;

      const dx = cx - mouse.x;
      const dy = cy - mouse.y;
      const dist = Math.hypot(dx, dy);

      let targetPushX = 0, targetPushY = 0;

      if (dist > 0 && dist < repulsionRadius) {
        const proximity = 1 - (dist / repulsionRadius);      // 0..1
        // curva suave (cúbica) para que no sea brusco al acercarse
        const push = Math.pow(proximity, 3) * maxPushDistance;

        const ux = dx / dist;
        const uy = dy / dist;

        targetPushX = ux * push;
        targetPushY = uy * push;
      } else if (dist === 0) {
        targetPushX = maxPushDistance;
      }

      item.targetX = targetPushX;
      item.targetY = targetPushY;

      item.currentX += (item.targetX - item.currentX) * stiffness;
      item.currentY += (item.targetY - item.currentY) * stiffness;

      const x = Math.round(item.currentX);
      const y = Math.round(item.currentY);

      // usa translate3d para mejor rendimiento (GPU)
      img.style.transform = `translate3d(${x}px, ${y}px, 0) ${item.originalTransform}`;
    });

    rafId = requestAnimationFrame(updateImagePositions);
  };

  overlay.addEventListener('mousemove', handleMouseMove);
  overlay.addEventListener('mouseleave', handleMouseLeave);
  rafId = requestAnimationFrame(updateImagePositions);

  return () => {
    overlay.removeEventListener('mousemove', handleMouseMove);
    overlay.removeEventListener('mouseleave', handleMouseLeave);
    cancelAnimationFrame(rafId);
  };
}, []);


  return (
    <div className="manifiesto">
      
      
      <div className="img-overlay" ref={overlayRef}>
        <img 
          src="/fotos/manifiesto/mac.png" 
          alt="" 
          className="img-mac" 
          data-transform="rotate(-10deg)" 
        />
        <img 
          src="/fotos/manifiesto/chiclesOrbit.png" 
          alt="" 
          className="img-chicles" 
          data-transform="rotate(-40deg)" 
        />
        <img 
          src="/fotos/manifiesto/gafas.png" 
          alt="" 
          className="img-gafas" 
          data-transform="" 
        />
        <img 
          src="/fotos/manifiesto/cacao.png" 
          alt="" 
          className="img-cacao" 
          data-transform="" 
        />
        <img 
          src="/fotos/manifiesto/headphones.png" 
          alt="" 
          className="img-headphones" 
          data-transform="rotate(40deg)" 
        />
        <img 
          src="/fotos/manifiesto/lapices.png" 
          alt="" 
          className="img-lapices" 
          data-transform="rotate(-50deg)" 
        />
        <img 
          src="/fotos/manifiesto/matcha.png" 
          alt="" 
          className="img-matcha" 
          data-transform="rotate(90deg)" 
        />
        <img 
          src="/fotos/manifiesto/papelBlanco.png" 
          alt="" 
          className="img-papel" 
          data-transform="rotate(5deg)" 
        />
        <img 
          src="/fotos/manifiesto/posits.png" 
          alt="" 
          className="img-posits" 
          data-transform="rotate(-70deg)" 
        />
        <img 
          src="/fotos/manifiesto/papeles.png" 
          alt="" 
          className="img-papeles" 
          data-transform="" 
        />
        <img 
          src="/fotos/manifiesto/libreta.png" 
          alt="" 
          className="img-libreta" 
          data-transform="rotate(-20deg)" 
        />
        <img 
          src="/fotos/manifiesto/walpaperIphone.jpg" 
          alt="" 
          className="img-walpaperIphone" 
          data-transform="rotate(53deg)" 
        />
      </div>
      
      <p className="txt">
        Siempre he pensado que las ideas buenas necesitan <span>paz</span> para coger forma y <span>caos</span> para cobrar vida
      </p>
    </div>
  );
};

export default ManifestoSection;