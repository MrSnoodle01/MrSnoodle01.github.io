const MAX = 20;
var delay = 0;
var nodeArr = [];
var connectionsArr = [];
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
    constructor(x, y, letter){
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.distFromSrc = 10000;
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
    document.getElementById("table").innerHTML = "<tr style='color:#8fdee6'><th>node</th><th>distance from start</th></tr>"
    connectionsArr = [];
    nodeArr = [];

    generateArray(numItems);
    addConnections();
    addVisualConnections();
    if(!inputCheck(numItems))
        return;

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
        case "Dijkstra's Algorithm":
            console.log("dijkstra's algorithm");
            await dijkstras();
            break;
        default:
            break;
    }
    document.getElementById('submit').disabled = false;
}

// turn user input into an array of connections
function addConnections(){
    let input = document.getElementById('customText').value;
    let inputArr = input.split(/\n|,/);
    console.log(inputArr);
    for(let i = 0; i < inputArr.length; i+=3){
        let tempStart = "";
        let tempEnd = "";
        for(let j = 0; j < nodeArr.length; j++){
            if(nodeArr[j].letter == inputArr[i])
                tempStart = nodeArr[j]
            else if(nodeArr[j].letter == inputArr[i+2])
                tempEnd = nodeArr[j];
        }
        let tempObj = new connection(tempStart, Number(inputArr[i+1]), tempEnd);
        connectionsArr.push(tempObj);
    }
}

//generate array of nodes and connects them
function generateArray(numItems){
    const context = canvas.getContext("2d");
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
        let letter = characters.charAt(i);
        let tempObj = new node(x, y, letter);
        nodeArr.push(tempObj);

        // // add nodes to canvas
        drawNode(tempObj, width, height, "white");

        // move x values to right and y values down
        if((i+1) % offsetVal == 0){
            offsetY += 1/(offsetVal - .5);
            offsetX = 0;
        }else{
            offsetX += 1/(offsetVal - .5);
        }

        // add node to table
        const table = document.getElementById('table');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td style="color:#8fdee6">
        ${letter}
        </td>
        <td style="color:#8fdee6">
        INF
        </td>`;
        table.appendChild(row);
    }
}

// checks user input for errors
function inputCheck(numItems){
    let input = document.getElementById('customText').value;
    let inputArr = input.split(/\n|,/);
    for(let i = 0; i < inputArr.length; i+=3){
        if(!/[A-Z]/.test(inputArr[i])){
            alert("Please only enter start nodes from A-Z");
            return false;
        }
        if(inputArr[i].length > 1){
            alert("Please only enter single letter start nodes");
            return false;
        }
        if(!/[0-9]/.test(Number(inputArr[i+1]))){
            alert("Please only enter numbers for the weight");
            return false;
        }
        if(Number(inputArr[i+1]) > 20 || Number(inputArr[i+1]) < 0){
            alert("Please enter a weight less than 20 and greater than -1");
        }
        if(!/[A-Z]/.test(inputArr[i+2])){
            alert("Please only enter end nodes from A-Z");
            return false;
        }
        if(inputArr[i+2].length > 1){
            alert("Please only enter single letter end nodes");
            return false;
        }
        if(inputArr[i].charCodeAt(0)-64 > numItems || inputArr[i+2].charCodeAt(0)-64 > numItems){
            alert("Please only enter node letters that will be visible on the graph");
            return false;
        }
    }
    return true;
}

// adds the visual part of connections
function addVisualConnections(){
    let width = canvas.width*.1
    let height = canvas.height*.1;
    let context = canvas.getContext("2d");

    // add connections to nodes
    for(let i = 0; i < connectionsArr.length; i++){
        // draw line between nodes
        drawArrow(context, connectionsArr[i].start, connectionsArr[i].end, "blue", connectionsArr[i].weight);
    }
}

// function to draw line between nodes with an arrow at end and weight of connection
// TODO: make arrows look better
// TODO: make colors not overlap when redrawing
function drawArrow(context, startNode, endNode, color, weight){
        let startX = 0, startY = 0, endX = 0, endY = 0;
        let width = canvas.width*.1
        let height = canvas.height*.1;
        
        // change where connection starts/ends 
        // based on where nodes are in realtion to eachother
        if(startNode.x > endNode.x){ // start is further right than end
            startX = startNode.x;
            endX = endNode.x + width;
        }else if(startNode.x < endNode.x){ // start is further left than end
            startX = startNode.x + width;
            endX = endNode.x;
        }else{ // start and end are in same column
            startX = startNode.x + width/2;
            endX = endNode.x + width/2;
        }
        if(startNode.y > endNode.y){ // start is below the end
            startY = startNode.y;
            endY = endNode.y + height;
        }else if(startNode.y < endNode.y){ // start is above  the end
            startY = startNode.y + height;
            endY = endNode.y;
        }else{ // start and end are in same row
            startY = startNode.y + height/2;
            endY = endNode.y + height/2;
        }

    let headLen = 10;
    let dx = endX - startX;
    let dy = endY - startY;
    let angle = Math.atan2(dy, dx);
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = color;
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.lineTo(endX - headLen * Math.cos(angle-Math.PI/6), endY - headLen * Math.sin(angle-Math.PI/6));
    context.moveTo(endX, endY);
    context.lineTo(endX - headLen * Math.cos(angle+Math.PI/6), endY - headLen * Math.sin(angle+Math.PI/6));
    context.stroke();
    
    // draw weight next to line
    context.font = "50px serif";
    context.fillStyle = "orange";
    context.fillText(weight, (startX+endX)/2, (startY+endY)/2);
}

// change value in table
function tableChange(rowNum, newNum){
    let table = document.getElementById("table");
    let row = table.getElementsByTagName("tr")[rowNum];
    let td = row.getElementsByTagName("td")[1];
    td.innerHTML = newNum;
}

// returns value from table of rowNum's row
function getTableValue(rowNum){
    let table = document.getElementById("table");
    let row = table.getElementsByTagName("tr")[rowNum];
    let td = row.getElementsByTagName("td")[1];
    return td.innerText;
}

// draws a node on the canvas
function drawNode(node, width, height, color){
    let context = canvas.getContext("2d");

    context.fillStyle = color;
    context.fillRect(node.x, node.y, width, height);
    context.font = "50px serif";
    context.fillStyle = "black";
    context.fillText(node.letter, node.x+(width/2), node.y+(height/2));
}

// sorting algorithm for dijkstras
function insertionSort(arr, n){  
    let i, key, j;  
    for (i = 1; i < n; i++){  
        key = arr[i];  
        j = i - 1;  
  
        /* Move elements of arr[0..i-1], that are  
        greater than key, to one position ahead  
        of their current position */
        while (j >= 0 && arr[j].distFromSrc > key.distFromSrc){  
            arr[j + 1] = arr[j];  
            j = j - 1;  
        }  
        arr[j + 1] = key;  
    }  
}  

// adds the first node in array's connections to the array
// either updating their distance or adding a new element
async function addToArray(src, arr){
    let context = canvas.getContext("2d");
    // find connections where src is start
    for(let i = 0; i < connectionsArr.length; i++){
        if(connectionsArr[i].start == src){
            drawArrow(context, connectionsArr[i].start, connectionsArr[i].end, "red", connectionsArr[i].weight);
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );
            // TODO: fix error if start node is same as end node
            // see if end node is already in array
            // if not add it, if so update distance if needed
            let isIn = false;
            for(let j = 0; j < arr.length; j++){
                if(arr[j] == connectionsArr[i].end){
                    isIn = true;
                }
            }
            if(!isIn){ // add node to array 
                let tempDist = connectionsArr[i].start.distFromSrc + connectionsArr[i].weight;
                if(Number(getTableValue((connectionsArr[i].end.letter).charCodeAt(0) - 64)) > tempDist
                || getTableValue((connectionsArr[i].end.letter).charCodeAt(0) - 64) == "INF"){
                    connectionsArr[i].end.distFromSrc = tempDist;
                    tableChange((connectionsArr[i].end.letter).charCodeAt(0) - 64, connectionsArr[i].end.distFromSrc);
                    arr.push(connectionsArr[i].end);
                }
            }else{ // node is in array, update distance if needed
                for(let j = 0; j < arr.length; j++){
                    if(arr[j] == connectionsArr[i].end){
                        let tempDist = connectionsArr[i].start.distFromSrc + connectionsArr[i].weight;
                        if(arr[j].distFromSrc > tempDist){
                            arr[j].distFromSrc = tempDist;
                            tableChange((arr[j].letter).charCodeAt(0) - 64, arr[j].distFromSrc);
                        }
                    }
                }
            }
            drawArrow(context, connectionsArr[i].start, connectionsArr[i].end, "blue", connectionsArr[i].weight);
        }
    }
    // remove first item which is now fully processed
    // TODO: make this not override connctions going through node
    drawNode(arr[0], canvas.width*.1, canvas.height*.1, "white");
    arr.shift();
    // sort array
    if(arr.length != 0){}
        await insertionSort(arr, arr.length);
}

// dijkstras algorithm
// creates sorted array of partially processed nodes
// iterates through those nodes' connections to add others to array
async function dijkstras(){
    // set start node distance to zero
    nodeArr[0].distFromSrc = 0
    tableChange(1, nodeArr[0].distFromSrc);
    let arr = [nodeArr[0]];

    // iterate through array until all nodes have been processed
    while(arr.length != 0){
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
        );
        drawNode(arr[0], canvas.width*.1, canvas.height*.1, "red");
        await addToArray(arr[0], arr);
    }
}

// TODO: add drag and drop ability
// TODO: add current stack table