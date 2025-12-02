export function useTextureRenderer() {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  const scale = window.devicePixelRatio || 2;

  function updateTexture(
    gl,
    container,
    texture,
    { viewportWidth, viewportHeight } = {}
  ) {
    if (!container) return;

    const w = Math.floor((viewportWidth || window.innerWidth) * scale);
    const h = Math.floor((viewportHeight || window.innerHeight) * scale);

    if (tempCanvas.width !== w) tempCanvas.width = w;
    if (tempCanvas.height !== h) tempCanvas.height = h;

    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = "high";
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, w, h);

    const style = getComputedStyle(container);
    const matrix = new DOMMatrix(
      style.transform === "none" ? undefined : style.transform
    );

    tempCtx.setTransform(
      matrix.a,
      matrix.b,
      matrix.c,
      matrix.d,
      matrix.e * scale,
      matrix.f * scale
    );

    const viewport = container.getBoundingClientRect();
    const images = container.getElementsByTagName("img");

    for (let img of images) {
      const parent = img.parentElement.getBoundingClientRect();

      // Renderizar solo si visible en viewport
      if (
        parent.right < viewport.left ||
        parent.left > viewport.right ||
        parent.bottom < viewport.top ||
        parent.top > viewport.bottom
      )
        continue;

      tempCtx.drawImage(
        img,
        (parent.left - viewport.left) * scale,
        (parent.top - viewport.top) * scale,
        parent.width * scale,
        parent.height * scale
      );
    }

    tempCtx.setTransform(1, 0, 0, 1, 0, 0);

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
