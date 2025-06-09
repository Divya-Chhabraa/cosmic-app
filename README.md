# cosmic-app

## LIVE PREVIEW : https://cosmic-app.vercel.app/

## Setup instructions

1. Clone the repository  
   git clone https://github.com/Divya-Chhabraa/cosmic-app.git 

2. Go into the project folder  
   cd threejs-cosmic-app  

3. Open the project folder with a live server extension (like Live Server in VS Code) or any HTTP server to serve the files.  

4. Right click the index.html file and select open with live server (Alt+L Alt+O).


## Technical approach

This project is built using Three.js, a powerful JavaScript 3D library that leverages WebGL for rendering interactive 3D graphics in the browser.

The core visual consists of multiple images loaded as sprites arranged evenly around a circular path in 3D space. The circle slowly rotates around its vertical axis, creating a dynamic and engaging visual effect. Each sprite gently floats up and down using a sine wave function to add natural movement and prevent a static appearance.

To enhance user interaction, raycasting is implemented to detect mouse hover on sprites. When a sprite is hovered, it smoothly scales up to highlight the focused element, providing visual feedback to the user.

The background is filled with thousands of star points generated using custom radial gradient textures on small point geometries. This creates a deep space atmosphere. Additionally, two mini galaxies composed of thousands of points are positioned on either side of the scene, each slowly rotating in opposite directions to add visual interest and complexity.

Lighting is achieved using ambient and directional lights to softly illuminate the sprites and the scene, enhancing depth perception.

The camera is positioned to provide a clear view of the entire circular arrangement of sprites, and the scene responds dynamically to window resizing to maintain aspect ratio and layout.

Furthermore, some HTML elements outside the Three.js canvas are animated using scroll events and easing functions to create a smooth, coordinated movement that complements the 3D scene, adding to the overall immersive user experience.


