uniform sampler2D uTexture;

varying vec2 vertexUv;
varying vec3 vertexNormal;

void main () {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0 ));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
    
    vec4 color = vec4(atmosphere + texture2D(uTexture, vertexUv).xyz, 1.0);
    gl_FragColor = color;


    // gl_FragColor = vec4(1.0 , 0.0, 0.0, 1.0);
}