import { vec2, vec3, mat4 } from 'gl-matrix';

export class Camera {
  public position: vec2;
  public zoom: number;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.position = vec2.fromValues(0, 0);
    this.zoom = 1;
  }

  getViewProjectionMatrix(): mat4 {
    const aspectRatio = this.canvas.width / this.canvas.height;
    const screenHeight = 2; // world unit height
    const screenWidth = screenHeight * aspectRatio;

    const zoomedScreenWidth = screenWidth / this.zoom;
    const zoomedScreenHeight = screenHeight / this.zoom;

    const near = -1;
    const far = 1;

    const totalDepth = far - near;
    const clipSpaceRange = 2;

    const scaleX = clipSpaceRange / zoomedScreenWidth;
    const scaleY = clipSpaceRange / zoomedScreenHeight;
    const scaleZ = clipSpaceRange / totalDepth;

    const scalingMatrix = mat4.fromScaling(
      mat4.create(),
      vec3.fromValues(scaleX, scaleY, scaleZ)
    );

    const cameraMatrix = mat4.fromTranslation(
      mat4.create(),
      vec3.fromValues(-this.position[0], -this.position[1], 0)
    );

    const viewProjectionMatrix = mat4.create();
    mat4.multiply(
      // Where to store the result
      viewProjectionMatrix,
      // Calculate `scalingMatrix` * `cameraMatrix`
      scalingMatrix,
      cameraMatrix
    );

    return viewProjectionMatrix;
  }
}