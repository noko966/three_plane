uniform float u_time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform sampler2D matcap;
varying vec3 vView;


void main() {
    vec3 viewDir = normalize(vView);
    vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
    vec3 y = cross(viewDir, x);
    vec2 uv = vec2( dot(x, vNormal ), dot(y, vNormal ))* 0.495 + 0.5;

    vec4 color = texture2D(matcap, uv);

    float diff = abs(dot(vNormal, normalize(vec3(1.0, 1.0, 0.0)))) + abs(dot(vNormal, normalize(vec3(1.0, -1.0, 0.0))));
    diff *= 0.5;

    //gl_FragColor=vec4(vNormal,1.0);
    gl_FragColor=color;
    gl_FragColor=vec4(vec3(diff), 1.0);


}