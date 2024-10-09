let dino = document.getElementById("dino");
let scoreDisplay = document.getElementById("score");
let score = 0;
let isJumping = false;
let isDucking = false;
let cactusSpeed = 2000; // Velocidad inicial del cactus
let jumpCount = 0; // Contador de saltos
let lastObstacleType = ""; // Para guardar el último tipo de obstáculo

// Función para saltar
function jump() {
    if (isJumping || isDucking) return; // No saltar si ya está saltando o agachado
    isJumping = true;
    dino.classList.add("jump");

    setTimeout(() => {
        dino.classList.remove("jump");
        isJumping = false;
        jumpCount++; // Aumenta el contador de saltos
        // Aumenta la velocidad del cactus cada 10 saltos
        if (jumpCount % 10 === 0) {
            cactusSpeed *= 0.9; // Aumenta la velocidad del cactus (reduce el tiempo)
        }
    }, 1000);
}

// Función para agacharse, manteniendo la tecla presionada
function startDuck() {
    if (isDucking || isJumping) return; // No agacharse si ya está agachado o saltando
    isDucking = true;
    dino.classList.add("duck");
}

// Función para levantarse cuando se suelta la tecla
function stopDuck() {
    if (isDucking) {
        dino.classList.remove("duck");
        isDucking = false;
    }
}

// Función para generar nuevos obstáculos
function createObstacle() {
    let obstacleType = Math.random() < 0.5 ? "cactus" : "bird"; // 50% de probabilidad para cada tipo
    
    // Evitar la aparición del mismo tipo de obstáculo consecutivamente
    if (obstacleType === lastObstacleType) {
        obstacleType = obstacleType === "cactus" ? "bird" : "cactus"; // Cambia el tipo de obstáculo
    }
    
    let obstacle = document.createElement("div");
    obstacle.classList.add(obstacleType);

    // Generar un obstáculo volador con diferentes alturas
    if (obstacleType === "bird") {
        let birdHeight;
        let birdRandom = Math.random();
        if (birdRandom < 0.33) {
            birdHeight = "50px";  // Volando alto (el jugador puede pasar por debajo)
        } else if (birdRandom < 0.66) {
            birdHeight = "120px"; // Volando bajo (el jugador tiene que saltar)
        } else {
            birdHeight = "80px";  // Volando medio (puede pasar por debajo o saltar)
        }
        obstacle.style.top = birdHeight; // Asignar altura al pájaro
    }

    document.getElementById("gameContainer").appendChild(obstacle);
    lastObstacleType = obstacleType; // Guarda el tipo de obstáculo actual

    // Establecer la velocidad de movimiento
    obstacle.style.animationDuration = cactusSpeed / 1000 + "s"; // Velocidad del obstáculo

    // Colisión con el obstáculo
    let checkCollision = setInterval(() => {
        let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
        let obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue("top")); // Altura del obstáculo

        // Si el obstáculo es un cactus
        if (obstacleType === "cactus" && obstacleLeft < 50 && obstacleLeft > 0 && dinoTop >= 150) {
            alert("¡Perdiste! Tu puntuación fue: " + score);
            location.reload(); // Reinicia el juego
            clearInterval(checkCollision); // Detener la verificación de colisión
        } 
        // Si el obstáculo es un pájaro (volador)
        else if (obstacleType === "bird" && obstacleLeft < 50 && obstacleLeft > 0) {
            // Condiciones de colisión con el pájaro
            // Si el dino está saltando y el pájaro está a una altura baja, colisiona
            if (dinoTop < 150 && obstacleTop > 100) { // Colisión por encima
                alert("¡Perdiste! Tu puntuación fue: " + score);
                location.reload(); // Reinicia el juego
            } 
            // Si el dino no está agachado y el pájaro está a una altura media o alta, colisiona
            else if (!isDucking && obstacleTop < 100) { // Colisión por debajo
                alert("¡Perdiste! Tu puntuación fue: " + score);
                location.reload(); // Reinicia el juego
            }
        } 
        else if (obstacleLeft < 0) {
            score++;
            scoreDisplay.innerHTML = score; // Aumenta la puntuación
            obstacle.remove(); // Elimina el obstáculo cuando pasa
            clearInterval(checkCollision); // Detener la verificación de colisión
        }
    }, 10);
}

// Inicia la generación de obstáculos
setInterval(createObstacle, 2000); // Cada 2 segundos aparece un nuevo obstáculo

// Detectar la tecla de salto y agacharse
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") { // Saltar con la tecla Espacio
        jump();
    }
    if (event.code === "ArrowDown") { // Agacharse con la tecla Abajo
        startDuck();
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") { // Dejar de agacharse al soltar la tecla Abajo
        stopDuck();
    }
});
