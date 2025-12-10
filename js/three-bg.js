const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create Stars
const geometry = new THREE.BufferGeometry();
const count = 1500;
const posArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x60a5fa, // Match accent color
    transparent: true,
    opacity: 0.8,
});

const starsMesh = new THREE.Points(geometry, material);
scene.add(starsMesh);

// Connecting Lines (Constellation effect)
// We'll use a separate geometry for lines that are close to the mouse or each other
// For performance, let's just add a subtle grid or geometric shapes floating

const geometry2 = new THREE.IcosahedronGeometry(10, 0);
const material2 = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    wireframe: true,
    transparent: true,
    opacity: 0.05
});
const sphere = new THREE.Mesh(geometry2, material2);
scene.add(sphere);


// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    starsMesh.rotation.y += 0.0005;
    starsMesh.rotation.x += 0.0002;

    sphere.rotation.x += 0.001;
    sphere.rotation.y += 0.001;

    // Parallax effect based on mouse
    const targetX = mouseX * 0.001;
    const targetY = mouseY * 0.001;

    sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
    sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

    renderer.render(scene, camera);
}

// Scroll Effect
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    sphere.rotation.x += 0.05;
    sphere.rotation.y += 0.075;
    sphere.rotation.z += 0.05;

    starsMesh.rotation.y += 0.01;
    starsMesh.rotation.z += 0.01;

    camera.position.z = t * -0.01 + 30;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
