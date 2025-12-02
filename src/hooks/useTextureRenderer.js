// src/hooks/useTextureRenderer.
// devuelve función pura updateTexture(gl, container, texture)

// src/hooks/useTextureRenderer.js
export function useTextureRenderer() {
  //cachear canvas temporal
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  const scale = 4;

  function updateTexture(gl, container, texture) {
    if (!container) return;

    //dimensiones
    const w = Math.floor(window.innerWidth * scale);
    const h = Math.floor(window.innerHeight * scale);

    //evitar realocar si no es necesario
    if (tempCanvas.width !== w) tempCanvas.width = w;
    if (tempCanvas.height !== h) tempCanvas.height = h;

    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = "high";
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, w, h);

    //obtener transform real aplicando la matriz actual
    const style = getComputedStyle(container);
    const matrix = new DOMMatrix(
      style.transform === "none" ? undefined : style.transform
    );

    //aplicar transform (sin duplicar rect offset)
    tempCtx.setTransform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e * scale,
      matrix.f * scale
    );

    //dibujar imágenes
    const viewport = container.getBoundingClientRect();
    const images = container.getElementsByTagName("img");

    for (let img of images) {
      const parent = img.parentElement.getBoundingClientRect();

      tempCtx.drawImage(
        img,
        (parent.left - viewport.left) * scale,
        (parent.top - viewport.top) * scale,
        parent.width * scale,
        parent.height * scale
      );
    }

    // reset transform
    tempCtx.setTransform(1, 0, 0, 1, 0, 0);

    //subir textura a WebGL
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      tempCanvas
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  return { updateTexture };
}
//
// export function useTextureRenderer() {
// function updateTexture(gl, container, texture) {
// if (!container) return;
//
// const tempCanvas = document.createElement("canvas");
// const scale = 4;
// tempCanvas.width = Math.floor(window.innerWidth * scale);
// tempCanvas.height = Math.floor(window.innerHeight * scale);
// const tempCtx = tempCanvas.getContext("2d");
//
// tempCtx.imageSmoothingEnabled = true;
// tempCtx.imageSmoothingQuality = "high";
// tempCtx.fillStyle = "white";
// tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
//
// const viewportRect = container.getBoundingClientRect();
// const matrix = new DOMMatrix(getComputedStyle(container).transform);
//
// tempCtx.setTransform(
// matrix.a,
// matrix.b,
// matrix.c,
// matrix.d,
// matrix.e * scale,
// matrix.f * scale
// );
//
// const images = container.getElementsByTagName("img");
// for (let img of images) {
// const parent = img.parentElement.getBoundingClientRect();
// tempCtx.drawImage(
// img,
// (parent.left - viewportRect.left) * scale,
// (parent.top - viewportRect.top) * scale,
// parent.width * scale,
// parent.height * scale
// );
// }
//
// tempCtx.setTransform(1, 0, 0, 1, 0, 0);
//
// gl.bindTexture(gl.TEXTURE_2D, texture);
// gl.texImage2D(
// gl.TEXTURE_2D,
// 0,
// gl.RGBA,
// gl.RGBA,
// gl.UNSIGNED_BYTE,
// tempCanvas
// );
//
// parámetros (asegúrate de setear estos siempre)
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
// }
//
// return { updateTexture };
// }
//
//
