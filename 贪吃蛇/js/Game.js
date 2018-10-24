 /*@dom  盛放地图的容器
  *@row  地图行数
  *@col  地图列数
  *@Snake  蛇
  *@Food   食物
  *@Z       障碍物
  */

var Game = function(dom,row,col,Snake,Food,Z){
	this.dom = dom;
	this.row = row;
	this.col = col;
	this.arr = [];
	this.Snake = new Snake();
	this.Food = new Food;
	this.Z = new Z();
	this.timer = null;
	this.init();
	this.score = 0;
	this.idx = 0;
	this.speed = 10;
	this.stopLock = true;
}
Game.prototype.init = function(){
	this.map();
	this.start();
	this.bindEvent();
	this.lock = false;
}
// 创建地图
Game.prototype.map = function(){
	var height = parseInt(getComputedStyle(this.dom)["height"]);
	var width = parseInt(getComputedStyle(this.dom)["width"]);
	
	for(var i = 0;i < this.row;i ++){
		var row = document.createElement("div");
		row.className = "row";
		row.style.height = height / this.row + "px";
		// row.width = width + "px";
		var arr = [];
		for(var j = 0 ; j < this.col; j ++){
			var col = document.createElement("div");
			col.className = "col";
			col.style.width = width / this.col + "px";
			col.style.height = height / this.row + "px";
			row.appendChild(col);
			arr.push(col)
		}
		this.arr.push(arr);
		box.appendChild(row);
	}
}
// 渲染蛇
Game.prototype.randerSnake = function(){
	for(var i = 0,l = this.Snake.arr.length;i<l;i ++){
		var x = this.Snake.arr[i].x;
		var y = this.Snake.arr[i].y;
		// console.log(this.arr);
		this.arr[y][x].style.backgroundColor = "orange";
	}
}
// 渲染食物
Game.prototype.randerFood = function(){
	this.arr[this.Food.food.y][this.Food.food.x].style.backgroundColor = "#000";
}
// 渲染障碍物
Game.prototype.randerZ = function(){
	for(var i = 0; i < this.Z.arr.length;i ++){
	this.arr[this.Z.arr[i].y][this.Z.arr[i].x].style.backgroundColor = "#ccc";
	}
}
Game.prototype.clears = function(){
	for(var i = 0 ;i < this.row;i ++){
		for(var j = 0 ; j < this.col;j ++){
			this.arr[i][j].style.backgroundColor = "white";
		}
	}
}
Game.prototype.start = function(){
	var me = this;
	this.timer = setInterval(function(){
		me.lock = true;
		me.idx ++;
		me.speed = 10 - parseInt(me.score / 10);
		if(me.speed <= 2){
			me.speed = 2;
		}
		// console.log(me.score)
		if(!(me.idx % me.speed)){
			me.Snake.move();
		}
		// console.log(me.Snake.arr.length)
		me.check();
		if(!me.Snake.lock){return}
		me.clears();
		me.randerSnake();
		me.randerFood();
		me.randerZ();
	},20);
}
Game.prototype.bindEvent = function(){
	var me = this;
	document.onkeydown = function(e){
		var e = e || window.event;
		if(e.keyCode === 32){
			me.stopLock = me.stopLock ? false : true;
			if(me.stopLock){
				me.Snake.lock = true;
			}else{
				me.Snake.lock = false;
			}
		}
		/*if(e.preventDefault){
     	  	e.preventDefault();
     	  }else{
     	  	e.returnValue = false;
     	  }*/
     	if(!me.lock){return}
     	me.lock = false;
     	if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40){
			if(Math.abs(me.Snake.direction - e.keyCode) === 2 || me.Snake.direction === e.keyCode){
				return;
			}
			me.Snake.direction = e.keyCode;
     	}
	}
}
Game.prototype.check = function(){
	// 判断蛇是否撞墙
	this.checkWall();
	// 判断蛇是否吃到食物
	this.checkFood();
	// 判断蛇是否吃到自己
	this.checkSelf();
	// 判断蛇是否撞到障碍物
	this.checkZ();
}
Game.prototype.checkWall = function(){
	var head = this.Snake.arr[this.Snake.arr.length - 1];
	if(head.x >= this.col || head.x < 0 || head.y >= this.row || head.y < 0){
		score.innerHTML = this.score;
		this.Snake.goDie();
		clearInterval(this.timer);
		fen.innerHTML = parseInt(this.idx / 3000);
		miao.innerHTML = parseInt((this.idx / 50) % 60);
	}
}
Game.prototype.checkSelf = function(){
	var x = this.Snake.arr[this.Snake.arr.length - 1].x;
	var y = this.Snake.arr[this.Snake.arr.length - 1].y;
	for(var i = 0 ; i < this.Snake.arr.length - 1; i ++){
		if(x === this.Snake.arr[i].x && y === this.Snake.arr[i].y){
			score.innerHTML = this.score;
			this.Snake.goDie();
			clearInterval(this.timer);
			fen.innerHTML = parseInt(this.idx / 3000);
			miao.innerHTML = parseInt((this.idx / 50) % 60);
		}
	}
}
Game.prototype.checkFood = function(){
	var x = this.Snake.arr[this.Snake.arr.length - 1].x;
	var y = this.Snake.arr[this.Snake.arr.length - 1].y;
	if(x === this.Food.food.x && y === this.Food.food.y){
		this.score ++;
		this.Snake.arr.unshift(this.Snake.arr[0]);
		this.resetFood();
	}
}
Game.prototype.checkZ = function(){
	var x = this.Snake.arr[this.Snake.arr.length - 1].x;
	var y = this.Snake.arr[this.Snake.arr.length - 1].y;
	for(var i = 0;i < this.Z.arr.length;i ++){
		if(x === this.Z.arr[i].x && y === this.Z.arr[i].y){
			score.innerHTML = this.score;
			this.Snake.goDie();
			clearInterval(this.timer);
			fen.innerHTML = parseInt(this.idx / 3000);
			miao.innerHTML = parseInt((this.idx / 50) % 60);
		}
	}
}
Game.prototype.resetFood = function(){
	var x = parseInt(Math.random() * this.col);
	var y = parseInt(Math.random() * this.row);
	// 不能让食物与蛇重合
	for(var i = 0;i < this.Snake.arr.length - 1;i ++){
		if(x === this.Snake.arr[i].x && y === this.Snake.arr[i].y){
			this.resetFood();
			return
		}
	}
	// 不能让食物与障碍物重合
	for(var j = 0;j < this.Z.arr.length;j ++){
		if(x === this.Z.arr[j].x && y === this.Z.arr[j].y){
			this.resetFood();
			return;
		}
	}
	this.Food.food.x = x;
	this.Food.food.y = y;
}
