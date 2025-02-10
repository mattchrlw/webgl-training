/**
 * Represents a WebGL texture, which can be used to apply images or patterns to
 * 3D objects.
 *
 * In WebGL, textures are images that can be mapped onto the surface of 3D
 * objects. They're commonly used to add detail, color patterns, or realistic
 * surfaces to objects without needing complex geometry.
 *
 * Common uses include:
 * 1. Adding images to surfaces (like a photo on a billboard)
 * 2. Creating patterns (like a brick wall or checkerboard)
 * 3. Storing data that can be sampled in shaders
 *
 * This class provides a simple interface for creating and managing 2D textures,
 * with methods to load images and bind textures for rendering.
 */
export class Texture {
  /** The WebGL texture object that this class wraps. */
  private texture: WebGLTexture;

  /**
   * Creates a new Texture instance.
   *
   * @param gl The WebGL rendering context.
   * @param image The image to use as the texture. This can be an
   * HTMLImageElement, HTMLCanvasElement, or similar source.
   */
  constructor(
    private gl: WebGL2RenderingContext,
    image: TexImageSource,
  ) {
    // Create a new texture object
    const texture = this.gl.createTexture();
    if (!texture) {
      throw new Error('Failed to create texture');
    }
    this.texture = texture;

    // Bind the texture to work with it
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // WebGL has a lot of quirks. One of them is that it expects image data to
    // be provided from the bottom row of pixels first, while images are usually
    // provided from the top row first. This line tells the browser to flip the
    // image vertically when copying it to the GPU, so it displays correctly.
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

    // Copy the image data into the GPU
    this.gl.texImage2D(
      this.gl.TEXTURE_2D, // target: The type of texture we're working with
      0, // level: Mipmap level (0 is base level)
      this.gl.RGB, // internalFormat: How WebGL should store the data
      this.gl.RGB, // format: Format of the data we're providing
      this.gl.UNSIGNED_BYTE, // type: Data type of the pixel data
      image // source: The image data
    );

    // Generate mipmaps (smaller versions of the texture for when it's viewed
    // from far away)
    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    // Unbind the texture to avoid accidental modifications later
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  /**
   * Creates a texture from an image URL.
   *
   * This static method handles loading the image and creating the texture. It
   * returns a Promise that resolves when the texture is ready to use.
   *
   * Example usage:
   * ```typescript
   * const texture = await Texture.fromURL(gl, 'path/to/image.png');
   * ```
   *
   * @param gl The WebGL rendering context.
   * @param url The URL of the image to load.
   * @returns A Promise that resolves to the new Texture instance.
   */
  static async fromURL(
    gl: WebGL2RenderingContext,
    url: string,
  ): Promise<Texture> {
    // Create and load the image
    const image = new Image();
    image.src = url;

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(`Failed to load texture: ${url}`));
    });

    // Create and return the texture
    return new Texture(gl, image);
  }

  /**
   * Binds this texture to a specific texture unit for use in a shader.
   *
   * In WebGL, you can use multiple textures in a shader by binding them to
   * different texture units. The texture unit is then referenced by the
   * sampler uniform in the shader.
   *
   * Example usage:
   * ```typescript
   * // In your render code:
   * program.setUniform1i(uTextureLocation, 0);  // Set the uniform to use texture unit 0
   * texture.bind(0);  // Bind to texture unit 0
   *
   * // In your shader:
   * uniform sampler2D uTexture;
   * ```
   *
   * @param unit The texture unit to bind to (0-31, depending on GPU support).
   */
  bind(unit: number): void {
    // Activate the desired texture unit
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);

    // Bind this texture to the active texture unit
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  /**
   * Deletes the texture from WebGL memory.
   *
   * Call this method when you're done with the texture to free up GPU memory.
   * After calling this, the texture cannot be used again.
   */
  delete(): void {
    this.gl.deleteTexture(this.texture);
  }
}
