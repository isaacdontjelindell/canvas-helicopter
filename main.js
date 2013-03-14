
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mouseDown = 0;

var chopper;
var chopperX;
var chopperY;

var ascentRate;
var descentRate;

var intervalId;
var refreshRate;

function setup() {
    clearScreen();

    chopper = new Image();
    chopper.src = "chopper.gif"

    chopperX = 10;
    chopperY = 175;

    ascentRate = 6; // pixels per interval
    descentRate = 5; // "    "    "
    refreshRate = 50; // milliseconds

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
    if(mouseDown) {
        chopperY = chopperY - ascentRate;
    } else {
        chopperY = chopperY + descentRate;
    }
    ctx.drawImage(chopper, chopperX, chopperY, 77, 26);
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
