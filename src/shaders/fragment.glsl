uniform float u_time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;


void main() {
    gl_FragColor=vec4(vUv,0.0,1.0);
}