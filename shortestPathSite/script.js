const MAX = 20;
var delay = 0;
var nodeArr = [];
var connectionsArr = [];
var container = document.getElementById("screen");

// connection class to connect nodes
class connection{
    constructor(start, weight, end){
        this.start = start;
        this.weight = weight;
        this.end = end;
        this.line = null;
    }

    changeLineColor(color){
        this.line.color = color;
    }
}

class node{
    constructor(x, y, width, height, letter){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
    // const context = canvas.getContext('2d');
    // context.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelectorAll('.leader-line').forEach(e => e.remove());
    document.getElementById("screensvg").innerHTML = "";
    document.getElementById("distTable").innerHTML = "<tr style='color:#8fdee6'><th>node</th><th>distance from start</th></tr>";
    connectionsArr = [];
    nodeArr = [];

    generateArray(numItems);
    addConnections();
    if(!inputCheck(numItems))
        return;
    addVisualConnections();

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
    for(let i = 0; i < inputArr.length; i+=3){
        let tempStart = "";
        let tempEnd = "";
        for(let j = 0; j < nodeArr.length; j++){
            if(nodeArr[j].letter == inputArr[i] && nodeArr[j].letter == inputArr[i+2]){
                tempStart = nodeArr[j];
                tempEnd = nodeArr[j];
            }else if(nodeArr[j].letter == inputArr[i]){
                tempStart = nodeArr[j]
            }else if(nodeArr[j].letter == inputArr[i+2]){
                tempEnd = nodeArr[j];
            }
        }
        let tempObj = new connection(tempStart, Number(inputArr[i+1]), tempEnd);
        connectionsArr.push(tempObj);
    }
}

//generate array of nodes and connects them
function generateArray(numItems){
    // const context = canvas.getContext("2d");
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // get square root of closest even square root of numItems to make nice square with nodes
    let offsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(numItems)),2));
    let offsetX = 0;
    let offsetY = 0;
    let backgroundHeight = document.getElementById('screen').clientHeight;
    let backgroundWidth = document.getElementById('screen').clientWidth;
    let width = Math.floor(backgroundHeight*.15);
    let height = Math.floor(backgroundWidth*.1);

    for(let i = 0; i < numItems; i++){
        let x = parseInt(backgroundWidth*offsetY);
        let y = parseInt(backgroundHeight*offsetX);
        let letter = characters.charAt(i);
        let tempObj = new node(x, y, width, height, letter);
        nodeArr.push(tempObj);

        // add nodes to canvas
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute('class', "draggable");
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('height', height);
        rect.setAttribute('width', width);
        rect.setAttribute('fill', "white");
        rect.setAttribute('id', letter);
        rect.setAttribute('rx', "15");
        rect.setAttribute('class', "draggable");

        text.setAttribute('x', x+(width/2));
        text.setAttribute('y', y+(height/2));
        text.setAttribute('fill', "black");
        text.setAttribute('class', "draggable");
        text.innerHTML = letter;

        group.appendChild(rect);
        group.appendChild(text);
        let svg = document.getElementById("screensvg");
        svg.appendChild(group);

        // move x values to right and y values down
        if((i+1) % offsetVal == 0){
            offsetY += 1/(offsetVal - .5);
            offsetX = 0;
        }else{
            offsetX += 1/(offsetVal - .5);
        }

        // add node to table
        const table = document.getElementById('distTable');
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
// TODO: make arrow for if start node is same as end node
function addVisualConnections(){
    // add connections to nodes using Leader Line
    for(let i = 0; i < connectionsArr.length; i++){
        connectionsArr[i].line = new LeaderLine(document.getElementById(connectionsArr[i].start.letter),
        document.getElementById(connectionsArr[i].end.letter),
        {color: 'blue', middleLabel: LeaderLine.pathLabel({text: (connectionsArr[i].weight).toString(), outlineColor: 'black', color: 'orange'})});
    }
}

// change value in a table
function tableChange(rowNum, newNum, tableName, col){
    let table = document.getElementById(tableName);
    let row = table.getElementsByTagName("tr")[rowNum];
    let td = row.getElementsByTagName("td")[col];
    td.innerHTML = newNum;
}

// returns value from distance table of rowNum's row
function getTableValue(rowNum){
    let table = document.getElementById("distTable");
    let row = table.getElementsByTagName("tr")[rowNum];
    let td = row.getElementsByTagName("td")[1];
    return td.innerText;
}

// TODO: make arrows follow moving nodes
// function for dragging and dropping elements
function makeDraggable(evt){
    var svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    // for mobile
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);
    var selectedElement = null, offset;

    function getMousePosition(evt){
        var CTM = svg.getScreenCTM();
        if(evt.touches) { evt = evt.touches[0]; }
        return{
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }

    function startDrag(evt){
        if(evt.target.classList.contains('draggable')){
            selectedElement = evt.target.parentNode;
            offset = getMousePosition(evt);

            var transforms = selectedElement.transform.baseVal;

            if(transforms.length == 0 || transforms.getItem(0).type != SVGTransform.SVG_TRANSFORM_TRANSLATE){
                var translate = svg.createSVGTransform();
                translate.setTranslate(0,0);

                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            transform = transforms.getItem(0);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
        }
    }

    function drag(evt){
        if(selectedElement){
            evt.preventDefault();
            var coord = getMousePosition(evt);
            transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        }
    }

    function endDrag(evt){
        selectedElement = null;
    }
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
    // find connections where src is start
    for(let i = 0; i < connectionsArr.length; i++){
        if(connectionsArr[i].start == src){
            connectionsArr[i].changeLineColor("red");
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );
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
                    tableChange((connectionsArr[i].end.letter).charCodeAt(0) - 64, connectionsArr[i].end.distFromSrc, "distTable", 1);
                    arr.push(connectionsArr[i].end);
                }
            }else{ // node is in array, update distance if needed
                for(let j = 0; j < arr.length; j++){
                    if(arr[j] == connectionsArr[i].end){
                        let tempDist = connectionsArr[i].start.distFromSrc + connectionsArr[i].weight;
                        if(arr[j].distFromSrc > tempDist){
                            arr[j].distFromSrc = tempDist;
                            tableChange((arr[j].letter).charCodeAt(0) - 64, arr[j].distFromSrc, "distTable", 1);
                        }
                    }
                }
            }
            connectionsArr[i].changeLineColor("blue");
        }
    }
    // remove first item which is now fully processed
    document.getElementById(arr[0].letter).style.fill = "white";
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
    tableChange(1, nodeArr[0].distFromSrc, "distTable", 1);
    let arr = [nodeArr[0]];
    
    // iterate through array until all nodes have been processed
    while(arr.length != 0){
        // reset node array table
        document.getElementById("stackTable").innerHTML = "<caption style='color:#8fdee6'>Current node array</caption><tr style='color:#8fdee6'><td>Node</td></tr><tr style='color:#8fdee6'><td>Dist</td></tr>";
        let trs = document.querySelectorAll("#stackTable tr");
        
        // add array to node array table
        for(let i = 0; i < arr.length; i++){
            for(let tr of trs){
                let td = document.createElement('td');
                if(tr.innerText[0] == "N"){
                    td.innerText = arr[i].letter;
                }else{
                    td.innerText = arr[i].distFromSrc;
                }
                tr.appendChild(td);
            }
        }
        
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay*1.5)
        );
        
        document.getElementById(arr[0].letter).style.fill = "red";
        await addToArray(arr[0], arr);
    }
    // reset node array table
    document.getElementById("stackTable").innerHTML = "<caption style='color:#8fdee6'>Current node array</caption><tr style='color:#8fdee6'><td>Node</td></tr><tr style='color:#8fdee6'><td>Dist</td></tr>";
}