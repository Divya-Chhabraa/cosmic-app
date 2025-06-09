const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020c1b');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x88ccff, 1);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

const imageTextures = [
  './images/z1.png', './images/z2.png', './images/z3.png',
  './images/z4.png', './images/z5.png', './images/z6.png'
];

const imageGroup = new THREE.Group();
const circleRadius = 20;

imageTextures.forEach((src, i) => {
  const angle = (i / imageTextures.length) * Math.PI * 2;
  const texture = new THREE.TextureLoader().load(src);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);

  const x = Math.cos(angle) * circleRadius;
  const z = Math.sin(angle) * circleRadius;
  sprite.position.set(x, 0, z);

  sprite.userData.angle = angle;
  sprite.userData.offset = Math.random() * Math.PI * 2;

  const scale = i === 0 ? 8 : 6;
  sprite.scale.set(scale, scale, 1);
  sprite.userData.baseScale = scale;

  imageGroup.add(sprite);
});

scene.add(imageGroup);

// Create a glowing star texture
function createStarTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(0.2, '#ffffff');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  starPositions.push(
    (Math.random() - 0.5) * 300,
    (Math.random() - 0.5) * 300,
    (Math.random() - 0.5) * 300
  );
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 1.5,
  map: createStarTexture(),
  transparent: true,
  alphaTest: 0.05,
  depthWrite: false,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Galaxy around corners
function createMiniGalaxy(radius = 10, count = 500, spread = 3, centerX = 0, centerY = 0, centerZ = 0) {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    const x = Math.cos(angle) * distance + (Math.random() - 0.5) * spread + centerX;
    const y = (Math.random() - 0.5) * spread + centerY;
    const z = Math.sin(angle) * distance + (Math.random() - 0.5) * spread + centerZ;
    positions.push(x, y, z);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.8,
    color: 0x88ccff,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

const galaxyLeft = createMiniGalaxy(8, 600, 2, -40, 30, 0);
const galaxyRight = createMiniGalaxy(8, 600, 2, 40, 30, 0);
scene.add(galaxyLeft, galaxyRight);

let tick = 0;

function animate() {
  requestAnimationFrame(animate);

  tick += 0.01;
  starMaterial.opacity = 0.8 + Math.sin(tick * 2) * 0.2;

  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0004;
  galaxyLeft.rotation.y += 0.002;
  galaxyRight.rotation.y -= 0.002;
  imageGroup.rotation.y += 0.002;

  imageGroup.children.forEach((sprite) => {
    const float = Math.sin(tick + sprite.userData.offset) * 0.4;
    sprite.position.y = float;

    const spriteWorldPos = sprite.getWorldPosition(new THREE.Vector3());
    const camDistance = camera.position.distanceTo(spriteWorldPos);
    const focusScale = camDistance < 25 ? sprite.userData.baseScale * 1.2 : sprite.userData.baseScale;
    sprite.scale.lerp(new THREE.Vector3(focusScale, focusScale, 1), 0.05);
  });

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(imageGroup.children);

  imageGroup.children.forEach((sprite) => {
    const isHovered = intersects.length && intersects[0].object === sprite;
    const hoverScale = isHovered ? sprite.userData.baseScale * 1.4 : sprite.scale.x;
    sprite.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, 1), 0.1);
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePositions();
});

const astro = document.getElementById('astro');
const mindBody = document.getElementById('mindBody');

// Utility easing and math functions
function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

// Scroll-controlled element position updates
function updatePositions() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  let scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
  scrollPercent = Math.min(Math.max(scrollPercent, 0), 1);

  const easedT = easeInOutCubic(scrollPercent);

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const radius = vw / 4 - 40;
  const cx_left = vw / 5.2;
  const cx_right = (3.5 * vw) / 4.5;
  const cy = vh / 1.6 - 100;

  const angleLeft = lerp(degToRad(90), degToRad(180), easedT);
  const angleRight = lerp(degToRad(90), degToRad(0), easedT);

  const astroX = cx_left + radius * Math.cos(angleLeft);
  const astroY = cy + radius * Math.sin(angleLeft);
  const mindX = cx_right + radius * Math.cos(angleRight);
  const mindY = cy + radius * Math.sin(angleRight);

  astro.style.left = `${astroX}px`;
  astro.style.top = `${astroY}px`;
  mindBody.style.left = `${mindX}px`;
  mindBody.style.top = `${mindY}px`;

  const scale = lerp(1, 2, easedT);
  astro.style.transform = `translate(-50%, -50%) scale(${scale})`;
  mindBody.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

updatePositions();
window.addEventListener('scroll', updatePositions);
