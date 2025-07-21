// ============================================================================
// TASK 2: SOLAR SYSTEM WITH SPEED CONTROL
// Frontend Developer Assignment - Speed Control Implementation
// ============================================================================

// Planet configuration data with realistic properties
const PLANETS_DATA = [
    { 
        name: 'Mercury', 
        color: 0x8C7853, 
        size: 0.2, 
        distance: 3, 
        speed: 4.74,
        rotationSpeed: 0.02,
        description: 'Closest to the Sun'
    },
    { 
        name: 'Venus', 
        color: 0xFFC649, 
        size: 0.3, 
        distance: 4, 
        speed: 3.5,
        rotationSpeed: 0.015,
        description: 'Hottest planet'
    },
    { 
        name: 'Earth', 
        color: 0x6B93D6, 
        size: 0.35, 
        distance: 5, 
        speed: 2.98,
        rotationSpeed: 0.02,
        description: 'Our home planet'
    },
    { 
        name: 'Mars', 
        color: 0xCD5C5C, 
        size: 0.25, 
        distance: 6.5, 
        speed: 2.41,
        rotationSpeed: 0.018,
        description: 'The Red Planet'
    },
    { 
        name: 'Jupiter', 
        color: 0xD8CA9D, 
        size: 0.8, 
        distance: 9, 
        speed: 1.31,
        rotationSpeed: 0.04,
        description: 'Largest planet'
    },
    { 
        name: 'Saturn', 
        color: 0xFAD5A5, 
        size: 0.7, 
        distance: 11.5, 
        speed: 0.97,
        rotationSpeed: 0.035,
        description: 'Planet with rings'
    },
    { 
        name: 'Uranus', 
        color: 0x4FD0E7, 
        size: 0.5, 
        distance: 14, 
        speed: 0.68,
        rotationSpeed: 0.025,
        description: 'Ice giant'
    },
    { 
        name: 'Neptune', 
        color: 0x4B70DD, 
        size: 0.48, 
        distance: 16.5, 
        speed: 0.54,
        rotationSpeed: 0.022,
        description: 'Farthest planet'
    }
];

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

// Three.js core objects
let scene, camera, renderer, sun;

// Animation and control variables
let planets = [];
let planetSpeeds = {};
let clock = new THREE.Clock();
let animationPaused = false;

// Control elements
let controlsVisible = false;

// For Planet Hover Tooltips
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredPlanet = null;
let tooltipElement;

// For Dark/Light Mode
let isLightMode = false;
let stars; // Make stars globally accessible to change color

// Camera control variables
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraAngle = { theta: 0, phi: Math.PI / 4 }; // Spherical coordinates
let cameraDistance = 25;
let isTouching = false;
let lastTouchPosition = { x: 0, y: 0 };

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

/**
 * Main initialization function
 * Sets up the entire 3D scene and controls
 */
function init() {
    console.log('Initializing Solar System with Speed Control...');
    
    // Create the basic 3D scene
    createScene();
    createCamera();
    createRenderer();
    createLighting();
    
    // Create celestial objects
    createSun();
    createPlanets();
    createStarField();
    
    // Setup user interface
    setupSpeedControls();
    setupGlobalControls();
    setupCameraControls();
    
    // Setup tooltip and mouse events
    tooltipElement = document.getElementById('planet-tooltip');
    window.addEventListener('mousemove', onMouseMoveTooltip, false);
    
    // Finalize setup
    handleResize();
    hideLoadingScreen();
    
    // Start the animation loop
    animate();
    
    console.log('Solar System initialized successfully!');
}

/**
 * Creates the Three.js scene
 */
function createScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000011, 50, 200);
}

/**
 * Sets up the camera with optimal positioning
 */
function createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    
    // Position camera for best view of solar system
    updateCameraPosition();
}

/**
 * Initializes the WebGL renderer
 */
function createRenderer() {
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000011, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add to DOM
    document.getElementById('container').appendChild(renderer.domElement);
}

/**
 * Sets up lighting for realistic planet illumination
 */
function createLighting() {
    // Main sun light (point light from center)
    const sunLight = new THREE.PointLight(0xFFFFFF, 2.5, 100);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    
    // Configure shadows
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 100;
    
    scene.add(sunLight);
    
    // Ambient light for subtle illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.15);
    scene.add(ambientLight);
}

// ============================================================================
// CELESTIAL OBJECT CREATION
// ============================================================================

/**
 * Creates the Sun at the center of the solar system
 */
function createSun() {
    const sunGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFD700,
        emissive: 0xFFAA00,
        emissiveIntensity: 0.4
    });
    
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = 'Sun';
    
    scene.add(sun);
    
    // Add sun glow effect
    const glowGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFD700,
        transparent: true,
        opacity: 0.1
    });
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(sunGlow);
}

/**
 * Creates all planets with their orbital properties
 */
function createPlanets() {
    console.log('Creating planets...');
    
    PLANETS_DATA.forEach((planetData, index) => {
        const planet = createSinglePlanet(planetData, index);
        planets.push(planet);
        scene.add(planet);
        
        // Initialize speed tracking
        planetSpeeds[planetData.name] = planetData.speed;
    });
    
    console.log(`Created ${planets.length} planets`);
}

/**
 * Creates a single planet with specified properties
 */
function createSinglePlanet(planetData, index) {
    // Create planet geometry
    const geometry = new THREE.SphereGeometry(planetData.size, 20, 20);
    
    // Create material with planet-specific properties
    const material = new THREE.MeshLambertMaterial({ 
        color: planetData.color,
        transparent: false
    });
    
    const planet = new THREE.Mesh(geometry, material);
    
    // Configure shadows
    planet.castShadow = true;
    planet.receiveShadow = true;
    
    // Set planet name
    planet.name = planetData.name;
    
    // Store orbital data in userData
    planet.userData = {
        name: planetData.name,
        distance: planetData.distance,
        baseSpeed: planetData.speed,
        currentSpeed: planetData.speed,
        rotationSpeed: planetData.rotationSpeed,
        angle: (index * Math.PI * 2) / PLANETS_DATA.length, // Evenly distribute starting positions
        size: planetData.size,
        color: planetData.color,
        description: planetData.description
    };
    
    // Set initial position
    updatePlanetPosition(planet);

    // Create and add orbital path
    const orbitGeometry = new THREE.RingGeometry(planetData.distance - 0.05, planetData.distance + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x555555, // A subtle grey for the orbit
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15 // Make it slightly transparent
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate to lie flat on the XZ plane
    scene.add(orbit);
    
    return planet;
}

/**
 * Creates a starfield background
 */
function createStarField() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1500;
    const starsPositions = new Float32Array(starsCount * 3);
    
    // Generate random star positions
    for (let i = 0; i < starsCount * 3; i += 3) {
        starsPositions[i] = (Math.random() - 0.5) * 400;     // x
        starsPositions[i + 1] = (Math.random() - 0.5) * 400; // y
        starsPositions[i + 2] = (Math.random() - 0.5) * 400; // z
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ 
        color: 0xFFFFFF, 
        size: 1.5,
        sizeAttenuation: false
    });
    
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// ============================================================================
// CAMERA CONTROL SYSTEM
// ============================================================================

/**
 * Sets up interactive camera controls for mouse and touch
 */
function setupCameraControls() {
    const canvas = renderer.domElement;
    
    // Mouse controls for desktop
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mousemove', onMouseMoveCamera, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('wheel', onMouseWheel, false);
    
    // Touch controls for mobile
    canvas.addEventListener('touchstart', onTouchStart, false);
    canvas.addEventListener('touchmove', onTouchMove, false);
    canvas.addEventListener('touchend', onTouchEnd, false);
    
    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault(), false);
}

function onMouseDown(event) {
    isMouseDown = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseMoveCamera(event) {
    if (!isMouseDown) return;
    
    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };
    
    // Update camera angles
    cameraAngle.theta -= deltaMove.x * 0.01;
    cameraAngle.phi += deltaMove.y * 0.01;
    
    // Constrain phi to prevent camera flipping
    cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngle.phi));
    
    updateCameraPosition();
    
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
}

function onMouseUp() {
    isMouseDown = false;
}

function onMouseWheel(event) {
    event.preventDefault();
    
    // Zoom in/out
    cameraDistance += event.deltaY * 0.02;
    cameraDistance = Math.max(5, Math.min(100, cameraDistance)); // Constrain zoom
    
    updateCameraPosition();
}

// Touch events for mobile
function onTouchStart(event) {
    if (event.touches.length === 1) {
        isTouching = true;
        lastTouchPosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}

function onTouchMove(event) {
    event.preventDefault();
    
    if (event.touches.length === 1 && isTouching) {
        const touch = event.touches[0];
        const deltaMove = {
            x: touch.clientX - lastTouchPosition.x,
            y: touch.clientY - lastTouchPosition.y
        };
        
        // Update camera angles (similar to mouse)
        cameraAngle.theta -= deltaMove.x * 0.01;
        cameraAngle.phi += deltaMove.y * 0.01;
        
        // Constrain phi
        cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngle.phi));
        
        updateCameraPosition();
        
        lastTouchPosition = {
            x: touch.clientX,
            y: touch.clientY
        };
    }
}

function onTouchEnd() {
    isTouching = false;
}

function updateCameraPosition() {
    // Convert spherical coordinates to Cartesian
    const x = cameraDistance * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
    const y = cameraDistance * Math.cos(cameraAngle.phi);
    const z = cameraDistance * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
    
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0); // Always look at the center (Sun)
}

// ============================================================================
// SPEED CONTROL SYSTEM
// ============================================================================

/**
 * Sets up individual speed controls for each planet
 */
function setupSpeedControls() {
    const controlsContainer = document.getElementById('planet-controls');
    
    planets.forEach((planet, index) => {
        const planetData = PLANETS_DATA[index];
        const controlDiv = createPlanetControl(planetData);
        controlsContainer.appendChild(controlDiv);
        
        // Setup event listener for this planet's speed control
        setupPlanetSpeedListener(planetData, planet);
    });
}

/**
 * Creates HTML control element for a single planet
 */
function createPlanetControl(planetData) {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'planet-control';
    controlDiv.setAttribute('data-planet', planetData.name);
    
    controlDiv.innerHTML = `
        <div class="planet-name">${planetData.name}</div>
        <div class="speed-control">
            <input type="range" 
                   class="speed-slider" 
                   id="speed-${planetData.name}"
                   min="0" 
                   max="10" 
                   step="0.1" 
                   value="${planetData.speed}">
            <span class="speed-value" id="value-${planetData.name}">${planetData.speed.toFixed(1)}x</span>
        </div>
    `;
    
    return controlDiv;
}

/**
 * Sets up event listener for planet speed control
 */
function setupPlanetSpeedListener(planetData, planet) {
    const slider = document.getElementById(`speed-${planetData.name}`);
    const valueDisplay = document.getElementById(`value-${planetData.name}`);
    
    // Real-time speed adjustment
    slider.addEventListener('input', (e) => {
        const newSpeed = parseFloat(e.target.value);
        
        // Update planet speed immediately
        planetSpeeds[planetData.name] = newSpeed;
        planet.userData.currentSpeed = newSpeed;
        
        // Update display
        valueDisplay.textContent = `${newSpeed.toFixed(1)}x`;
        
        console.log(`${planetData.name} speed changed to ${newSpeed}x`);
    });
    
    // Add smooth transition on slider interaction
    slider.addEventListener('mousedown', () => {
        slider.style.transform = 'scale(1.05)';
    });
    
    slider.addEventListener('mouseup', () => {
        slider.style.transform = 'scale(1)';
    });
}

/**
 * Sets up global control buttons (pause/resume, reset, theme toggle, camera reset)
 */
function setupGlobalControls() {
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Add camera reset button
    const cameraResetBtn = document.createElement('button');
    cameraResetBtn.id = 'cameraResetBtn';
    cameraResetBtn.className = 'control-button';
    cameraResetBtn.textContent = 'Reset Camera';
    
    // Insert camera reset button before theme toggle
    themeToggleBtn.parentNode.insertBefore(cameraResetBtn, themeToggleBtn);
    
    // Pause/Resume functionality
    pauseBtn.addEventListener('click', () => {
        animationPaused = !animationPaused;
        
        if (animationPaused) {
            pauseBtn.textContent = 'Resume Animation';
            pauseBtn.className = 'control-button pause';
            console.log('Animation paused');
        } else {
            pauseBtn.textContent = 'Pause Animation';
            pauseBtn.className = 'control-button';
            console.log('Animation resumed');
        }
    });
    
    // Reset all speeds to default
    resetBtn.addEventListener('click', () => {
        resetAllSpeeds();
        console.log('All planet speeds reset to default');
    });

    // Camera reset functionality
    cameraResetBtn.addEventListener('click', () => {
        resetCamera();
        console.log('Camera reset to default position');
    });

    // Theme Toggle functionality
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Resets camera to default position
 */
function resetCamera() {
    cameraAngle = { theta: 0, phi: Math.PI / 4 };
    cameraDistance = 25;
    updateCameraPosition();
}

/**
 * Resets all planet speeds to their default values
 */
function resetAllSpeeds() {
    planets.forEach((planet, index) => {
        const planetData = PLANETS_DATA[index];
        const defaultSpeed = planetData.speed;
        
        // Reset speed values
        planetSpeeds[planetData.name] = defaultSpeed;
        planet.userData.currentSpeed = defaultSpeed;
        
        // Update UI elements
        const slider = document.getElementById(`speed-${planetData.name}`);
        const valueDisplay = document.getElementById(`value-${planetData.name}`);
        
        slider.value = defaultSpeed;
        valueDisplay.textContent = `${defaultSpeed.toFixed(1)}x`;
    });
}

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

/**
 * Main animation loop
 * Uses requestAnimationFrame for smooth 60fps animation
 */
function animate() {
    requestAnimationFrame(animate);
    
    if (!animationPaused) {
        const deltaTime = clock.getDelta();
        
        // Update all celestial objects
        updatePlanetaryMotion(deltaTime);
        updateSunRotation(deltaTime);
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

/**
 * Updates planetary orbital motion based on current speeds
 */
function updatePlanetaryMotion(deltaTime) {
    planets.forEach(planet => {
        const userData = planet.userData;
        
        // Update orbital angle based on current speed
        // Speed multiplier controls how fast planets orbit
        userData.angle += userData.currentSpeed * deltaTime * 0.1;
        
        // Update planet position
        updatePlanetPosition(planet);
        
        // Rotate planet on its own axis (more visible rotation)
        planet.rotation.y += userData.rotationSpeed * deltaTime * 10;
        planet.rotation.x += userData.rotationSpeed * deltaTime * 5; // Add slight x-axis rotation for variety
    });
}

/**
 * Updates planet position based on current orbital angle
 */
function updatePlanetPosition(planet) {
    const userData = planet.userData;
    
    // Calculate orbital position using trigonometry
    planet.position.x = Math.cos(userData.angle) * userData.distance;
    planet.position.z = Math.sin(userData.angle) * userData.distance;
    planet.position.y = 0; // Keep planets on the same orbital plane
}

/**
 * Updates sun rotation
 */
function updateSunRotation(deltaTime) {
    if (sun) {
        sun.rotation.y += deltaTime * 0.5;
        sun.rotation.x += deltaTime * 0.2; // Add slight x-axis rotation
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Handles window resize events
 */
function handleResize() {
    window.addEventListener('resize', () => {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        console.log('Window resized, updating camera and renderer');
    });
}

/**
 * Hides loading screen and shows controls
 */
function hideLoadingScreen() {
    const loadingElement = document.getElementById('loading');
    const controlsElement = document.getElementById('controls');
    
    // Hide loading screen
    loadingElement.style.display = 'none';
    
    // Show controls with fade-in effect
    controlsElement.style.display = 'block';
    controlsElement.style.opacity = '0';
    
    // Fade in animation
    let opacity = 0;
    const fadeIn = setInterval(() => {
        opacity += 0.05;
        controlsElement.style.opacity = opacity;
        
        if (opacity >= 1) {
            clearInterval(fadeIn);
            controlsVisible = true;
        }
    }, 20);
}

// For Planet Hover Tooltips
/**
 * Handles mouse movement for raycasting to detect planet hovers.
 */
function onMouseMoveTooltip(event) {
    // Skip tooltip if mouse is being used for camera control
    if (isMouseDown) return;
    
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the raycaster
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        // There's at least one intersection
        const intersectedObject = intersects[0].object;

        if (hoveredPlanet !== intersectedObject) {
            // New planet is hovered
            hoveredPlanet = intersectedObject;
            showTooltip(hoveredPlanet, event.clientX, event.clientY);
        } else {
            // Still hovering over the same planet, just update position
            updateTooltipPosition(event.clientX, event.clientY);
        }
    } else {
        // No objects are intersected
        if (hoveredPlanet) {
            hideTooltip();
            hoveredPlanet = null;
        }
    }
}

/**
 * Shows the tooltip for a given planet at a specific screen position.
 */
function showTooltip(planet, clientX, clientY) {
    const nameSpan = tooltipElement.querySelector('.tooltip-name');
    const descriptionSpan = tooltipElement.querySelector('.tooltip-description');

    nameSpan.textContent = planet.userData.name;
    descriptionSpan.textContent = planet.userData.description;

    updateTooltipPosition(clientX, clientY);
    tooltipElement.classList.add('active');
}

/**
 * Updates the tooltip's position on the screen.
 */
function updateTooltipPosition(clientX, clientY) {
    tooltipElement.style.left = `${clientX}px`;
    tooltipElement.style.top = `${clientY}px`;
}

/**
 * Hides the tooltip.
 */
function hideTooltip() {
    tooltipElement.classList.remove('active');
}

// For Dark/Light Mode
/**
 * Toggles between dark and light themes.
 */
function toggleTheme() {
    isLightMode = !isLightMode;
    document.body.classList.toggle('light-mode', isLightMode);

    // Adjust Three.js scene background and fog
    if (isLightMode) {
        renderer.setClearColor(0xEEEEEE, 1); // Lighter background for renderer
        scene.background = new THREE.Color(0xEEEEEE);
        scene.fog = new THREE.Fog(0xCCCCCC, 50, 200); // Lighter fog
        if (stars) stars.material.color.set(0x333333); // Darker stars for contrast
    } else {
        renderer.setClearColor(0x000011, 1); // Original dark background
        scene.background = null; // No background color, rely on clearColor + fog
        scene.fog = new THREE.Fog(0x000011, 50, 200); // Original dark fog
        if (stars) stars.material.color.set(0xFFFFFF); // White stars
    }

    console.log(`Switched to ${isLightMode ? 'Light' : 'Dark'} Mode`);
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Global error handler for Three.js related errors
 */
function handleThreeJSError(error) {
    console.error('Three.js Error:', error);
    
    // Show user-friendly error message
    const loadingElement = document.getElementById('loading');
    loadingElement.innerHTML = 'Error loading 3D scene. Please refresh the page.';
    loadingElement.style.color = '#ff6b6b';
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize when page loads
 */
window.addEventListener('load', () => {
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library not loaded');
        }
        
        init();
    } catch (error) {
        handleThreeJSError(error);
    }
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', () => {
    // Clean up Three.js resources
    if (renderer) {
        renderer.dispose();
    }
    
    if (scene) {
        scene.clear();
    }
});

// ============================================================================
// DEBUG FUNCTIONS (for development)
// ============================================================================

/**
 * Debug function to log current planet speeds
 */
function logPlanetSpeeds() {
    console.log('Current Planet Speeds:');
    planets.forEach(planet => {
        console.log(`${planet.userData.name}: ${planet.userData.currentSpeed}x`);
    });
}

/**
 * Debug function to get planet information
 */
function getPlanetInfo(planetName) {
    const planet = planets.find(p => p.userData.name === planetName);
    return planet ? planet.userData : null;
}

// Make debug functions available globally for console testing
window.solarSystemDebug = {
    logPlanetSpeeds,
    getPlanetInfo,
    planets,
    scene,
    camera,
    renderer,
    resetCamera
};