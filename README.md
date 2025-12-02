# Interactive WebGL image gallery with magnifying glass effect using GLSL shaders.

## Overview

This project is a **React + Vite** application that displays a gallery of images.
A WebGL-powered magnifying glass follows the cursor, creating a **zoomed, distorted view** with chromatic aberration.

![Preview](./preview.gif)

- **300 images** arranged in a pseudo-random grid.
- **Magnifying glass** with GLSL shaders:
  - Zoom and distortion
  - Chromatic aberration effect
- **Smooth camera pan** following mouse movement.

---

## Features

- React components:
  - `ImagesGallery`: generates the image grid.
  - `WebGLCanvas`: renders the magnifying glass effect using WebGL shaders.
- Custom hooks:
  - `useWebGLCanvas`: manages shaders, uniforms, RAF loop.
  - `useTextureRenderer`: converts DOM images into WebGL texture.
  - `useMouse`: smooth mouse tracking.
  - `useShaders`: provides vertex and fragment shaders.
  - `useWebGLProgram`: shader compilation and program linking.

---

## Installation

```bash
git clone https://github.com/delafuentej/react-glsl_images-gallery-magnifying-glass.git
cd react-glsl_images-gallery-magnifying-glass
npm install
npm run dev
```
