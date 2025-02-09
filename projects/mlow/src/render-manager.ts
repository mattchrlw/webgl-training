export class RenderManager {
  public gl: WebGL2RenderingContext;
  public canvas: HTMLCanvasElement;

  private onRenderCallbacks: (() => void)[] = [];

  constructor(canvas: Element | null) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Canvas element not found')
    }

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL2 not supported')
    }

    this.canvas = canvas;
    this.gl = gl;
  }

  public onRender(callback: () => void) {
    this.onRenderCallbacks.push(callback);
  }

  public startRender() {
    requestAnimationFrame(this.render.bind(this));
  }

  public render = () => {
    const width = this.canvas.clientWidth * window.devicePixelRatio;
    const height = this.canvas.clientHeight * window.devicePixelRatio;

    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);

    const lum = Math.sin(performance.now() * 0.005 + Math.PI) / 2 + 0.5;

    this.gl.clearColor(lum, lum, lum, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    for (const callback of this.onRenderCallbacks) {
      callback();
    }

    requestAnimationFrame(this.render);
  }
  
}