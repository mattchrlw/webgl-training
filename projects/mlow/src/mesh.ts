import { vec2, vec3 } from "gl-matrix";
import { Program } from "./program";

interface Vertex {
  position: vec3;
  uv: vec2;
}

const COMPONENTS_PER_VERTEX = 3 + 2;

export class Mesh {
  public buffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext, private vertices: Vertex[]) {
    const buffer = this.gl.createBuffer();

    if (!buffer) {
      throw new Error("Failed to create buffer");
    }

    this.buffer = buffer;
    // like setting a global variable
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    const vertexData = new Float32Array(vertices.length * COMPONENTS_PER_VERTEX);
    for (let i = 0; i < vertices.length; i++) {
      vertexData[i * COMPONENTS_PER_VERTEX] = vertices[i].position[0];
      vertexData[i * COMPONENTS_PER_VERTEX + 1] = vertices[i].position[1];
      vertexData[i * COMPONENTS_PER_VERTEX + 2] = vertices[i].position[2];

      vertexData[i * COMPONENTS_PER_VERTEX + 3] = vertices[i].uv[0]; // u
      vertexData[i * COMPONENTS_PER_VERTEX + 4] = vertices[i].uv[1]; // v
    }

    // either STATIC_DRAW or DYNAMIC_DRAW. Basically saying, do you intend to change this?
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  render(
    program: Program, 
    positionAttributeName: string,
    uvAttributeName: string,
  ): void {
    program.use();

    const positionAttributeLocation = program.getAttribLocation(positionAttributeName);
    const uvAttributeLocation = program.getAttribLocation(uvAttributeName);

    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.enableVertexAttribArray(uvAttributeLocation);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(
      positionAttributeLocation, 
      3, 
      this.gl.FLOAT, 
      false, 
      COMPONENTS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    this.gl.vertexAttribPointer(
      uvAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      COMPONENTS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT,
      3 * Float32Array.BYTES_PER_ELEMENT
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length);

    // Clean up stuff
    this.gl.disableVertexAttribArray(positionAttributeLocation);
    this.gl.disableVertexAttribArray(uvAttributeLocation);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }
}