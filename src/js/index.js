import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import image from "../assets/globe.jpeg";
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import atmosphereFragment from "./shaders/atmosphereFragment.glsl";
import atmosphereVertex from "./shaders/atmosphereVertex.glsl";
import gsap from "gsap";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { Float32BufferAttribute } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");
const canvasContainer = document.getElementById("canvas-container");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Stars
 */
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  // size: 0.5,
  // sizeAttenuation: false,
});

const numParticles = 10000;
const starVertices = [];

for (let i = 0; i < numParticles; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;

  starVertices.push(x, y, z);
}

starsGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starsGeometry, starsMaterial);

scene.add(stars);
/**
 * Sphere
 */
// Geometry
const geometry = new THREE.SphereGeometry(5, 50, 50);

// Material

const globeTexture = textureLoader.load(image);
const material = new THREE.ShaderMaterial({
  fragmentShader: fragment,
  vertexShader: vertex,
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uMouse: { value: new THREE.Vector2() },
    uTexture: { value: globeTexture },
  },
});

// Mesh
const sphere = new THREE.Mesh(geometry, material);

/**
 * Atmosphere
 */
// Geometry
const atmosphereGeo = new THREE.SphereGeometry(5, 50, 50);

// Material
const atmosphereMat = new THREE.ShaderMaterial({
  fragmentShader: atmosphereFragment,
  vertexShader: atmosphereVertex,
  uniforms: {
    uMouse: { value: new THREE.Vector2() },
  },
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
});

// Mesh
const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

/**
 * Sizes
 */
const sizes = {
  width: canvasContainer.offsetWidth,
  height: canvasContainer.offsetHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = canvasContainer.offsetWidth;
  sizes.height = canvasContainer.offsetHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 15;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const mouse = {
  x: 0,
  y: 0,
};

/**
 * Animate
 */
const clock = new THREE.Clock();

const render = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Rotate sphere
  sphere.rotation.y += 0.001;

  // Rotate group based on mouse position
  gsap.to(group.rotation, {
    y: mouse.x * 0.2,
    x: -mouse.y * 0.2,
    duration: 2,
  });

  // Render
  renderer.render(scene, camera);

  // Call render again on the next frame
  window.requestAnimationFrame(render);
};

render();

// add normalized mouse move event

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});
