import { vec3 } from "gl-matrix";
import { Program } from "./program";

export class Mesh {
  public buffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext, private vertices: vec3[]) {
    const buffer = this.gl.createBuffer();

    if (!buffer) {
      throw new Error("Failed to create buffer");
    }

    this.buffer = buffer;
    // like setting a global variable
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    const vertexData = new Float32Array(vertices.length * 3);
    for (let i = 0; i < vertices.length; i++) {
      vertexData[i * 3] = vertices[i][0];
      vertexData[i * 3 + 1] = vertices[i][1];
      vertexData[i * 3 + 2] = vertices[i][2];
    }

    // either STATIC_DRAW or DYNAMIC_DRAW. Basically saying, do you intend to change this?
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  render(program: Program, positionAttributeName: string): void {
    program.use();

    const positionAttributeLocation = program.getAttribLocation(positionAttributeName);

    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(positionAttributeLocation, 3, this.gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length);

    // Clean up stuff
    this.gl.disableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }
}