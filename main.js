
/* global constants */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var mouseDown = 0;
var font = "16 verdana";

var textColor = "rgb(255,255,255)";
var smokeColor = "rgb(209,209,209)";

var initialAscentRate = 1.0;
var initialDescentRate = 1.5; // in pixels per frame
var gravity = .08  // how quickly the descent rate increases
var liftFactor = .04; // how quickly the climb rate increases
var terminalVelocity = 5; // descent and ascent rate will never exceed this

var brickV = 6; // brick velocity
var brickInterval = 40; // difficulty level 
var brickHeight = 60;
var brickWidth = 30;
var brickColor = "rgb(255,5,5)";

var chopperHeight = 26;
var chopperWidth = 77;
var chopper = new Image();
chopper.src = "chopper.png"

var backgroundHeight = 350;
var backgroundWidth = 702;
var backgroundV = 2; // background scroll velocity
var background = new Image();
background.src = "bg.jpg"


/* variables that will be reset every time setup is called: */
var chopperX;
var chopperY;
var iterationCount;
var brickList;
var smokeList;
var gameState;
var score;
var scrollVal;

var ascentRate;
var descentRate;


window.onload = function () { setup(); }

function setup() {
    gameState = "pause";
    clearScreen();
    
    chopper.src = "chopper.png";

    brickList = new Array();
    smokeList = new Array();

    chopperX = 100;
    chopperY = 175;

    descentRate = initialDescentRate;
    ascentRate = initialAscentRate;
    
    iterationCount = 0;
    score = 0;

    scrollVal = 0;

    ctx.font = font;

    addBrick();

    ctx.drawImage(background, 0, 0, backgroundWidth, backgroundHeight);
    ctx.drawImage(chopper, chopperX, chopperY, chopperWidth, chopperHeight);

    ctx.fillStyle = textColor;
    ctx.fillText('Press spacebar to play/pause', 10, 340);
}

function play() {
    if(gameState == "pause") {
        intervalId = window.requestAnimationFrame(draw, canvas); //window.setInterval(draw, refreshRate);
        gameState = "play";
    }
}

function pause() { 
    if(gameState == "play") {
        gameState = "pause";
    }
}

function stop() {
    gameState = "stop"
}

function draw() {
    if(gameState == "play") {
        clearScreen();
        animateBackground();
        animateChopper();
        animateBricks();
        ctx.font = font;
        ctx.fillStyle = textColor;
        ctx.fillText('Press spacebar to play/pause', 10, 340);
        ctx.fillText('Score:'+ score, 600, 340);
        
        collisionCheck();
        
        window.requestAnimationFrame(draw, canvas);
    }
}

function drawCrash() {
    chopper.src = "chopper_burn.png";
    ctx.drawImage(chopper, chopperX, chopperY, chopperWidth, chopperHeight);
    ctx.font = "40 Bold Verdana"

    ctx.fillText("YOU LOSE!", 240, 80);
}

function animateChopper() {
    if(mouseDown) {
        descentRate = initialDescentRate;
        chopperY = chopperY - ascentRate;

        if(!(ascentRate > terminalVelocity)) {
            ascentRate += liftFactor;
        }
    } else {
        ascentRate = initialAscentRate;
        chopperY = chopperY + descentRate;
    
        if(!(descentRate > terminalVelocity)) {
            descentRate += gravity;
        }
    }

    // border detection
    if( (chopperY < 0) || (chopperY > (canvas.height-chopperHeight)) ) {
        gameOver();
    }

    ctx.drawImage(chopper, chopperX, chopperY, chopperWidth, chopperHeight);
    addSmokeTrail();
    animateSmoke();
}

function animateBricks() {
    iterationCount++;
    for(var i=0; i<brickList.length; i++) {
        if(brickList[i].x < 0-brickWidth) {
            brickList.splice(i, 1); // remove the brick that's outside the canvas
        } 
        else {
            brickList[i].x = brickList[i].x - brickV
            ctx.fillStyle = brickColor
            ctx.fillRect(brickList[i].x, brickList[i].y, brickWidth, brickHeight)
            
            // If enough distance (based on brickInterval) has elapsed since 
            // the last brick was created, create another one
            if(iterationCount >= brickInterval) {
                addBrick();
                iterationCount = 0;
                score=score+10;
            }
        }
    }
}

function animateSmoke() {
    for(var i=0; i<smokeList.length; i++) {
        if(smokeList[i].x < 0) {
            smokeList.splice(i, 1); // remove the smoke particle that outside the canvas
        }
        else {
            smokeList[i].x = smokeList[i].x - brickV
            ctx.fillStyle = smokeColor
            ctx.fillRect(smokeList[i].x, smokeList[i].y, 2, 2)
        }
    }
}

function animateBackground() {
    if(scrollVal >= canvas.width){
        scrollVal = 0;
    }
    scrollVal+=backgroundV;       
    ctx.drawImage(background, -scrollVal, 0, backgroundWidth, backgroundHeight);
    ctx.drawImage(background, canvas.width-scrollVal, 0, backgroundWidth, backgroundHeight);
}

/* Very naive collision detection using a bounding box.
 * This will trigger a collision when a brick intersects with the helicopter GIF. 
 * Since the image is square but the helicopter is not, collisions will be detected
 * when the helicopter is merely close, and not actually contacting the brick.
 */
function collisionCheck() {
    for(var i=0; i<brickList.length; i++) {
        if (chopperX < (brickList[i].x + brickWidth) && (chopperX + chopperWidth) > brickList[i].x
                    && chopperY < (brickList[i].y + brickHeight) && (chopperY + chopperHeight) > brickList[i].y ) {
            gameOver();
        }
    }
}

function gameOver() {
    stop();
    drawCrash();
}

function addBrick() {
    newBrick = {}
    newBrick.x = canvas.width;
    newBrick.y = Math.floor(Math.random() * (canvas.height-brickHeight))
    brickList.push(newBrick);
}

function addSmokeTrail() {
    newParticle = {}
    newParticle.x = chopperX
    newParticle.y = chopperY + 4
    smokeList.push(newParticle);
}

/* Heads up - if this function is just named clear(), onclick fails silently! */
function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* This is a nifty trick! */
document.body.onmousedown = function() { 
    if(!(mouseDown == 1)) {
        ++mouseDown;
    }
}
document.body.onmouseup = function() {
    if(mouseDown > 0) {
        --mouseDown;
    }
    if(gameState == "pause") {
        play();
    }
}

document.body.onkeypress = function(e) {
    if(e.keyCode == 32) { // spacebar
        if(gameState == "pause") {
            play();
        } else {
            pause();
        }
    }
    if(e.keyCode == 114) {
        if(gameState != "play") {
            setup()
        }
    }
}


/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 * https://gist.github.com/mrdoob/838785
 */
if ( !window.requestAnimationFrame ) {
    window.requestAnimationFrame = ( function() {
        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
        };
    } )();
}
