
/* global constants */
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var mouseDown = 0;
var chopperHeight = 26;
var chopperWidth = 77;
var ascentRate = 4; // in pixels per fram
var descentRate = 5.5; // in pixels per frame
var brickV = 6; // brick velocity
var brickFrequency = 65; // difficulty level (must be <70, smaller numbers are harder)
var brickHeight = 60;
var brickWidth = 30;
var chopper = new Image();
chopper.src = "chopper.gif"

/* variables that will be reset every time setup is called: */
var chopperX;
var chopperY;
var iterationCount;
var brickList;
var gameState;


function setup() {
    gameState = "pause"
    clearScreen();
    brickList = new Array();

    chopperX = 20;
    chopperY = 175;
    
    iterationCount = 0;

    startBrick = {}
    startBrick.x = 400;
    startBrick.y = 150;
    brickList.push(startBrick)

    ctx.fillRect(brickList[0].x, brickList[0].y, brickWidth, brickHeight);

    ctx.drawImage(chopper, chopperX, chopperY, chopperWidth, chopperHeight);
}

function play() {
    if(!(gameState == "play")) {
        intervalId = window.requestAnimationFrame(draw, canvas) //window.setInterval(draw, refreshRate);
        gameState = "play";
    }
}

function pause() { 
    gameState = "pause"
}

function draw() {
    if(gameState == "play") {
        clearScreen();
        animateChopper();
        animateBricks();
        collisionCheck();
        iterationCount++;

        window.requestAnimationFrame(draw, canvas);
    }
}

function animateChopper() {
    if(mouseDown) {
        chopperY = chopperY - ascentRate;
    } else {
        chopperY = chopperY + descentRate;
    }

    // border detection
    if( (chopperY < 0) || (chopperY > (canvas.height-chopperHeight)) ) {
        gameOver();
    }

    ctx.drawImage(chopper, chopperX, chopperY, chopperWidth, chopperHeight);
}

function animateBricks() {
    for(var i=0; i<brickList.length; i++) {
        if(brickList[i].x < 0-brickWidth) {
            brickList.splice(i, 1); // remove the brick that's outside the canvas
        } 
        else {
            brickList[i].x = brickList[i].x - brickV
            ctx.fillRect(brickList[i].x, brickList[i].y, brickWidth, brickHeight)
            
            // If enough distance (based on brickFrequency) has elapsed since 
            // the last brick was created, create another one
            if(iterationCount >= brickFrequency) {
                addBrick();
                iterationCount = 0;
            }
        }
    }
}

/* Very naive collision detection using a bounding box.
 * This will trigger a collision when a brick intersects with the helicopter GIF. 
 * Since the GIF is square but the helicopter is not, collisions will be detected
 * when the helicopter is merely close, and not actually contacting the brick.
 */
function collisionCheck() {
    for(var i=0; i<brickList.length; i++) {
        if (chopperX < (brickList[i].x + brickWidth) && (chopperX + chopperHeight)  > brickList[i].x
                    && chopperY < (brickList[i].y + brickHeight) && (chopperY + chopperHeight) > brickList[i].y ) {
            gameOver();
        }
    }
}

function gameOver() {
    pause();
}

function addBrick() {
    newBrick = {}
    newBrick.x = canvas.width;
    newBrick.y = Math.floor(Math.random() * (canvas.height-brickHeight))
    brickList.push(newBrick);
}


/* Heads up - if this function is just named clear(), onclick fails silently! */
function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* This is a nifty trick! */
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
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
