let img1; // Image1: Sky part
let img2; // Image2: Water part
let img3; // Image2: House part
let music; // Audio file
let amplitude; // Analyzes volume
let fft; // Analyzes frequency spectrum

// Use circles to form each part separately and class them in arrays.
let particles1 = [];
let particles2 = [];
let particles3 = [];
let partSize1 = 60; // Size of particles forming the sky
let partSize2 = 25; // Size of particles forming the water
let partSize3 = 10; // Size of particles forming the house

// Three RGB colors for background gradient, arranged vertically from top to bottom
let c1, c2, c3;

function preload() {
  // Preload original audio and image of each part.
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

  fft = new p5.FFT(0.8, 128); // Initialize FFT analysis for frequency spectrum with 128 bands
  fft.setInput(music);
}

function createParticle() {
  particles1 = [];
  particles2 = [];
  particles3 = [];

  // Process particles for the sky image
// Process particles for the sky image
  let imgCopy1 = img1.get(); // Copy sky image
  imgCopy1.resize(width, height); // Resize image to fit the canvas responsively

  for (let x = 0; x < imgCopy1.width; x += partSize1) {
    for (let y = 0; y < imgCopy1.height; y += partSize1) {
      let c = imgCopy1.get(x, y); // Get pixel color
      if (brightness(color(c)) > 0) {
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
        particles2.push(new Particle(x, y, c, partSize2 * 2.5, partSize2 * 0.8));
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

  // Audio volume-based brightness control
  let level = amplitude.getLevel();
  let brightnessFactor = map(level, 0, 1, 0.8, 1.5);
  let spectrum = fft.analyze(); // Get audio spectrum for frequency-based control



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
  const px = point.x / width; // Normalize x-position
  const freqIdx = Math.floor(px * spectrum.length); // Determine frequency index
  const freq = spectrum[freqIdx] || 0;
  const translateY = -map(freq, 0, 255, -50, 50); // Map frequency value to y-axis movement

  // Generate a wave-like breathing effect across x-axis
  const breathScale = map(sin(frameCount * 0.02 - px * PI * 2), -1, 1, 0.9, 1.1);
  const s = map(level, 0, 1, 1, 1.2) * breathScale; // Scale particles based on volume and breathing effect

  point.update({
    translate: { x: 0, y: translateY },
    scale: s,
    spark: true,
  });
  point.displayLine();
 }
}

// Can play and pause music when click on the screen
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
    this.baseCol = col; 
    this.col = col; 
    this.w = w;
    this.h = h;
    this.brightness = 1.0; // Brightness level
    this.targetBrightness = random(0.8, 1.2); // Target brightness for smooth transition
    this.phaseOffset = random(TWO_PI); // Offset phase for brightness fluctuation
    this.scale = 1.0;
    this.scaleWeight = random(1, 8); // Random weight for scaling
    this.translate = { x: 0, y: 0 }; // Translation offset
  }

  // Disply the sky and house particles
  display() {
    noStroke();
    fill(this.col);
    ellipse(
      this.x + this.translate.x, // X-coordinate including any horizontal translation
      this.y + this.translate.y, // Y-coordinate including any vertical translation
      // The size of ellipse particles rely on the value of scale
      this.w * this.scale,
      this.h * this.scale
    );
  }

  // Disply the water particles
  // This method adds a sinusoidal vertical oscillation to simulate water movement
  displayLine() {
    noStroke();
    fill(this.col);
    ellipse(
      this.x + this.translate.x,
      // Adjust parameters below
      this.y + this.translate.y + sin(this.x * 0.01 + frameCount * 0.02) * partSize2 * 0.7,
                                      this.w * this.scale, this.h * this.scale ); 
  }

  // Update particle properties based on options passed in
  // This method applies scale, translation, and brightness fluctuations for animation
  update(options) {
    // Apply scale to the particle 
    if (options && options.scale) {
      // Scale the particle size based on scaleWeight and given scale factor
      this.scale = (options.scale - 1.0) * this.scaleWeight + 1.0;
    }

    // Apply translation
    if (options && options.translate) {
      this.translate = options.translate;
    }

    if (options && options.spark) {
      let fluctuation = sin(frameCount * 0.03 + this.phaseOffset) * 0.2;
      let currentBrightness = this.brightness + fluctuation;

      // Apply brightness fluctuation to RGB color channels
      let r = red(this.baseCol) * currentBrightness;
      let g = green(this.baseCol) * currentBrightness;
      let b = blue(this.baseCol) * currentBrightness;
      this.col = color(r, g, b);

      // Smoothly transition current brightness towards target brightness for natural effect
      this.brightness = lerp(this.brightness, this.targetBrightness, 0.02);

      // When the brightness reaches close to the target, set a new target brightness
      if (abs(this.brightness - this.targetBrightness) < 0.05) {
        this.targetBrightness = random(0.8, 1.2); // New random target brightness
      }
    }
  }
}
