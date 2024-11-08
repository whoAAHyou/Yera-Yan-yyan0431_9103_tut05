let img1; // Image1: Sky part
let img2; // Image2: Water part
let img3; // Image2: House part
let music; // 音频文件
let amplitude; // 音量分析对象
let fft; // 频谱分析对象

// Use circles to form each part separately and class them in arrays.
let particles1 = [];
let particles2 = [];
let particles3 = [];
let partSize1 = 30; // Size of particles forming the sky
let partSize2 = 25; // Size of particles forming the water
let partSize3 = 10; // Size of particles forming the house

// Three RGB colors for background gradient, arranged vertically from top to bottom
let c1, c2, c3;

function preload() {
  // Preload original image of each part.
  img1 = loadImage("Assests/sky.png");
  img2 = loadImage("Assests/water.png");
  img3 = loadImage("Assests/house.png");
  music = loadSound('Assests/Vivaldi.mp3');
}

function setup() {
  // Create a canvas that fits the screen dimensions
  createCanvas(windowWidth, windowHeight);

  // Call the function to create particles for each image part
  createParticle();

  // Initialize amplitude and FFT for volume and frequency analysis
  amplitude = new p5.Amplitude();
  amplitude.setInput(music);

  fft = new p5.FFT(0.8, 128); // 设置FFT平滑度和频率分辨率
  fft.setInput(music);
}

function createParticle() {
  particles1 = [];
  particles2 = [];
  particles3 = [];

  // Process particles for the sky image
  let imgCopy1 = img1.get(); // Copy sky image
  imgCopy1.resize(width, height); // Resize image to fit the canvas responsively
  for (let x = 0; x < imgCopy1.width; x += partSize1) {
    for (let y = 0; y < imgCopy1.height; y += partSize1) {
      let c = imgCopy1.get(x, y); // Get pixel color
      if (brightness(color(c)) > 0) {
        // Only generate particles if brightness > 0
        particles1.push(new Particle(x, y, c, partSize1, partSize1));
      }
    }
  }

  // Process particles for the water part
  let imgCopy2 = img2.get(); // Copy water image
  imgCopy2.resize(width, height);
  for (let x = 0; x < imgCopy2.width; x += partSize2) {
    for (let y = 0; y < imgCopy2.height; y += partSize2) {
      let c = imgCopy2.get(x, y);
      if (brightness(color(c)) > 0) {
        particles2.push(new Particle(x, y, c, partSize2 * 1.8, partSize2 * 1.1));
      }
    }
  }

  // Process particles for the house part
  let imgCopy3 = img3.get(); // Copy house image
  imgCopy3.resize(width, height);
  for (let x = 0; x < imgCopy3.width; x += partSize3) {
    for (let y = 0; y < imgCopy3.height; y += partSize3) {
      let c = imgCopy3.get(x, y);
      if (brightness(color(c)) > 0) {
        particles3.push(new Particle(x, y, c, partSize3 * 2, partSize3 * 2));
      }
    }
  }
}

// When the browser window is resized, make the painting fit in
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createParticle();
}

function draw() {
  background(255); // Set the canvas BG as white initially

  // Set a linear gradient color for the background, vertically gradient from top to bottom in the order of c1, c2, c3
  c1 = color(126, 164, 255); // Light blue
  c2 = color(255, 178, 68); // Orange
  c3 = color(144, 183, 255); // Light blue

  // Main implementation uses interpolation to generate colors, drawing tightly spaced horizontal lines from top to bottom
  for (let y = 0; y < height * 0.5; y++) {
    let c = lerpColor(c1, c2, map(y, 0, height * 0.5, 0, 1));
    stroke(c);
    strokeWeight(1);
    line(0, y, width, y);
  }

  for (let y = height * 0.5; y < height; y++) {
    let c = lerpColor(c2, c3, map(y, height * 0.5, height, 0, 1));
    stroke(c);
    strokeWeight(1);
    line(0, y, width, y);
  }

  // 获取音量级别，映射到亮度变化范围
  let level = amplitude.getLevel();
  let brightnessFactor = map(level, 0, 1, 0.8, 1.5);
  let spectrum = fft.analyze(); // 获取频谱数据 



  // Draw and update each particle
  for (let i = 0; i < particles1.length; i++) {
    particles1[i].update({ spark: true, brightnessFactor });
    particles1[i].display();
  }

  // House particles
  for (let i = 0; i < particles3.length; i++) {
    particles3[i].display();
  }

 // Water particles with frequency-based translation and scaling
 for (let i = 0; i < particles2.length; i++) {
  const point = particles2[i];
  const px = point.x / width;
  const freqIdx = Math.floor(px * spectrum.length);
  const freq = spectrum[freqIdx] || 0;
  const translateY = -map(freq, 0, 255, -50, 50); // 水平方向波动

  const breathScale = map(sin(frameCount * 0.02 - px * PI * 2), -1, 1, 0.9, 1.1);

  const s = map(level, 0, 1, 1, 1.2) * breathScale; // 音量控制缩放

  point.update({
    translate: { x: 0, y: translateY },
    scale: s,
    spark: true,
  });
  point.displayLine();
 }
}

function mouseClicked() {
  if (music.isPlaying()) {
    music.pause();
  } else {
    music.play();
  }
}

// Particle class - defining the properties and methods of each particle
class Particle {
  constructor(x, y, col, w, h) {
    this.x = x;
    this.y = y;
    this.baseCol = col; // 基础颜色
    this.col = col; // 当前颜色
    this.w = w;
    this.h = h;
    this.brightness = 1.0; // 当前亮度系数
    this.targetBrightness = random(0.8, 1.2); // 目标亮度系数
    this.phaseOffset = random(TWO_PI); // 每个粒子的相位偏移量
    this.scale = 1.0;
    this.scaleWeight = random(1, 7);
    this.translate = { x: 0, y: 0 };
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(
      this.x + this.translate.x,
      this.y + this.translate.y,
      this.w * this.scale,
      this.h * this.scale
    );
  }

  displayLine() {
    noStroke();
    fill(this.col);
    ellipse(
      this.x + this.translate.x,
      this.y +
        this.translate.y +
        sin(this.x * 0.01 + frameCount * 0.02) * partSize2 * 0.7,
      this.w * this.scale, // 应用 scale 来根据音量改变大小
      this.h * this.scale  // 应用 scale 来根据音量改变大小
    );
  }

  update(options) { 
    if (options && options.scale) {
      this.scale = (options.scale - 1.0) * this.scaleWeight + 1.0;
    }

    if (options && options.translate) {
      this.translate = options.translate;
    }

    // 只在 sky 部分应用亮度波动
    if (options && options.spark) {
      let fluctuation = sin(frameCount * 0.03 + this.phaseOffset) * 0.2;
      let currentBrightness = this.brightness + fluctuation;

      // 应用亮度变化到颜色
      let r = red(this.baseCol) * currentBrightness;
      let g = green(this.baseCol) * currentBrightness;
      let b = blue(this.baseCol) * currentBrightness;
      this.col = color(r, g, b);

      // 更新亮度逐步接近目标亮度
      this.brightness = lerp(this.brightness, this.targetBrightness, 0.02);

      // 当亮度接近目标时，生成新的随机目标亮度
      if (abs(this.brightness - this.targetBrightness) < 0.05) {
        this.targetBrightness = random(0.8, 1.2);
      }
    }
  }
}
