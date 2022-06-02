
precision mediump float;

#define PI 3.1415926538

uniform float uTime;
uniform vec3 uPosition;
uniform float uWaveAmount;
uniform float uOffsetAmount;
uniform float uScrolledAmount;

varying vec3 vNormal;
varying vec2 vUv;

// #pragma glslify: perlin4d = require('./partials/perlin4d.glsl')
// #pragma glslify: perlin3d = require('./partials/perlin3d.glsl')

void main() {

    vec3 direction = normalize(uPosition);
    vec3 wave = direction * sin(uTime) * uWaveAmount * 0.1;
    vec3 offset = direction * uOffsetAmount * 0.1;
    vec3 newPosition = position + offset + wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vNormal = normal;
    vUv = uv;
}