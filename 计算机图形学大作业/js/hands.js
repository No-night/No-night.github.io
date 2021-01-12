var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)立方体的顶点
var points = [];//存放顶点的坐标
var colors = [];//颜色
var sx = 1;
var sy = 1;
var sz = 1;

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)//立方体的顶点坐标
];

// RGBA colors
var vertexColors = [
    // vec4(0.0, 0.0, 0.0, 1.0),  // black
    // vec4(1.0, 0.0, 0.0, 1.0),  // red
    // vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    // vec4(0.0, 1.0, 0.0, 1.0),  // green
    // vec4(0.0, 0.0, 1.0, 1.0),  // blue
    // vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    // vec4(0.87, 0.60, 0.5, 1.0),  // white
    // vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(0.82, 0.65, 0.60, 1.0),
    vec4(0.82, 0.65, 0.60, 1.0),
    vec4(0.82, 0.65, 0.60, 1.0),
    vec4(0.82, 0.65, 0.60, 1.0),
    vec4(0.98, 0.77, 0.72, 1.0),
    vec4(0.98, 0.77, 0.72, 1.0),
    vec4(0.98, 0.77, 0.72, 1.0),
    vec4(0.98, 0.77, 0.72, 1.0)//颜色
];


// Parameters controlling the size of the Robot's arm
var UPPER_ARM_WIDTH = 2.0;//手臂的宽度、高度、长度
var UPPER_ARM_HEIGHT = 4.0;
var UPPER_ARM_LONG = 1.0;

var LOWER_ARM_WIDTH = 3.0;//手掌的宽度、高度、长度
var LOWER_ARM_HEIGHT = 3.2;
var LOWER_ARM_LONG = 0.7;

var LOWER_FINGER_HEIGHT = 2.0;//第一关节长度、宽度
var LOWER_FINGER_WIDTH = 0.5;

var UPPER_FINGER_HEIGHT = 1.5;//第二关节长度、宽度
var UPPER_FINGER_WIDTH = 0.5;

var THIRD_FINGER_HEIGHT = 1.0;//第三关节长度、宽度
var THIRD_FINGER_WIDTH = 0.5;
// Shader transformation matrices
var modelViewMatrix, projectionMatrix;//视图矩阵

// Array of rotation angles (in degrees) for each rotation axis
var hands1 = -50;//初始绘制旋转的三种角度
var hands2 =  -120;
var hands3 = 90;
var UpperBase = 0;//手臂对应的角度位置
var LowerBase = 1;//手掌对应的角度位置
//第一关节
var l_thumb = 2;//对应初始弯曲角度下标
var l_index_finger = 3;
var l_middle_finger = 4;
var l_ring_finger = 5;
var l_little_finger = 6;
//第二关节
var u_thumb = 7;
var u_index_finger = 8;
var u_middle_finger = 9;
var u_ring_finger = 10;
var u_little_finger = 11;
//第三关节
var t_index_finger = 12;
var t_middle_finger = 13;
var t_ring_finger = 14;
var t_little_finger = 15;

// var theta = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0, 0, 0];
var theta = [-120,0, 30, 30, 30, 30, 30, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0];//弯曲的初始值

var modelViewMatrixLoc;

var vBuffer, cBuffer;

var timel;//动画的周期
//----------------------------------------------------------------------------

function quad(a, b, c, d) {//把点和颜色放入数组
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {//每一面所对应的点
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {//做缩放
    var result = mat4();
    result[0][0] = a*sx;
    result[1][1] = b*sy;
    result[2][2] = c*sy;
    return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.94, 0.97, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
	
	document.getElementById('postone').onclick = numb1;
	document.getElementById('posttwo').onclick = numb2;
	document.getElementById('postthree').onclick = numb3;
	document.getElementById('postfour').onclick = numb4;
	document.getElementById('postfive').onclick = numb5;
	document.getElementById('post1').onclick = numb2;
	document.getElementById('post2').onclick = numb5;
	document.getElementById('post3').onclick = postStone;
	
	document.getElementById('scalex').onchange = function () {
	    sx = event.srcElement.value;
	}
	document.getElementById('scaley').onchange = function () {
	    sy = event.srcElement.value;
	}
	document.getElementById('scalez').onchange = function () {
	    sz = event.srcElement.value;
	}

    document.getElementById("slider0").onchange = function () {
        theta[0] = event.srcElement.value;
    };
    document.getElementById("slider1").onchange = function () {
        theta[1] = event.srcElement.value;
    };
    document.getElementById("slider2").onchange = function () {
        theta[2] = event.srcElement.value;
    };
    document.getElementById("slider3").onchange = function () {
        theta[3] = event.srcElement.value;
    };
    document.getElementById("slider4").onchange = function () {
        theta[4] = event.srcElement.value;
    };
    document.getElementById("slider5").onchange = function () {
        theta[5] = event.srcElement.value;
    };
    document.getElementById("slider6").onchange = function () {
        theta[6] = event.srcElement.value;
    };
    document.getElementById("slider7").onchange = function () {
        theta[7] = event.srcElement.value;
    };
    document.getElementById("slider8").onchange = function () {
        theta[8] = event.srcElement.value;
    };
    document.getElementById("slider9").onchange = function () {
        theta[9] = event.srcElement.value;
    };
    document.getElementById("slider10").onchange = function () {
        theta[10] = event.srcElement.value;
    };
    document.getElementById("slider11").onchange = function () {
        theta[11] = event.srcElement.value;
    };
    document.getElementById("slider12").onchange = function () {
        theta[12] = event.srcElement.value;
    };
    document.getElementById("slider13").onchange = function () {
        theta[13] = event.srcElement.value;
    };
    document.getElementById("slider14").onchange = function () {
        theta[14] = event.srcElement.value;
    };
    document.getElementById("slider15").onchange = function () {
        theta[15] = event.srcElement.value;
    };
    document.getElementById('body1').onchange = function () {
        hands1 = event.srcElement.value;
    }
    document.getElementById('body2').onchange = function () {
        hands2 = event.srcElement.value;
    }
    document.getElementById('body3').onchange = function () {
        hands3 = event.srcElement.value;
    }
    document.getElementById('re0').onclick = function(){
        hands1 = 0;
        hands2 = 1;
        hands3 = 0;
        theta =[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0, 0, 0, 0];
    }
    document.getElementById('reset').onclick = function () {

        hands1 = -50;
        hands2 = -120;
        hands3 = 90;
        theta = [-120,0, 30, 30, 30, 30, 30, 15, 15, 15, 15, 15, 15, 0, 0, 0, 0];
    }
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);//正交投影
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    render();
}

//----------------------------------------------------------------------------
function upperArmbase() {//绘制手臂
    var s = scale4(UPPER_ARM_LONG, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

function lowArmbase() {//绘制手掌
    var s = scale4(LOWER_ARM_LONG, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_ARM_HEIGHT + 0.2, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//----------------------------------------------------------------------------

//第二关节 
//绘制
//大拇指
function uthumb() {
    var s = scale4(UPPER_FINGER_WIDTH, UPPER_FINGER_HEIGHT * 0.3, UPPER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_FINGER_HEIGHT * 0.3, 0.0 - 2 * (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix); 11
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//食指
function uindex_finger() {
    var s = scale4(UPPER_FINGER_WIDTH, UPPER_FINGER_HEIGHT * 0.75, UPPER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_FINGER_HEIGHT * 0.75, 0.0 - (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_FINGER_HEIGHT * 0.75 + 0.2, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[t_index_finger], 0, 0, 1));
    third_index();
}

//中指
function umiddle_finger() {
    var s = scale4(UPPER_FINGER_WIDTH, UPPER_FINGER_HEIGHT, UPPER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_FINGER_HEIGHT + 0.2, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[t_middle_finger], 0, 0, 1));
    third_middle();
}

//无名指
function uring_finger() {
    var s = scale4(UPPER_FINGER_WIDTH, UPPER_FINGER_HEIGHT * 0.75, UPPER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_FINGER_HEIGHT * 0.75, 0.0 + (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_FINGER_HEIGHT * 0.75 + 0.2, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[t_ring_finger], 0, 0, 1));
    third_ring();
}

//小拇指
function ulittle_finger() {
    var s = scale4(UPPER_FINGER_WIDTH, UPPER_FINGER_HEIGHT * 0.5, UPPER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * UPPER_FINGER_HEIGHT * 0.5, 0.0 + 2 * (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_FINGER_HEIGHT * 0.5 + 0.2, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[t_little_finger], 0, 0, 1));
    third_little();
}

//----------------------------------------------------------------------------

//第一关节

//大拇指
function lthumb() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, LOWER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_FINGER_HEIGHT, 0.0 - 2 * (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//食指
function lindex_finger() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, LOWER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_FINGER_HEIGHT, 0.0 - (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//中指
function lmiddle_finger() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, LOWER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//无名指
function lring_finger() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, LOWER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_FINGER_HEIGHT, 0.0 + (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//小拇指
function llittle_finger() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, LOWER_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * LOWER_FINGER_HEIGHT, 0.0 + 2 * (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}


//----------------------------------------------------------------------------

//第三关节

//食指
function third_index() {
    var s = scale4(THIRD_FINGER_WIDTH, THIRD_FINGER_HEIGHT, THIRD_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * THIRD_FINGER_HEIGHT, 0.0 - (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//中指
function third_middle() {
    var s = scale4(THIRD_FINGER_WIDTH, THIRD_FINGER_HEIGHT, THIRD_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * THIRD_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//无名指
function third_ring() {
    var s = scale4(THIRD_FINGER_WIDTH, THIRD_FINGER_HEIGHT, THIRD_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * THIRD_FINGER_HEIGHT, 0.0 + (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}

//小拇指
function third_little() {
    var s = scale4(THIRD_FINGER_WIDTH, THIRD_FINGER_HEIGHT, THIRD_FINGER_WIDTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * THIRD_FINGER_HEIGHT, 0.0 + 2 * (UPPER_FINGER_WIDTH + 0.2)), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}
//----------------------------------------------------------------------------
var render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = rotate(theta[UpperBase], hands1, hands2, hands3);//手臂弯曲矩阵，作为根节点
	
    upperArmbase();
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT + 0.2, 0.0));//在手臂的基础上绘制手掌需要平移手臂高度的位置
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerBase], 0, 0, 1));//绘制手掌的初始角度
    lowArmbase();

    for (var i = 1; i <= 5; i++) {
        switch (i) {
            case 1:
                modelViewMatrix = rotate(theta[UpperBase], hands1, hands2, hands3);//联立手臂根节点
				
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerBase], 0, 0, 1));//联立手掌根节点
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT + 0.1, 0.0));
                
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[l_thumb], 0, 0, 1));//绘制大拇指第一关节的初始角度
                lthumb();
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT+0.2, 0.0));//联立第一关节
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[u_thumb], 0, 0, 1));//绘制第二关节的初始角度
                uthumb();
                break;
            case 2:
                modelViewMatrix = rotate(theta[UpperBase], hands1, hands2, hands3);
				
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerBase], 0, 0, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[l_index_finger], 0, 0, 1));
                lindex_finger();
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT + 0.2, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[u_index_finger], 0, 0, 1));
                uindex_finger();
                break;
            case 3:
                modelViewMatrix = rotate(theta[UpperBase], hands1, hands2, hands3);
				
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerBase], 0, 0, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[l_middle_finger], 0, 0, 1));
                lmiddle_finger();
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT + 0.2, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[u_middle_finger], 0, 0, 1));
                umiddle_finger();
                break;
            case 4:
                modelViewMatrix = rotate(theta[UpperBase], hands1, hands2, hands3);
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerBase], 0, 0, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[l_ring_finger], 0, 0, 1));
                lring_finger();
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT + 0.2, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[u_ring_finger], 0, 0, 1));
                uring_finger();
                break;
            case 5:
                modelViewMatrix = rotate(theta[UpperBase], hands1, hands2, hands3);
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, UPPER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerBase], 0, 0, 1));
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT + 0.1, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[l_little_finger], 0, 0, 1));
                llittle_finger();
                modelViewMatrix = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT + 0.2, 0.0));
                modelViewMatrix = mult(modelViewMatrix, rotate(theta[u_little_finger], 0, 0, 1));
                ulittle_finger();
                break;

        }
    }
    requestAnimFrame(render);
}

function numb1(){
	for(var i = 2;i<=15;i++){
		if(i==3||i==8||i==12)theta[i]=0;
		else theta[i]=90;
	}
}
function numb2(){
	for(var i = 2;i<=15;i++){
		if(i==3||i==8||i==12||i==4||i==9||i==13)theta[i]=0;
		else theta[i]=90;
	}
}
function numb3(){
	for(var i = 2;i<=15;i++){
		if(i==3||i==8||i==12||i==4||i==9||i==13||i==5||i==10||i==14)theta[i]=0;
		else theta[i]=90;
	}
}
function numb4(){
	for(var i = 2;i<=15;i++){
		if(i==2||i==7)theta[i]=90;
		else theta[i]=0;
	}
}
function numb5(){
	for(var i = 2;i<=15;i++){
		theta[i]=0;
	}
}

function postStone(){
	for(var i = 2;i<=15;i++){
		theta[i]=90;
	}
}

