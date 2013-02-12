var objs = {Circle: [], Rectangle: []};
var move_select;

function Circle(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
}

function Rectangle(x1, y1, x2, y2, color) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.color = color;
}

function Draw(ctx) {
	this.ctx = ctx;
}

Draw.prototype.scene = function(canvas) {
	// очистим сцену
	this.ctx.clearRect(0, 0, canvas.width, canvas.height);

	// рисуем круги
	for (var i = 0; i < objs.Circle.length; i++) {
		this.ctx.beginPath();
		this.ctx.fillStyle = objs.Circle[i].color;
		this.ctx.arc(objs.Circle[i].x, objs.Circle[i].y, objs.Circle[i].radius, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.fill();
	}
	
	// рисуем прямоуголники
	for (var i = 0; i < objs.Rectangle.length; i++) {
		this.ctx.beginPath();
		this.ctx.fillStyle = objs.Rectangle[i].color;
		this.ctx.fillRect(objs.Rectangle[i].x1, objs.Rectangle[i].y1, objs.Rectangle[i].x2, objs.Rectangle[i].y2);
		this.ctx.closePath();
		this.ctx.fill();
	}
}

// методы для работы с кругами
Draw.prototype.fillCircle = function(x, y, radius, color) {
	objs.Circle.push(new Circle(x, y, radius, color));
}

Draw.prototype.moveCircle = function(id, offset, x, y) {
	objs.Circle[id].x = x + offset[0];
	objs.Circle[id].y = y + offset[1];
}

// методы для работы с прямоуголниками
Draw.prototype.fillRect = function(x1, y1, x2, y2, color) {
	objs.Rectangle.push(new Rectangle(x1, y1, x2, y2, color));
}

Draw.prototype.moveRect = function(id, offset, x, y) {
	objs.Rectangle[id].x1 = x + offset[0];
	objs.Rectangle[id].y1 = y + offset[1];
}

$(function(){
	var canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	draw = new Draw(context);
	
	// создадим объекты
	draw.fillRect(363, 162, 20, 10, 'rgb(0, 162, 232)');
	
	draw.fillCircle(373, 128, 80, '#456');
	draw.fillCircle(343, 105, 20, '#321');
	draw.fillCircle(405, 109, 20, '#321');
	draw.fillCircle(336, 200, 20, '#321');
	draw.fillCircle(409, 202, 20, '#321');
	
	// нарисуем начальную сцену
	draw.scene(canvas);
	
	// действия при нажатии на canvas
	$('#canvas').mousedown(function(e) {
		var canvasPosition = $(this).offset();
		var mouseX = (e.pageX - canvasPosition.left);
		var mouseY = (e.pageY - canvasPosition.top);
		
		for (var i = 0; i < objs.Circle.length; i++) {
			var circleX = objs.Circle[i].x;
			var circleY = objs.Circle[i].y;
			var radius = objs.Circle[i].radius;
			
			// проверка на нажатие в область круга
			if (Math.pow(mouseX - circleX, 2) + Math.pow(mouseY - circleY, 2) < Math.pow(radius, 2)) {
				// запишем информацию о выбранном элементе: тип, id, и смещение указателя мыши
				move_select = [ 'Circle', i, [circleX - mouseX, circleY - mouseY] ];
			}
		}
		
		for (var i = 0; i < objs.Rectangle.length; i++) {
			var rectX1 = objs.Rectangle[i].x1;
			var rectY1 = objs.Rectangle[i].y1;
			var rectX2 = objs.Rectangle[i].x1 + objs.Rectangle[i].x2;
			var rectY2 = objs.Rectangle[i].y1 + objs.Rectangle[i].y2;
			
			// проверка на нажатие в область прямоуголника
			if (mouseX > rectX1 && mouseX < rectX2 && mouseY > rectY1 && mouseY < rectY2) {
				// запишем информацию о выбранном элементе: тип, id, и смещение указателя мыши
				move_select = [ 'Rectangle', i, [rectX1 - mouseX, rectY1 - mouseY] ];
			}
		}
	});
	
	// действия при перемещении указателя
	$('#canvas').mousemove(function(e) {
		var canvasPosition = $(this).offset();
		var mouseX = (e.pageX - canvasPosition.left);
		var mouseY = (e.pageY - canvasPosition.top);
		
		if (move_select != undefined) {
			// обновим координаты элемента
			if (move_select[0] == 'Circle') {
				draw.moveCircle(move_select[1], move_select[2], mouseX, mouseY);
			} else if (move_select[0] == 'Rectangle') {
				draw.moveRect(move_select[1], move_select[2], mouseX, mouseY);
			}
			
			// перерисуем сцену
			draw.scene(canvas);
		}
	});
	
	// действия при отпуске кнопки нажатия
	$('#canvas').mouseup(function(e) {
		move_select = undefined;
	});
});
