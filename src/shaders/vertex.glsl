uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform vec2 pixels;


void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}