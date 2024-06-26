

var canvas, ctx;

window.addEventListener('load', () => {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');          
    resize(); 

    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('mousemove', Draw);

    document.addEventListener('touchstart', startDrawing);
    document.addEventListener('touchend', stopDrawing);
    document.addEventListener('touchcancel', stopDrawing);
    document.addEventListener('touchmove', Draw);
    window.addEventListener('resize', resize);

    document.getElementById("angle").innerText = 0;
});




var width, height, radius, x_orig, y_orig;
function resize() {
    width = window.innerWidth;
    radius = 50;
    height = radius * 6.5;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    background();
    joystick(width / 2, height / 3);
}

function background() {
    x_orig = width / 2;
    y_orig = height / 3;

    ctx.beginPath();
    ctx.arc(x_orig, y_orig, radius + 20, 0, Math.PI * 2, true);
    ctx.fillStyle = '#a2d2df';
    ctx.fill();
}

function joystick(width, height) {
    ctx.beginPath();
    ctx.arc(width, height, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = '#a2d2df';
    ctx.fill();
    ctx.strokeStyle = '#396d7c';
    ctx.lineWidth = 8;
    ctx.stroke();
}

let coord = { x: 0, y: 0 };
let paint = false;

function getPosition(event) {
    var mouse_x = event.clientX || event.touches[0].clientX;
    var mouse_y = event.clientY || event.touches[0].clientY;
    coord.x = mouse_x - canvas.offsetLeft;
    coord.y = mouse_y - canvas.offsetTop;
}

function is_it_in_the_circle() {
    var current_radius = Math.sqrt(Math.pow(coord.x - x_orig, 2) + Math.pow(coord.y - y_orig, 2));
    if (radius >= current_radius) return true
    else return false
}


function startDrawing(event) {
    paint = true;
    getPosition(event);
    if (is_it_in_the_circle()) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        joystick(coord.x, coord.y);
        Draw();
    }
}


function stopDrawing() {
    paint = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background();
    joystick(width / 2, height / 3);
    document.getElementById("x_coordinate").innerText = 0;
    document.getElementById("y_coordinate").innerText = 0;
    document.getElementById("angle").innerText = 0;
    send_data(0,0,0)

}

function Draw(event) {

    if (paint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background();
        var angle_in_degrees,x, y, speed;
        var angle = Math.atan2((coord.y - y_orig), (coord.x - x_orig));

        if (Math.sign(angle) == -1) {
            angle_in_degrees = Math.round(-angle * 180 / Math.PI);
        }
        else {
            angle_in_degrees =Math.round( 360 - angle * 180 / Math.PI);
        }


        if (is_it_in_the_circle()) {
            joystick(coord.x, coord.y);
            x = coord.x;
            y = coord.y;
        }
        else {
            x = radius * Math.cos(angle) + x_orig;
            y = radius * Math.sin(angle) + y_orig;
            joystick(x, y);
        }

    
        getPosition(event);

        var speed =  Math.round(100 * Math.sqrt(Math.pow(x - x_orig, 2) + Math.pow(y - y_orig, 2)) / radius);

        var x_relative = Math.round(x - x_orig);
        var y_relative = Math.round(y - y_orig);
        

        document.getElementById("x_coordinate").innerText =  x_relative;
        document.getElementById("y_coordinate").innerText =y_relative ;
        document.getElementById("angle").innerText = angle_in_degrees;

        angulo = document.getElementById("angle").innerHTML;
        speed = document.getElementById("speed").value;
        xc = x_relative
        yc = y_relative
        
        if(speed = 1){
            speed = 10
        }
        if(speed = 2){
            speed = 20
        }
        if(speed = 3){
            speed = 30
        }
        if(speed = 4){
            speed = 40
        }
        if(speed = 5){
            speed = 50
        }
        
        send_data(angulo,xc,yc, speed)
        console.log(`xc = `, xc, `yc = `, yc, `speed = `, speed)
        //angulo.onchange = send_data(angulo,xc,yc, speed)
    }
} 


function send_data(angulo,xc,yc,speed) {    
    $.ajax({
        url: "/",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ "angle": angulo,
            "xc": xc, "yc": yc, "speed": speed}),
        success: function(response) {
            console.log(response);
        }
    });
}
