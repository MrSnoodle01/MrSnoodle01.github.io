const MAX = 20;
var delay = 0;
var nodeArr = [];
var connectionsArr = [];
// var container = document.getElementById("array");
const canvas = document.getElementById("canvas");

// connection class to connect nodes
class connection{
    constructor(start, weight, end){
        this.start = start;
        this.weight = weight;
        this.end = end;
    }
}

class node{
    constructor(x, y, value){
        this.x = x;
        this.y = y;
        this.value = value;
    }
}

// gets the value of the speed slider
document.getElementById("speedSlider").oninput = function(){
    delay = document.getElementById("speedSlider").value;
    // fast is to right, slow is to left 
    delay = (delay - 250) * (-1);
}

// send user back to home page when clicking home button
document.getElementById('home-button').addEventListener('click', () =>{
    location.href = "../";
})

// when user clicks submit button begin the sorting process
document.getElementById('submit').addEventListener('click', () =>{
    let numItems = document.getElementById("num-items").value;

    // make sure user's number is at more than 0 and less than 27
    if(numItems > 26 || numItems < 1){
        alert("please enter a number greater than 0 and less than 27");
        return;
    }

    // gets delay value in case that user didnt touch the slider
    delay = document.getElementById("speedSlider").value;
    // fast is to right, slow is to left
    delay = (delay - 250) * (-1);

    // clear old nodes
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    connectionsArr = [];
    nodeArr = [];

    getConnections();
    generateArray(numItems);

    // disables button so that graphs cant overlap
    document.getElementById('submit').disabled = true;

    // get which algorithm is chosen by user
    let el = document.getElementById('options');
    algoPick(el);
})

// picks algorithm from user
// important to use await so button stays disabled
async function algoPick(el){
    switch(el.options[el.selectedIndex].innerHTML){
        case "Djikstra's Algorithm":
            console.log("djikstra's algorithm");
            await djikstras();
            break;
        default:
            break;
    }
    document.getElementById('submit').disabled = false;
}

// turn user input into an array of connections
function getConnections(){
    let input = document.getElementById('customText').value;
    let j = 0;
    for(let i = 0; i < input.length; i+=6){
        // TODO: fix so that weight can work with more than just single digit numbers
        let tempObj = new connection(input[i], input[i+2], input[i+4]);
        connectionsArr.push(tempObj);
        j++;
    }
}

//generate array of nodes and connects them
function generateArray(numItems){
    const context = canvas.getContext("2d");
    let characters = 'SABCDEFGHIJKLMNOPQRTUVWXYZ';
    // get square root of closest even square root of numItems to make nice square with nodes
    let offsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(numItems)),2));
    let offsetX = 0;
    let offsetY = 0;
    let backgroundHeight = canvas.height;
    let backgroundWidth = canvas.width;
    let width = canvas.width*.1;
    let height = canvas.height*.1;

    for(let i = 0; i < numItems; i++){
        let x = parseInt(backgroundWidth*offsetY);
        let y = parseInt(backgroundHeight*offsetX);
        let value = characters.charAt(i);
        let tempObj = new node(x, y, value);
        nodeArr.push(tempObj);

        // add nodes to canvas
        context.fillStyle = "white";
        context.fillRect(x, y, width, height);
        context.font = "50px serif";
        context.fillStyle = "black";
        context.fillText(value, x+(width/2), y+(height/2));

        if((i+1) % offsetVal == 0){
            offsetY += 1/(offsetVal - .5);
            offsetX = 0;
        }else{
            offsetX += 1/(offsetVal - .5);
        }
    }

    // add connections to nodes
    for(let i = 0; i < connectionsArr.length; i++){
        // get start and end coordinates
        let startX = 0, startY = 0, endX = 0, endY = 0;
        for(let j = 0; j < nodeArr.length; j++){
            if(nodeArr[j].value == connectionsArr[i].start){
                var tempStart = nodeArr[j];
            }
            if(nodeArr[j].value == connectionsArr[i].end){
                var tempEnd = nodeArr[j];
            }
        }
        
        // change where connection starts/ends 
        // based on where nodes are in realtion to eachother
        if(tempStart.x > tempEnd.x){ // start is further right than end
            startX = tempStart.x;
            endX = tempEnd.x + width;
        }else if(tempStart.x < tempEnd.x){ // start is further left than end
            startX = tempStart.x + width;
            endX = tempEnd.x;
        }else{ // start and end are in same column
            startX = tempStart.x + width/2;
            endX = tempEnd.x + width/2;
        }
        if(tempStart.y > tempEnd.y){ // start is below the end
            console.log("below with ", tempStart.value, " ", tempEnd.value);
            startY = tempStart.y;
            endY = tempEnd.y + height;
        }else if(tempStart.y < tempEnd.y){ // start is above  the end
            console.log("above with ", tempStart.value, " ", tempEnd.value);
            startY = tempStart.y + height;
            endY = tempEnd.y;
        }else{ // start and end are in same row
            console.log("same row with ", tempStart.value, " ", tempEnd.value);
            startY = tempStart.y + height/2;
            endY = tempEnd.y + height/2;
        }

        context.strokeStyle = "blue";
        context.beginPath();
        context.lineWidth = 5;
        drawArrow(context, startX, startY, endX, endY);
        context.stroke();
    }
}

function drawArrow(context, startX, startY, endX, endY){
    let headLen = 10;
    let dx = endX - startX;
    let dy = endY - startY;
    let angle = Math.atan2(dy, dx);
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.lineTo(endX - headLen * Math.cos(angle-Math.PI/6), endY - headLen * Math.sin(angle-Math.PI/6));
    context.moveTo(endX, endY);
    context.lineTo(endX - headLen * Math.cos(angle+Math.PI/6), endY - headLen * Math.sin(angle+Math.PI/6));
}

function djikstras(){
    
}