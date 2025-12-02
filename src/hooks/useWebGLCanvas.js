import { useEffect, useRef } from "react";
import { useShaders } from "./useShaders";
import { useWebGLProgram } from "./useWebGLProgram";
import { useMouse } from "./useMouse";
import { useTextureRenderer } from "./useTextureRenderer";

export function useWebGLCanvas(container) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const { magnifyingGlass } = useShaders();
  const { vertexShader: vertexSource, fragmentShader: fragmentSource } =
    magnifyingGlass;
  const mouse = useMouse();
  const { createProgram } = useWebGLProgram();
  const { updateTexture } = useTextureRenderer();

  useEffect(() => {
    if (!container) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      preserveDrawingBuffer: false,
      antialias: true,
      alpha: true,
    });
    if (!gl) {
      console.error("[WebGL] No context");
      return;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let program = null;
    let texture = null;
    let mounted = true;

    (async () => {
      // Esperar a la primera imagen cargada
      function waitFirstImage() {
        return new Promise((resolve) => {
          const firstImg = container.querySelector("img");
          if (!firstImg) return resolve();
          if (firstImg.complete) return resolve();
          firstImg.onload = () => resolve();
          firstImg.onerror = () => resolve();
        });
      }
      await waitFirstImage();

      try {
        program = createProgram(gl, vertexSource, fragmentSource);
      } catch (err) {
        console.error("[useWebGLCanvas] createProgram failed:", err);
        return;
      }

      // Full-screen quad
      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      gl.useProgram(program);

      // Cache attribute
      const posLoc = gl.getAttribLocation(program, "aPosition");
      if (posLoc !== -1) {
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      }

      // Crear textura
      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // Cache uniforms
      const uniforms = {
        iResolution: gl.getUniformLocation(program, "iResolution"),
        iMouse: gl.getUniformLocation(program, "iMouse"),
        iChannel0: gl.getUniformLocation(program, "iChannel0"),
      };
      if (uniforms.iChannel0) gl.uniform1i(uniforms.iChannel0, 0);

      function loop() {
        if (!mounted) return;

        const m = mouse.update();
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }

        // Renderizar solo imágenes visibles
        updateTexture(gl, container, texture, {
          viewportWidth: w,
          viewportHeight: h,
        });

        if (uniforms.iResolution) gl.uniform2f(uniforms.iResolution, w, h);
        if (uniforms.iMouse) gl.uniform2f(uniforms.iMouse, m.x, h - m.y);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        rafRef.current = requestAnimationFrame(loop);
      }

      rafRef.current = requestAnimationFrame(loop);
    })();

    const onResize = () => {
      // opcional: actualizar lógica de pan si se requiere
    };
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);

      try {
        if (texture) gl.deleteTexture(texture);
        if (program) gl.deleteProgram(program);
      } catch (e) {
        console.log(e);
      }
    };
  }, [
    container,
    vertexSource,
    fragmentSource,
    createProgram,
    updateTexture,
    mouse,
  ]);

  return canvasRef;
}
