import { vec3 } from "gl-matrix";

export class Mesh {
  public buffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext, vertices: vec3[]) {
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error("Failed to create buffer");
    }

    this.buffer = buffer;
    // like setting a global variable
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const vertexData = new Float32Array(vertices.length * 3);
    for (let i = 0; i < vertices.length; i++) {
      vertexData[i * 3] = vertices[i][0];
      vertexData[i * 3 + 1] = vertices[i][1];
      vertexData[i * 3 + 2] = vertices[i][2];
    }

    // either STATIC_DRAW or DYNAMIC_DRAW. Basically saying, do you intend to change this?
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}