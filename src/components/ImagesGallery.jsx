import React, { useEffect, useRef } from "react";

const ImagesGallery = ({ onContainerReady }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const imgSources = Array.from(
      { length: 50 },
      (_, i) => `/images/optimized/${i + 1}.webp`
    );

    function getRandomImage() {
      return imgSources[Math.floor(Math.random() * imgSources.length)];
    }

    // Crear las 300 celdas
    for (let i = 0; i < 300; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = "img-wrapper";

      const img = document.createElement("img");
      const src = getRandomImage();
      img.src = src;
      img.alt = src.split("/").pop().replace(".webp", "");
      wrapper.appendChild(img);

      container.appendChild(wrapper);
    }
    // --- 2. VARIABLES ORIGINALES DE TU CÓDIGO ---
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // --- 3. FUNCIONES IGUALES A TU PROYECTO ---
    function updatePan(mouseX, mouseY) {
      const maxX = container.offsetWidth - window.innerWidth;
      const maxY = container.offsetHeight - window.innerHeight;

      targetX = -((mouseX / window.innerWidth) * maxX * 0.75);
      targetY = -((mouseY / window.innerHeight) * maxY * 0.75);
    }

    function animatePan() {
      const ease = 0.035;

      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      container.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(animatePan);
    }

    // --- 4. EVENTO DE MOUSEMOVE ---
    const onMove = (e) => {
      updatePan(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", onMove);

    // --- 5. INICIAR ANIMACIÓN ---
    requestAnimationFrame(animatePan);

    // Entregamos el contenedor al componente WebGL
    onContainerReady(container);
    return () => {
      // limpiar DOM si el componente se desmonta
      container.innerHTML = "";
    };
  }, []);
  return (
    <div className="viewport">
      <div ref={containerRef} className="container"></div>
    </div>
  );
};

export default ImagesGallery;
