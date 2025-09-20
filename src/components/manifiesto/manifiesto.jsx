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
    
    // Parámetros del Efecto
    const repulsionRadius = 300;
    const maxPushDistance = 800;
    const stiffness = 0.1;

    // Inicializar targets
    targetsRef.current = Array.from(images).map(img => ({
      element: img,
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      originalTransform: img.dataset.transform || ''
    }));

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const updateImagePositions = () => {
      targetsRef.current.forEach(item => {
        const img = item.element;
        const rect = img.getBoundingClientRect();

        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;

        const deltaX = imgCenterX - mouseRef.current.x;
        const deltaY = imgCenterY - mouseRef.current.y;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        let targetPushX = 0;
        let targetPushY = 0;

        if (distance < repulsionRadius && distance > 0) {
          const proximityFactor = 1 - (distance / repulsionRadius);
          const pushForce = proximityFactor * maxPushDistance;

          const pushDirectionX = deltaX / distance;
          const pushDirectionY = deltaY / distance;

          targetPushX = pushDirectionX * pushForce;
          targetPushY = pushDirectionY * pushForce;
        } else if (distance === 0) {
          targetPushX = maxPushDistance;
          targetPushY = 0;
        }

        item.targetX = targetPushX;
        item.targetY = targetPushY;

        item.currentX += (item.targetX - item.currentX) * stiffness;
        item.currentY += (item.targetY - item.currentY) * stiffness;

        const finalX = Math.round(item.currentX);
        const finalY = Math.round(item.currentY);
        
        img.style.transform = `translate(${finalX}px, ${finalY}px) ${item.originalTransform}`;
      });

      requestAnimationFrame(updateImagePositions);
    };

    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mouseleave', handleMouseLeave);

    // Iniciar el bucle de animación
    updateImagePositions();

    // Cleanup
    return () => {
      overlay.removeEventListener('mousemove', handleMouseMove);
      overlay.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="manifiesto">
      
      
      <div className="img-overlay" ref={overlayRef}>
        <img 
          src="fotos/manifiesto/mac.png" 
          alt="" 
          className="img-mac" 
          data-transform="rotate(-10deg)" 
        />
        <img 
          src="fotos/manifiesto/chiclesOrbit.png" 
          alt="" 
          className="img-chicles" 
          data-transform="rotate(-40deg)" 
        />
        <img 
          src="fotos/manifiesto/gafas.png" 
          alt="" 
          className="img-gafas" 
          data-transform="" 
        />
        <img 
          src="fotos/manifiesto/cacao.png" 
          alt="" 
          className="img-cacao" 
          data-transform="" 
        />
        <img 
          src="fotos/manifiesto/headphones.png" 
          alt="" 
          className="img-headphones" 
          data-transform="rotate(40deg)" 
        />
        <img 
          src="fotos/manifiesto/lapices.png" 
          alt="" 
          className="img-lapices" 
          data-transform="rotate(-50deg)" 
        />
        <img 
          src="fotos/manifiesto/matcha.png" 
          alt="" 
          className="img-matcha" 
          data-transform="rotate(90deg)" 
        />
        <img 
          src="fotos/manifiesto/papelBlanco.png" 
          alt="" 
          className="img-papel" 
          data-transform="rotate(5deg)" 
        />
        <img 
          src="fotos/manifiesto/posits.png" 
          alt="" 
          className="img-posits" 
          data-transform="rotate(-70deg)" 
        />
        <img 
          src="fotos/manifiesto/papeles.png" 
          alt="" 
          className="img-papeles" 
          data-transform="" 
        />
        <img 
          src="fotos/manifiesto/libreta.png" 
          alt="" 
          className="img-libreta" 
          data-transform="rotate(-20deg)" 
        />
        <img 
          src="fotos/manifiesto/walpaperIphone.jpg" 
          alt="" 
          className="img-walpaperIphone" 
          data-transform="rotate(20deg)" 
        />
      </div>
      
      <p className="txt">
        Siempre he pensado que las ideas buenas necesitan <span>paz</span> para coger forma y <span>caos</span> para cobrar vida
      </p>
    </div>
  );
};

export default ManifestoSection;