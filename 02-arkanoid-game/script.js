const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");
const $bricks = document.querySelector("#bricks");

canvas.width = 448;
canvas.height = 400;

// variables del juego
let counter = 0;

// varibales de la pelota
const ballRadius = 5;

let x = canvas.width / 2; // aparicion de la pelota
let y = canvas.height - 30;

let dx = 2; // velocidad de la pelota en el eje x
let dy = -2;

// varibales de la paleta
const paddleHeight = 10; // grosor
const paddleWidth = 50; // ancho

let paddleX = (canvas.width - paddleWidth) / 2; // donde aparece eje x
let paddleY = canvas.height - paddleHeight - 10; // donde aparece eje y

let rightPressed = false;
let leftPressed = false;

// variables de los ladrillos
const brickRowCount = 6; // numero de filas
const brickColumnCount = 13; // numero de columnas
const brickWidth = 32; // ancho del ladrillo
const brickHeight = 16; // alto del ladrillo
const brickPadding = 0; // espacio entre ellos
const brickOffsetTop = 80; // espacio de separacion de arriba
const brickOffsetLeft = 16; // espacio de separacion de la izquierda
const bricks = [];

const BRICK_STATUS = {
    ACTIVE: 1,
    BROKEN: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []; // incializamos con array vacio
    for (let r = 0; r < brickRowCount; r++) {
        // posicion del ladrillo en pantalla
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        // color aleatorio al ladrillo
        const random = Math.floor(Math.random() * 8); // truco importante (numero del 0-7)
        // Guardar informacion del ladrillo
        bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: BRICK_STATUS.ACTIVE,
            color: random,
        };
    }
}

// dibujar pelota
function drawBall() {
    ctx.beginPath(); // iniciar trazo
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath; // finalizar trazo
}

// dibujar paleta
function drawPaddle() {
    ctx.drawImage(
        $sprite, // nombre de la variable de imagen
        29, // clipx: donde empieza a recortar imagen x
        174, // clipy: donde empieza a recortar imagen y
        paddleWidth, // tamaño de recorte
        paddleHeight, // tamaño de recorte
        paddleX, // posicion del dibujo en x
        paddleY, // posicion del dibujo en y
        paddleWidth, // ancho del dibujo
        paddleHeight // alto del dibujo
    );
}

// dibujar ladrillo
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r];
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const clipX = currentBrick.color * 32;

            ctx.drawImage(
                $bricks,
                clipX,
                0,
                brickWidth,
                brickHeight,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            );
        }
    }
}

// deteccion de colisiones
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if(currentBrick.status === BRICK_STATUS.DESTROYED)
            continue;

            const isBallSameXAsBrick=
                x > currentBrick.x &&
                x < currentBrick.x + brickWidth

            const isBallSameYAsBrick=
                y > currentBrick.y &&
                y < currentBrick.y + brickHeight

            if(isBallSameXAsBrick && isBallSameYAsBrick){
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
}



// movimiento de la pelota
function ballMovement() {
    // rebote lateral
    if (
        x + dx > canvas.width - ballRadius /* pared derecha */ ||
        x + dx < ballRadius /* pared izquierda */
    ) {
        dx = -dx;
    }
    // rebote arriba
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    // si la pelota esta en la posicion de la paleta
    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
    // si la pelota toca la paleta
    const isBallTouchingPaddle = y + dy > paddleY;
    // cambiar direccion si toca la paleta
    if (isBallTouchingPaddle && isBallSameXAsPaddle) {
        dy = -dy; // cambiar direccion
    }
    // toca suelo - game over
    else if (y + dy > canvas.height - ballRadius) {
        console.log("GAME OVER");
        document.location.reload();
    }
    // mover la pelota
    x += dx;
    y += dy;
}

// movimiento de la paleta
function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        // si se mantiene pulsada la tecla y el ancho del canvas sea menor a la paleta
        paddleX += 3; // velocidad de movimiento derecha
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 3; // velocidad de movimiento izquierda
    }
}

// limpiar cada frame y volver a dibujar
function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvent() {
    // escuchar evento
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    // cuando se presione la tecla
    function keyDownHandler(event) {
        const { key } = event;
        if (key === "Right" || key === "ArrowRight") {
            rightPressed = true;
        } else if (key === "Left" || key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    // cuando se suelta la tecla
    function keyUpHandler(event) {
        const { key } = event;
        if (key === "Right" || key === "ArrowRight") {
            rightPressed = false;
        } else if (key === "Left" || key === "ArrowLeft") {
            leftPressed = false;
        }
    }
}

// dibujar
function draw() {
    // limpiar pantalla
    cleanCanvas();
    // dibujar elementos
    drawBall();
    drawPaddle();
    drawBricks();

    // colisiones y movimientos
    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

draw();
initEvent();
