let img1; // Image1: Sky part
let img2; // Image2: Water part
let img3; // Image2: House part

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
  img1 = loadImage('Assests/sky1.png');
  img2 = loadImage('Assests/water1.png');
  img3 = loadImage('Assests/house.png');

}

function setup() {
  // Create a canvas that fits the screen dimensions
  createCanvas(windowWidth, windowHeight);
  // Call the function to create particles for each image part
  createParticle();

}

function createParticle() {
  particles1 = [];
  particles2 = [];
  particles3 = [];

  // Process particles for the sky image
  let imgCopy1 = img1.get() // Copy sky image
  imgCopy1.resize(width, height) // Resize image to fit the canvas responsively
  for (let x = 0; x < imgCopy1.width; x += partSize1) {
    for (let y = 0; y < imgCopy1.height; y += partSize1) {
      let c = imgCopy1.get(x, y); // Get pixel color
      if (brightness(color(c)) > 0) { // Only generate particles if brightness > 0
        particles1.push(new Particle(x, y, c, partSize1, partSize1))
      }
    }
  }

  // Process particles for the water part
  let imgCopy2 = img2.get() // Copy water image
  imgCopy2.resize(width, height)
  for (let x = 0; x < imgCopy2.width; x += partSize2) {
    for (let y = 0; y < imgCopy2.height; y += partSize2) {
      let c = imgCopy2.get(x, y);
      if (brightness(color(c)) > 0) {
        particles2.push(new Particle(x, y, c, partSize2 * 2, partSize2 * 0.8))
      }
    }
  }

  // Process particles for the house part
  let imgCopy3 = img3.get() // Copy house image
  imgCopy3.resize(width, height)
  for (let x = 0; x < imgCopy3.width; x += partSize3) {
    for (let y = 0; y < imgCopy3.height; y += partSize3) {
      let c = imgCopy3.get(x, y);
      if (brightness(color(c)) > 0) {
        particles3.push(new Particle(x, y, c, partSize3 * 2, partSize3 * 2))
      }
    }
  }

}

// When the browser window is resized, make the painting fit in
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createParticle()
}

function draw() {
  background(255); // Set the canvas BG as white initially 

  // Set a linear gradient color for the background, vertically gradient from top to bottom in the order of c1, c2, c3
  // (This implementation refers to ChatGPT’s response on how to create a two-segment linear gradient in p5.js)
  c1 = color(126, 164, 255) // Light blue
  c2 = color(255, 178, 68) // Orange
  c3 = color(144, 183, 255) // Light blue

  // Main implementation uses interpolation to generate colors, drawing tightly spaced horizontal lines from top to bottom
  // Upper half gradient: from c1 to c2
  for (let y = 0; y < height * 0.5; y += 1) {
    let c = lerpColor(c1, c2, map(y, 0, height * 0.5, 0, 1))
    stroke(c) // Color of lines
    strokeWeight(1) // Weight of lines
    line(0, y, width, y) // Draw a horizontal line from the left to the right of the canvas
  } 

  // Lower half gradient: from c2 to c3
  for (let y = height * 0.5; y < height; y += 1) {
    let c = lerpColor(c2, c3, map(y, height * 0.5, height, 0, 1))
    stroke(c)
    strokeWeight(1)
    line(0, y, width, y)
  }

  // Draw and update each particle
  for (let i = 0; i < particles1.length; i++) { // Sky particles
    particles1[i].update()
    particles1[i].display()
  }

  for (let i = 0; i < particles3.length; i++) { // House particles
    particles3[i].update()
    particles3[i].display()
  }

  for (let i = 0; i < particles2.length; i++) { // Water particles (draw last to ensure the water surface is in the front)
    particles2[i].update()
    particles2[i].displayLine()
  }

}

// Particle class - defining the properties and methods of each particle
class Particle {
  // Blueprint 
  constructor(x, y, col, w, h) {
    this.x = x
    this.y = y
    this.col = col // Color
    this.w = w // Width
    this.h = h // Height

  }

  display() {
    noStroke()
    fill(this.col)
    ellipse(this.x, this.y, this.w, this.h) // Draw the particle as an ellipse
  }


  // Add a waveeffect to water particles using trigonometry (sin)
  // Adjusting values and parts of code can create an animation effect
  displayLine() {
    noStroke()
    fill(this.col)
    ellipse(
      this.x, 
      // Particle will oscillate on the Y-axis
      // When frameCount > 0, particles will start fluctuating in animation
      // partSize2 affects the amplitude of oscillation
      this.y + sin(this.x * 0.01 + this.y * 0.0 + frameCount * 0.0) * partSize2 * 0.5,
      this.w, 
      this.h )

  }

  update() {
  // More changes in particle position, color, or state could be added here.
  }

}