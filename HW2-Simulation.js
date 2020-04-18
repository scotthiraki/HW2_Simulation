//Based on Jared Tarbell's Substrate algorithm concept http://www.complexification.net/gallery/machines/substrate/
//Perpendicular growth rule.
//mrdoob's "Map Generator"
//bubba

var mouseX = window.innerWidth / 2;
var mouseY = window.innerHeight / 2;

var socket = io.connect("http://24.16.255.56:8888");

socket.on("load", function (data) {
	data = JSON.parse(data['data']);
	boids = data;
	setInterval(1);
	//console.log(data);
});


function save_simulate(ev) {
	socket.emit("save", { studentname: "Scott Hiraki", statename: "aState", data: JSON.stringify(boids)});

	console.log(JSON.stringify(boids));
	//console.log(data);

}
function load_simulate(ev) {
	socket.emit("load", { studentname: "Scott Hiraki", statename: "aState"});
	//console.log(JSON.stringify(boids));


}
function clear_canvas(ev) {
	context.clearRect(0, 0, canvas.width, canvas.height);
} 


var Boid = function (x, y, angle) {

    this.x = x;
    this.y = y;

    this.angle = Math.pow(Math.random(), 20) + angle;
    this.dx = Math.cos(this.angle);
    this.dy = Math.sin(this.angle);

    this.life = Math.random() * 200;
    this.dead = false;

    this.update = function () {
		//with padding
		//var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
		var color = "#8b0000";
	    context.strokeStyle = color;
	    context.beginPath();
	    context.moveTo(this.x, this.y);

	    //this.x += (this.dx * 2) + Math.cos(this.life) * 3;
		//this.y += (this.dy * 2) + Math.sin(this.life) * 5;
		this.x += (this.dx * 2);
		this.y += (this.dy * 2);
	    this.life -= 2;

	    context.lineTo(this.x, this.y);
		context.stroke();
		context.lineWidth = Math.random() * Math.sin(this.life) * 2;
		//console.log(context.stroke.width);

	    var index = (Math.floor(this.x) + width * Math.floor(this.y))* 4;

	    if (this.life <= 0) this.kill();
	    if (data[index + 3] > 0) this.kill();

	    if (this.x < 0 || this.x > width) this.kill();						
	    if (this.y < 0 || this.y > height) this.kill();

    }

    this.kill = function() {

	    boids.splice(boids.indexOf(this), 1);
	    this.dead = true;

    }

}

var width = 1080;
var height = 920;

var canvas = document.getElementById('world');
canvas.width = 1080;
canvas.height = 920;

var context = canvas.getContext('2d');
var image, data;

var boids = [];
boids.push(new Boid( width / 2, height / 2, Math.random() * 720 * Math.PI / 180 * 2));
canvas.addEventListener("mousedown", mouseDown, false);
function randfloat(amt){
    return Math.random() * amt - amt * 0.5;
}
function mouseDown(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    for(var i = 0; i < 50; i++){
        boids.push(new Boid(mouseX+ randfloat(5), 
        					mouseY + randfloat(5), 
            					Math.random() * 360 * Math.PI / 180));
    }  
}

setInterval(function() {

    image = context.getImageData(2, 0, width, height);
    data = image.data;

    for (var i = 0; i < boids.length; i++) {

	    var boid = boids[i];
	    boid.update();

	    if (!boid.dead && Math.random() > 0.5 && boids.length < 250) {

		    boids.push(new Boid(boid.x, boid.y, (Math.random() > 0.5 ? 90 : - 90) * Math.PI / 180 + boid.angle));

	    }

    }

});
