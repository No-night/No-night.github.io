"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var di = 1;

var speed = 60000;

var x=0,y=0,z=0;

var r1 = 0,g1=162/255.0,b1=232/255,r2=122/255,g2=146/255,b2=190/255,r3=153/255,g3=217/255,b3=234/255;

function initRotSquare(){
	canvas = document.getElementById( "test" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );
	// penrose 三角绘制
	var vertices = [
		0.402+x,0.878+y,0,//a 0
		0.615+x,0.754+y,0,//b 1
		-0.906+x,0.107+y,0,//f 2
		
		0.615+x,0.754+y,0,//b 1
		-0.906+x,0.107+y,0,//f 2
		-0.508+x,0.106+y,0,//g 3 

		-0.906+x,0.107+y,0,//f 2
		-0.508+x,0.106+y,0,//g 3 
		0.215+x,-0.547+y,0,//l 4

		-0.508+x,0.106+y,0,//g 3 
		0.215+x,-0.547+y,0,//l 4
		0.215+x,-0.286+y,0,//k 5

		-0.906+x,-0.140+y,0,//F
		-0.906+x,0.107+y,0,//E
		0.402+x,-0.894+y,0,//D

		-0.906+x,0.107+y,0,//E
		0.402+x,-0.894+y,0,//D
		0.215+x,-0.547+y,0,//L

		0.402+x,-0.894+y,0,//D
		0.215+x,-0.547+y,0,//L
		0.402+x,0.417+y,0,//I

		0.215+x,-0.547+y,0,//L
		0.402+x,0.417+y,0,//I
		0.215+x,0.303+y,0,//J

	   0.615+x,-0.767+y,0,//c 6 
	   0.402+x,-0.894+y,0,//d 7 
	   0.615+x,0.754+y,0,//b 8

	   0.402+x,-0.894+y,0,//d 7 
	   0.615+x,0.754+y,0,//b 8	   
	   0.402+x,0.400+y,0,//i 9 

	   0.615+x,0.754+y,0,//b 8	   
	   0.402+x,0.400+y,0,//i 9 
	   -0.508+x,0.107+y,0,//g 10

	   0.402+x,0.400+y,0,//i 9 
	   -0.508+x,0.107+y,0,//g 10
	   -0.280+x,-0.016+y,0//h 11 
	];
	//颜色绘制
	var vertcolors = [

		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,
		r1,g1,b1,1.0,

		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,
		r2,g2,b2,1.0,

		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0,
		r3,g3,b3,1.0
		//开始颜色
		// 0, 162/255, 232/255,1.0,
		// 122/255, 146/255,190/255,1.0,
		// 153/255,217/255,234/255,1.0,

	];
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );
    var cbufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertcolors ), gl.STATIC_DRAW );

	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	// document.getElementById( "speedsc" ).onclick = function( event ){
	// 	switch( event.target.index ){
	// 		case 0:
	// 			speed = 50;
	// 			break;
	// 		case 1:
	// 			speed /= 2.0;
	// 			break;
	// 		case 2:
	// 			speed *= 2.0;
	// 			break;
	// 		case 3:
	// 			speed = 6000;
	// 			break;
	// 	}
	//}

	// 图形的旋转
	document.getElementById( "speedcon" ).onchange = function( event ){
			speed = 100 - event.target.value;
	}
	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += 0.1*di;
	if( theta > 2 * Math.PI )
		theta -= (2 * Math.PI);
	else if( theta < -2 * Math.PI )
		theta += ( 2 * Math.PI );
	
	gl.uniform1f( thetaLoc, theta );

   	gl.drawArrays( gl.TRIANGLES, 0, 36 );
    //gl.drawArrays( gl.TRIANGLE_STRIP, 0, 12);

	// update and render
	setTimeout( function (){ requestAnimFrame( renderSquare ); }, speed );
}

function changedi(){//反向旋转
	di*=-1.0;
}

function translation(){// 图形平移
	x = document.getElementById("xx").value;
	x = 2.0*x/canvas.width;
	y = document.getElementById("yy").value;
	y = 2.0*y/canvas.height;
}

function stops(){//暂停
	speed = 60000;
}

function starts(){//开始
	speed = 50;
}

function re(){//复原图形颜色
	r1 = 0;g1=162/255.0;b1=232/255;r2=122/255;g2=146/255;b2=190/255;r3=153/255;g3=217/255;b3=234/255;
	document.getElementById("r1").value = 0;
	document.getElementById("g1").value = 162;
	document.getElementById("b1").value = 232;
	document.getElementById("r2").value = 122;
	document.getElementById("g2").value = 146;
	document.getElementById("b2").value = 190;
	document.getElementById("r3").value = 153;
	document.getElementById("g3").value = 217;
	document.getElementById("b3").value = 234;
}

function reback(){//复原图形位置与旋转
	x=0,y=0,z=0;
	theta = 0.0;
	document.getElementById("xx").value = 0;
	document.getElementById("yy").value = 0;
}
// 改变图形颜色
function change1(){
	r1 = document.getElementById("r1").value;
	r1 /=255.0; 
	g1 = document.getElementById("g1").value;
	g1 /=255.0;
	b1 = document.getElementById("b1").value;
	b1 /=255.0;
}

function change2(){
	r2 = document.getElementById("r2").value;
	g2 = document.getElementById("g2").value;
	b2 = document.getElementById("b2").value;
	r2 /=255.0; 
	g2 /=255.0;
	b2 /=255.0;
}

function change3(){
	r3 = document.getElementById("r3").value;
	g3 = document.getElementById("g3").value;
	b3 = document.getElementById("b3").value;
	r3 /=255.0; 
	g3 /=255.0;
	b3 /=255.0;
}
