# 3D Solar System Simulation with Interactive Speed Control

This project delivers a responsive web-based 3D simulation of our solar system, built leveraging the Three.js library. It provides an immersive visual experience of planets orbiting the Sun, complemented by interactive controls for real-time adjustment of planetary orbital speeds and various display options.

## Features

* **Realistic 3D Solar System:**
    * The Sun prominently placed at the scene's center.
    * All 8 planets (Mercury to Neptune) accurately orbiting the Sun.
    * Each planet rotating on its own axis.
    * **Visible Orbital Paths:** Clear, subtle orbital rings around the Sun for each planet, visually indicating their respective paths.
    * Realistic lighting and camera angles for an engaging view.
    * An expansive starfield background to enhance the cosmic environment.

* **Real-time Speed Control:**
    * A compact control panel features individual sliders for each planet, allowing real-time adjustment of its orbital speed.
    * Speed changes are immediately reflected in the planet's animation.
    * Built entirely with pure JavaScript, seamlessly interacting with the Three.js animation loop.

* **Interactive Controls & UI:**
    * **"Pause/Resume" Animation Button:** Allows users to halt or restart all planetary motion.
    * **"Reset All Speeds" Button:** Instantly restores all planet orbital speeds to their default values.
    * **Planet Hover Tooltips:** Hovering your mouse over any planet displays its name and a brief description, providing informative context.
    * **Dark/Light Mode Toggle:** A button to switch between a dark and light theme for the application's UI, including the control panel and background elements.

* **Responsive Design:** The layout and controls are mobile-responsive, ensuring a consistent and functional experience across various screen sizes.

## Technologies Used

* **Three.js (r128):** A robust JavaScript 3D library for rendering interactive graphics.
* **HTML5:** Provides the foundational structure of the web page.
* **CSS3:** Utilized for styling the control panel, tooltips, and overall page layout (all 3D animations are driven by JavaScript, not CSS animations, as per assignment specifications).
* **Pure JavaScript:** Powers all interactive elements, Three.js scene management, and animation logic.

## How to Run

To get this project up and running, you only need a modern web browser.

1.  **Download and Unzip:** If you have received a compressed (`.zip`) file, extract its contents to a folder on your local machine.
2.  **Open `index.html`:** Navigate into the extracted folder. Locate the `index.html` file and open it directly using your preferred web browser (e.g., by double-clicking it).

The 3D solar system simulation should load automatically within your browser.

## Usage

Once the simulation is loaded, you can interact with it using the following methods:

### Camera Navigation:
* **Mouse/Touch Drag:** Click and drag (or use a single finger on touch devices) on the main 3D canvas to rotate your view around the solar system.
* **Mouse Scroll Wheel (Desktop):** Scroll up or down to zoom in or out of the scene, adjusting your perspective.

### Control Panel (Top-Left):
The interactive control panel is positioned in the **top-left corner** of the screen for convenient access without obstructing the main view. It features a sleek **black and grey color scheme**.
* **Individual Planet Sliders:** Each planet is listed with a dedicated slider. Dragging the slider to the left will decrease that planet's orbital speed, while dragging it to the right will increase it. The numerical speed value updates dynamically.
* **"Pause Animation" / "Resume Animation" Button:** Click this button to toggle the overall animation state of the solar system between paused and playing.
* **"Reset All Speeds" Button:** Click this button to instantly reset all planets' orbital speeds back to their predefined default rates.
* **"Toggle Dark/Light Mode" Button:** Click to switch the UI theme between the default dark mode and a complementary light mode.

## Project Structure

├── index.html             <-- The primary HTML file that loads the simulation.
├── script.js              <-- Contains all JavaScript logic, including Three.js setup, animation, and UI interactions.
├── style.css              <-- Defines the styling for the web page, control panel, and tooltips.
└── README.md              <-- This document, providing project information and instructions.


---
This project demonstrates a robust implementation of the core assignment requirements, alongside several enhanced user experience features.
