#version 300 es

precision highp float;

uniform sampler2D uTexture;

// The texture coordinate of the fragment being processed, passed from the vertex shader.
// The GPU will interpolate this value across the surface of the triangle
// automatically for us.
in vec2 vUv;

// The output colour of the fragment shader that will be rendered to the screen
out vec4 fragColour;

void main() {
  // Before exercise 7, we defined colour directly from vPosition.
  // Now we use the texture coordinate.
  vec3 colour = texture(uTexture, vUv.xy).rgb;

  fragColour = vec4(colour, 1.0);
}
