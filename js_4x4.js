var size = (0.8*Math.min(window.innerHeight,window.innerWidth)).toString();
document.getElementById("grid").style.width = size+"px";
document.getElementById("grid").style.height = size+"px";

var hole = {x:4 , y:4};
var grid = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]];		// grid[x][y] is row x column y
var started = 0;
var ingame = 0;
var t1 = 0;

function swap(x1,y1,x2,y2) {
	var im1 = document.getElementById(x1.toString()+'x'+y1.toString()),
		im2 = document.getElementById(x2.toString()+'x'+y2.toString());
	temp = im1.src;
	im1.src = im2.src;
	im2.src = temp;
	var t = grid[x1-1][y1-1];
	grid[x1-1][y1-1] = grid[x2-1][y2-1];
	grid[x2-1][y2-1] = t;
}

function process(cx,cy) {
	if (( (hole.x == cx) && (hole.y - cy == 1 || hole.y - cy == -1)) || ((hole.y == cy) && (hole.x - cx == 1 || hole.x - cx == -1))) {
		swap(cx,cy,hole.x,hole.y);
		victest();
		if (started == 0 && ingame == 1) {
			started = 1;
			t1 = Math.floor(performance.now());
		}
		hole.x = cx;
		hole.y = cy;
	}
}

function processinit(cx,cy) {
	if (( (hole.x == cx) && (hole.y - cy == 1 || hole.y - cy == -1)) || ((hole.y == cy) && (hole.x - cx == 1 || hole.x - cx == -1))) {
		swap(cx,cy,hole.x,hole.y);
		hole.x = cx;
		hole.y = cy;
	}
}

function victest() {
	// teste si la grille est dans l'ordre et lance victory() si c'est le cas
	var ok = 1;
	for (i=0;i<4;i++){
		for (j=0;j<4;j++){
			if (grid[i][j] != 4*i+j+1) {ok=0}
		}
	}
	if (ok == 1 && started == 1) {victory()}
}

function victory() {

	var name = document.getElementById('name').value;
	ingame = 0;
	started = 0;
	
	document.getElementById('text1').innerHTML = "Ouaip bravo " + name;
	var t2 = Math.floor(performance.now());
	var tt = ((t2 - t1)/1000);
	document.getElementById('text2').innerHTML =  "temps : " + tt.toString() + ' s';
	
	var score = localStorage.getItem(name+"4x4");
	
	if (score == null) {
	localStorage.setItem(name+"4x4","" + tt); }
	
	else {
	var to = parseFloat(score);
	if (tt<to) { localStorage.setItem(name+"4x4","" + tt) } }
	
	document.getElementById('text3').innerHTML = 'best : ' + localStorage.getItem(name+"4x4") + ' s';
	
}

function start() {		// fonctionne
	var ite = 1000,
		L = [[0,1],[0,-1],[1,0],[-1,0]],
		dl = [],
		x = 0,
		y = 0;
	
	for (i=0;i<ite;i++) {
		dl = L[Math.floor(4*Math.random())];
		x = hole.x + dl[0];
		y = hole.y + dl[1];
		// on evite 0 et 5
		if (x==0) {x=2}
		if (x==5) {x=3}
		if (y==0) {y=2}
		if (y==5) {y=3}
		processinit(x,y);
	}
	started = 0;
	ingame = 1;
	document.getElementById('text1').innerHTML = " ";
	document.getElementById('text2').innerHTML = " ";
}

document.onkeydown = function(e) {
	//e = e || window.event;
	switch(e.which) {
		case 39:	//right
		if (hole.y>1) {
		process(hole.x,hole.y-1)
		}
		break;
		
		case 40:	//down
		if (hole.x>1) {
		process(hole.x-1,hole.y)
		}
		break;
		
		case 37:	//left
		if (hole.y<4) {
		process(hole.x,hole.y+1)
		}
		break;
		
		case 38:	//up
		if (hole.x<4) {
		process(hole.x+1,hole.y)
		}
		break;
		
		case 16:
		start();
		break;
		
		default:
		break;
	}
}