#version 300 es

precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;

// The current time, used for animating the noise texture
uniform float uTime;

// The texture coordinate of the fragment being processed, passed from the vertex shader.
// The GPU will interpolate this value across the surface of the triangle
// automatically for us.
in vec2 vUv;

// The output colour of the fragment shader that will be rendered to the screen
out vec4 fragColour;

void main() {
  // Before exercise 7, we defined colour directly from vPosition.
  // Now we use the texture coordinate.
  vec3 colour = texture(uTexture, vUv.xy).rrr;

  vec2 noiseTexCoordOffset = vec2(uTime * 0.5);
  float noiseTextCoordScale = 1.0;
  float noise = texture(
    uNoiseTexture,
    vUv.xy * noiseTextCoordScale + noiseTexCoordOffset
  ).r;

  fragColour = vec4(colour * noise, 1.0);
}
