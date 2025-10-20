const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");
let fireworks = [];
let particles = [];

// Matrix rain and emoji background effect
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const emojis = ["🌸", "🌹", "🌺", "🌻", "🌷", "🌼", "🌾", "💐", "🪷"];
let matrixColumns = [];
let emojiParticles = [];

function initMatrix() {
  const fontSize = 18;
  const columns = Math.floor(canvas.width / fontSize);
  matrixColumns = [];
  for (let i = 0; i < columns; i++) {
    matrixColumns[i] = Math.random() * -canvas.height;
  }
}

function drawMatrixRain() {
  const fontSize = 18;
  ctx.font = fontSize + "px monospace";
  ctx.fillStyle = "rgba(0,255,70,0.5)";
  for (let i = 0; i < matrixColumns.length; i++) {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.globalAlpha = 0.7;
    ctx.fillText(char, i * fontSize, matrixColumns[i]);
    matrixColumns[i] += fontSize;
    if (matrixColumns[i] > canvas.height && Math.random() > 0.975) {
      matrixColumns[i] = 0;
    }
  }
  ctx.globalAlpha = 1;
}

class EmojiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
    this.size = 32 + Math.random() * 24;
    this.speed = 1 + Math.random() * 2;
    this.alpha = 0.7 + Math.random() * 0.3;
  }
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
      this.size = 32 + Math.random() * 24;
      this.speed = 1 + Math.random() * 2;
      this.alpha = 0.7 + Math.random() * 0.3;
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = this.size + "px serif";
    ctx.fillText(this.emoji, this.x, this.y);
    ctx.restore();
  }
}

function initEmojis() {
  emojiParticles = [];
  for (let i = 0; i < 30; i++) {
    emojiParticles.push(new EmojiParticle());
  }
}

// Resize canvas and reinitialize matrix and emojis
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initMatrix();
  initEmojis();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function randomColor() {
  const colors = [
    "#ff5252",
    "#ffd700",
    "#40c4ff",
    "#69f0ae",
    "#ff4081",
    "#fff176",
    "#b388ff",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.5 + canvas.height * 0.2;
    this.color = randomColor();
    this.speed = 7 + Math.random() * 3; // Tăng tốc độ pháo hoa
    this.exploded = false;
  }
  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        for (let i = 0; i < 70; i++) {
          // Tăng số lượng hạt pháo hoa
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }
  }
  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2); // Tăng kích thước pháo hoa
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 3; // Tăng tốc độ hạt pháo hoa
    this.alpha = 1;
    this.gravity = 0.04; // Tăng trọng lực cho hiệu ứng rơi nhanh hơn
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.speed *= 0.96;
    this.alpha -= 0.018;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); // Tăng kích thước hạt pháo hoa
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Main animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMatrixRain(); // Draw matrix rain
  emojiParticles.forEach((e) => {
    e.update();
    e.draw();
  }); // Draw emoji background
  if (Math.random() < 0.04) {
    fireworks.push(new Firework());
  }
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw();
    if (fw.exploded) fireworks.splice(i, 1);
  });
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(i, 1);
  });
  requestAnimationFrame(animate);
}
animate();

// --- Firework and Particle classes ---
// Firework: represents a single firework rocket
// Particle: represents a single firework explosion particle
// EmojiParticle: represents a falling emoji for the background
// Matrix rain: draws falling characters for the background
// All effects are drawn on the same canvas for performance
