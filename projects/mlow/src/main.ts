import { vec3 } from 'gl-matrix';

import { RenderManager } from "./render-manager";
import { Mesh } from './mesh';

function main() {
  const canvas = document.querySelector('#webgl-canvas')
  const renderManager = new RenderManager(canvas);

  const vertices = [
    vec3.fromValues(0, 0.5, 0),
    vec3.fromValues(-0.5, -0.5, 0),
    vec3.fromValues(0.5, -0.5, 0)
  ]

  const triangle = new Mesh(renderManager.gl, vertices);

  renderManager.startRender();
}

window.onload = main;