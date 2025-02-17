import { RenderManager } from "./render-manager";
import { Camera } from './camera';
import { TriangleObject } from './triangle-object';

function main() {
  const canvas = document.querySelector('#webgl-canvas')
  const renderManager = new RenderManager(canvas);
  const camera = new Camera(renderManager.canvas);
  const triangle = new TriangleObject(renderManager.gl, camera);

  renderManager.onRender(() => {
    camera.zoom = 1;
    camera.position[0] = Math.sin(performance.now() * 0.001);
    camera.position[1] = Math.cos(performance.now() * 0.001);
    
    triangle.render();
  });

  renderManager.startRender();
}

window.onload = main;