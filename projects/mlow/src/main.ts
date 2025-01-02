import { vec3 } from 'gl-matrix';

import { RenderManager } from "./render-manager";
import { Mesh } from './mesh';
import { Program } from './program';

import vertexShaderSource from './shaders/vertex-shader.glsl?raw';
import fragmentShaderSource from './shaders/fragment-shader.glsl?raw';

function main() {
  const canvas = document.querySelector('#webgl-canvas')
  const renderManager = new RenderManager(canvas);

  const vertices = [
    vec3.fromValues(0, 0.5, 0),
    vec3.fromValues(-0.5, -0.5, 0),
    vec3.fromValues(0.5, -0.5, 0)
  ]

  const triangle = new Mesh(renderManager.gl, vertices);
  const program = new Program(renderManager.gl, vertexShaderSource, fragmentShaderSource);
  const colourUniform = program.getUniformLocation('uColour');

  renderManager.onRender(() => {
    program.setUniform3f(colourUniform, vec3.fromValues(Math.sin(performance.now() * 0.005) / 2 + 0.5, 0, 0))
    triangle.render(program, 'aPosition');
  });

  renderManager.startRender();
}

window.onload = main;