import { RenderManager } from "./render-manager";

function main() {
  const canvas = document.querySelector('#webgl-canvas')
  const renderManager = new RenderManager(canvas);

  renderManager.startRender();
}

window.onload = main;