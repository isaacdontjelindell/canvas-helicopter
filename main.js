
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mouseDown = 0;
var iterationCount = 0;

var chopper;
var chopperX;
var chopperY;

var ascentRate;
var descentRate;

var intervalId;
var refreshRate;

var brickV; // velocity
var brickFrequency; // difficulty level
var brickHeight;
var brickWidth;
var brickList = new Array();

function setup() {
    clearScreen();

    chopper = new Image();
    chopper.src = "chopper.gif"

    chopperX = 20;
    chopperY = 175;

    ascentRate = 4; // pixels per interval
    descentRate = 5.5; // "    "    "
    refreshRate = 25; // millisecondsa

    brickV = 6;
    brickHeight = 60;
    brickWidth = 30;
    brickFrequency = 65;

    startBrick = {}
    startBrick.x = 400;
    startBrick.y = 150;

    brickList.push(startBrick)

    ctx.fillRect(brickList[0].x, brickList[0].y, brickWidth, brickHeight);

    ctx.drawImage(chopper, chopperX, chopperY, 77, 26);
}

function play() {
    intervalId = window.setInterval(draw, refreshRate);
}

function pause() {
    clearInterval(intervalId);
}

function draw() {
    clearScreen();
    animateChopper();
    animateObstacles();
    iterationCount++;
    console.log(iterationCount); // TODO remove
}

function animateChopper() {
    if(mouseDown) {
        chopperY = chopperY - ascentRate;
    } else {
        chopperY = chopperY + descentRate;
    }
    ctx.drawImage(chopper, chopperX, chopperY, 77, 26);
}

function animateObstacles() {
    for(var i=0; i<brickList.length; i++) {
        if(brickList[i].x < 0-brickWidth) {
            brickList.splice(i, 1); // remove the brick that's outside the canvas
        } 
        else {
            brickList[i].x = brickList[i].x - brickV
            ctx.fillRect(brickList[i].x, brickList[i].y, brickWidth, brickHeight)
            if(iterationCount >= brickFrequency) {
                addBrick();
                iterationCount = 0;
            }
        }
    }
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
