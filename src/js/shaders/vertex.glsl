varying vec2 vertexUv;
varying vec3 vertexNormal;

void main () {
  vec4 projectedPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  gl_Position = projectedPosition;

  vertexUv = uv;
  vertexNormal = normalize(normalMatrix * normal);
}