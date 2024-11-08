# Project Title
Interactive Audio-Driven Animation with p5.js

## Project Introduction
This project is an audio-driven interactive animation developed using p5.js. It leverages a background audio track to drive the visual behavior of various particle groups, creating a dynamic and engaging animation that responds to frequency and volume changes in the audio.

## Interaction Instructions
- **Click to Start/Stop Audio**: Click anywhere on the canvas to start or pause the background audio.
- **Observe Animation**:
  - **Sky Particles**: Play timed animations that gradually adjust brightness in a looping, flickering effect.
  - **Water Particles**:
    - Utilize the TFF spectrum of the audio for vertical jumping.
    - Adjust particle size based on audio volume.
    - Move along a curve when no audio is playing.
    - Loop brightness to mimic a flickering effect.
    - Play timed animations to expand and contract on the x-axis, creating a wave effect.
  - **House Particles**: Remain stationary, providing visual contrast.

## Personal Approach
For my personal contribution, I focused on developing a frequency-driven "breathing" animation for the water particles. This highlights the use of the audio spectrum to create rhythmic, wave-like motion that visually represents sound waves on the water's surface. I employed volume and frequency data to achieve particle behavior distinct from my team members.

## Animation Properties
In my project version, I animated the following properties using audio analysis:
- **Vertical Oscillation**: Water particles move up and down based on frequency data, responding dynamically to audio changes.
- **Breathing Scale Effect**: Time-based sine waves adjust water particle scale from right to left, simulating a wave-like breathing effect.
- **Sky Particle Brightness**: Brightness is controlled by volume analysis, causing sky particles to flicker with audio volume changes.

## Unique Aspects
My implementation differs from others by combining frequency and volume data to control the size and position of water particles, while other team members focused on color or selective visibility of different particle groups. Additionally, I enlarged the sky particles to center visual focus on the water surface, reducing visual clutter. Multiple animations were layered on the water particles for a more natural, fluid motion.

## Inspiration Sources
### Visual Inspiration
- **Wave Patterns**: Inspired by this work, I incorporated sine oscillations to mimic water movement.
  - [OpenProcessing Sketch](https://openprocessing.org/sketch/1978525)
- **Volume Representation**: This piece inspired particle size and color changes based on volume.
  - [OpenProcessing Sketch](https://openprocessing.org/sketch/2355059)
- **Spectrum Representation**: The Week 11 tutorial inspired frequency visualization using FFT spectrum analysis.
  - [USYD Canvas - Week 11 Tutorial](https://canvas.sydney.edu.au/courses/60108/pages/week-11-tutorial?module_item_id=2440203)

### Technical Sources
- **Course Materials**: Internal teaching materials provided foundational knowledge.
- **p5.js Documentation**: Extensively used for understanding audio analysis tools.
- **MDN Documentation**: Referenced for JavaScript basics like `map`, `sin`, and trigonometric functions to create rhythmic animations.
- **OpenProcessing Codebase**: Consulted similar creative coding projects for structure and code ideas.

## Technical Explanation

### Audio-Driven Animation
- **Frequency-Based Motion**:
  - The `fft.analyze()` method decomposes the audio signal into multiple bands.
  - Each particle’s position is influenced by a specific frequency band based on the particle’s x-position, creating a real-time frequency-position mapping.
- **Breathing Effect**:
  - A sine-based scaling effect is applied along the x-axis to simulate a breathing wave.
  - This effect is achieved by modifying each particle's scale factor using a sine function that changes with frame count over time.
- **Volume-Based Brightness**:
  - The `amplitude.getLevel()` method extracts real-time volume data from the audio.
  - This volume level is mapped to a brightness controller, allowing sky particles to brighten or dim with audio changes.

## External Tools and Techniques

### Tools Beyond the Course
- **FFT Analysis**: Utilized `p5.FFT` for frequency analysis. Though not covered in our course, this was crucial for extracting detailed frequency data, enabling water particles to respond to specific frequencies.

## Appendix

### References
- **Audio Source**: [Gregor Quendel on FreeSound](https://freesound.org/people/GregorQuendel/sounds/750319/)
