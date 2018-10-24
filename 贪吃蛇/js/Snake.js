var Snake = function(){
	this.arr = [{x:5,y:10},{x:6,y:10},{x:7,y:10},{x:8,y:10},{x:9,y:10}];
	this.direction = 39;
	this.lock = true;
}
Snake.prototype.move = function(){
	if(!this.lock){return}
	this.arr.shift();
	var x;
	var y;
	if(this.direction === 37){
		x = this.arr[this.arr.length - 1].x - 1;
		y = this.arr[this.arr.length - 1].y;
	}else if(this.direction === 38){
		x = this.arr[this.arr.length - 1].x;
		y = this.arr[this.arr.length - 1].y - 1;
	}else if(this.direction === 39){
		x = this.arr[this.arr.length - 1].x + 1;
		y = this.arr[this.arr.length - 1].y;
	}else if(this.direction === 40){
		x = this.arr[this.arr.length - 1].x;
		y = this.arr[this.arr.length - 1].y + 1;
	}else{
		return;
	}
	this.arr.push({x:x,y:y});
}
Snake.prototype.goDie = function(){
	this.lock = false;
	animate(jiesuan,{opacity:0.7},400);
} 