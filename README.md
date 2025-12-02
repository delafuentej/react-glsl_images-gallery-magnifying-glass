# Interactive WebGL Image Gallery with Magnifying Glass Effect using GLSL shaders.

## Overview

This project is a **React + Vite** application that displays a **gallery of images** over which a **magnifying glass effect** is applied using **WebGL and GLSL shaders**. The magnifying glass enlarges and distorts the images below it, including a **chromatic-aberration and distortion effect**, providing a visually striking interactive gallery experience.

A WebGL-powered magnifying glass follows the cursor, creating a **zoomed, distorted view** with chromatic aberration.

- **300 images** arranged in a pseudo-random grid.
- **Magnifying glass** with GLSL shaders:
  - Zoom and distortion
  - Chromatic aberration effect
- **Smooth camera pan** following mouse movement.

---

## 📸 Demo

**🌐 Live Demo:** [fake-3d-images-gallery](https://react-glsl-images-gallery-magnifyin.vercel.app/)

<p align="center" width="100%">
<img src="public/images/app/app1.png" width="45%" />
<img src="public/images/app/app2.png" width="45%" />

</p>

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

## Architecture

- **App** – Root component that manages the reference to the gallery container.
- **ImagesGallery** – Renders the gallery of images and exposes a container reference for WebGL rendering.
- **WebGLCanvas** – Renders a `<canvas>` using WebGL and applies GLSL shaders for the magnifying glass effect.
- **Custom Hooks** – Utilities that manage shaders, textures, mouse input, and WebGL program creation.

---

## Usage

- Move the mouse over the gallery to see the magnifying glass follow the cursor.

- The magnifying glass dynamically enlarges and distorts the images underneath with chromatic aberration effects.

- Resize the browser to see responsive behavior.

---

## Performance Optimizations

- Partial rendering: Only images visible in the viewport are drawn into the WebGL texture.

- Uniform & attribute caching: GLSL uniforms and attributes are cached to avoid redundant WebGL calls each frame.

- Smooth mouse easing: Prevents jittery movement while maintaining responsiveness.

- RAF cleanup: All requestAnimationFrame loops and event listeners are properly cleaned up to avoid memory leaks.

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/delafuentej/react-glsl_images-gallery-magnifying-glass.git
   ```
2. Navigate to the project directory:
   ```bash
   cd react-glsl_images-gallery-magnifying-glass
   ```
3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
    yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

---

📄 MIT License
