import React, { useEffect, useRef, useState } from "react";
import "./portada.css";

const PaulaPortfolio = () => {
  const imagesRef = useRef([]);
  const globalIndexRef = useRef(0);
  const lastRef = useRef({ x: 0, y: 0 });
  const activeImagesRef = useRef([]);
  const fadeTimeoutRef = useRef(null);
  const isFadingRef = useRef(false);

  // Array of image sources (you'll need to replace these with actual image paths)
  const imageSources = [
    "/fotos/portada/1.jpeg",
    "/fotos/portada/2.jpeg",
    "/fotos/portada/3.jpeg",
    "/fotos/portada/4.jpeg",
    "/fotos/portada/5.jpeg",
    "/fotos/portada/6.jpeg",
    "/fotos/portada/7.jpeg",
    "/fotos/portada/8.jpeg",
    "/fotos/portada/9.jpeg",
    "/fotos/portada/10.jpeg",
  ];

  const [imageStatuses, setImageStatuses] = useState(
    imageSources.map(() => "inactive")
  );

  const activate = (imageIndex, x, y) => {
    const image = imagesRef.current[imageIndex];
    if (!image) return;

    image.style.left = `${x}px`;
    image.style.top = `${y}px`;
    image.style.zIndex = globalIndexRef.current.toString();

    setImageStatuses((prev) => {
      const newStatuses = [...prev];
      newStatuses[imageIndex] = "active";
      return newStatuses;
    });

    // Add to active images queue
    activeImagesRef.current.push({
      element: image,
      index: imageIndex,
      timestamp: Date.now(),
      globalIndex: globalIndexRef.current,
    });

    lastRef.current = { x, y };
  };

  const distanceFromLast = (x, y) => {
    return Math.hypot(x - lastRef.current.x, y - lastRef.current.y);
  };

  const startFading = () => {
    if (isFadingRef.current || activeImagesRef.current.length === 0) return;

    isFadingRef.current = true;

    const fadeNextImage = () => {
      if (activeImagesRef.current.length === 0) {
        isFadingRef.current = false;
        return;
      }

      // Take the first (oldest) image
      const oldestImage = activeImagesRef.current.shift();
      const imageIndex = oldestImage.index;

      // Start fade out
      setImageStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[imageIndex] = "fading";
        return newStatuses;
      });

      // After transition, hide completely
      setTimeout(() => {
        setImageStatuses((prev) => {
          const newStatuses = [...prev];
          newStatuses[imageIndex] = "inactive";
          return newStatuses;
        });
        // Continue with next image
        setTimeout(fadeNextImage, 150); // 150ms between each fade
      }, 200); // CSS transition duration
    };

    fadeNextImage();
  };

  const resetFadeTimer = () => {
    // Clear previous timeout
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    // Reset flag if it was in fade process
    isFadingRef.current = false;

    // Set new timeout to start fade after 500ms without movement
    fadeTimeoutRef.current = setTimeout(startFading, 500);
  };

  const handleOnMove = (e) => {
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);

    if (distanceFromLast(currentX, currentY) > window.innerWidth / 10) {
      const leadIndex = globalIndexRef.current % imageSources.length;
      const tailIndex = (globalIndexRef.current - 5) % imageSources.length;

      activate(leadIndex, currentX, currentY);

      if (tailIndex >= 0 && globalIndexRef.current >= 5) {
        setImageStatuses((prev) => {
          const newStatuses = [...prev];
          newStatuses[tailIndex] = "inactive";
          return newStatuses;
        });

        // Remove from activeImages if it's there
        activeImagesRef.current = activeImagesRef.current.filter(
          (img) => img.index !== tailIndex
        );
      }

      globalIndexRef.current++;
    }

    // Reset timer every time there's movement
    resetFadeTimer();
  };

  const handleMouseLeave = () => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    fadeTimeoutRef.current = setTimeout(startFading, 500);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleOnMove(e);
    const handleTouchMove = (e) => handleOnMove(e.touches[0]);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="portada">


      <div className="titulo-container">
        <p className="titulo">Paula</p>
        <p className="resgistrada">®</p>
      </div>

      {imageSources.map((src, index) => (
        <img
          key={index}
          ref={(el) => (imagesRef.current[index] = el)}
          className={`image ${imageStatuses[index]}`}
          src={src}
          alt={`Portfolio image ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PaulaPortfolio;
