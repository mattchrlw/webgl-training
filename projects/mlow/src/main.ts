import { vec3 } from 'gl-matrix';

import { RenderManager } from "./render-manager";
import { Mesh } from './mesh';
import { Program } from './program';

import vertexShaderSource from './shaders/vertex-shader.glsl?raw';
import fragmentShaderSource from './shaders/fragment-shader.glsl?raw';
import { Camera } from './camera';
import { TriangleObject } from './triangle-object';

function main() {
  const canvas = document.querySelector('#webgl-canvas')
  const renderManager = new RenderManager(canvas);
  const camera = new Camera(renderManager.canvas);
  const triangle = new TriangleObject(renderManager.gl, camera);

  renderManager.onRender(() => {
    camera.zoom = 0.5;
    camera.position[0] = Math.sin(performance.now() * 0.001);
    camera.position[1] = Math.cos(performance.now() * 0.001);
    
    triangle.render();
  });

  renderManager.startRender();
}

window.onload = main;