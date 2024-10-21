export class RenderManager {
  public gl: WebGL2RenderingContext;
  public canvas: HTMLCanvasElement;
  public alpha: number;

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
    this.alpha = 0;
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

    this.alpha = (this.alpha + 0.01) % 1;

    console.log(this.alpha);

    this.gl.clearColor(0, 0, 0, this.alpha);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    requestAnimationFrame(this.render);
  }
  
}