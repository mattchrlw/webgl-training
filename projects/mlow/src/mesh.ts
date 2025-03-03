import { vec2, vec3 } from "gl-matrix";
import { Program } from "./program";

interface Vertex {
  position: vec3;
  uv: vec2;
}

interface InstanceAttributeDefinition {
  name: string;
  size: number;
}

interface InstanceAttribute extends InstanceAttributeDefinition {
  offset: number;
}

const COMPONENTS_PER_VERTEX = 3 + 2;

export class Mesh {
  public buffer: WebGLBuffer;
  public instanceBuffer: WebGLBuffer;
  private instanceCount: number = 0;
  private instanceAttributes: Map<string, InstanceAttribute> = new Map();
  private instanceAttributeSize: number = 0;

  constructor(
    private gl: WebGL2RenderingContext, 
    private vertices: Vertex[],
    instanceAttributeDefinitions: InstanceAttributeDefinition[] = []
  ) {
    const buffer = this.gl.createBuffer();

    if (!buffer) {
      throw new Error("Failed to create buffer");
    }

    this.buffer = buffer;

    const instanceBuffer = this.gl.createBuffer();

    if (!instanceBuffer) {
      throw new Error("Failed to create instance buffer");
    }
    this.instanceBuffer = buffer;

    let offset = 0;
    for (const attr of instanceAttributeDefinitions) {
      this.instanceAttributes.set(attr.name, {
        ...attr,
        offset,
      })

      offset += attr.size;
      this.instanceAttributeSize += attr.size;
    }

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

  setInstanceCount(count: number) {
    this.instanceCount = count;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);
    const instanceData = new Float32Array(
      count * this.instanceAttributeSize
    )
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      instanceData,
      this.gl.DYNAMIC_DRAW  
    )

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  setInstanceProperty<T extends Float32Array>(
    index: number,
    name: string,
    data: T,
  ) {
    const attribute = this.instanceAttributes.get(name);
    if (!attribute) {
      throw new Error(`Invalid instance attribute name: ${name}`);
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);
    this.gl.bufferSubData(
      this.gl.ARRAY_BUFFER,
      (index * this.instanceAttributeSize + attribute.offset) * Float32Array.BYTES_PER_ELEMENT, data
    );

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

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);

    for (const [name, attribute] of this.instanceAttributes) {
      const attribLocation = program.getAttribLocation(name);
      this.gl.enableVertexAttribArray(attribLocation);

      this.gl.vertexAttribPointer(
        attribLocation, 
        attribute.size,
        this.gl.FLOAT,
        false,
        this.instanceAttributeSize * Float32Array.BYTES_PER_ELEMENT,
        attribute.offset * Float32Array.BYTES_PER_ELEMENT
      );

      this.gl.vertexAttribDivisor(attribLocation, 1);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.gl.drawArraysInstanced(
      this.gl.TRIANGLES,
      0,
      this.vertices.length,
      this.instanceCount
    );

    // Clean up stuff
    this.gl.disableVertexAttribArray(positionAttributeLocation);
    this.gl.disableVertexAttribArray(uvAttributeLocation);
    this.gl.useProgram(null);
  }
}