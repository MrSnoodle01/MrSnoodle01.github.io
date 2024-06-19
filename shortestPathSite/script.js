var delay = 0;
var offsetX = 0, offsetY = 0;
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

// add nodes to screen before running algorithm
document.getElementById('num-items').oninput = function(){
    let numItems = Number(document.getElementById('num-items').value);

    if(numItems > 26 || numItems < 1 && isNaN(numItems)){
        alert("Please enter a number greater than 0 and less than 27");
        return;
    }

    // if number is incresed
    if(numItems > nodeArr.length){
        // add new nodes
        for(let i = nodeArr.length; i < numItems; i++){
            let prevOffsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(nodeArr.length)),2));
            addNodeToArray(nodeArr.length+1, i, prevOffsetVal);
        }
    }else if(numItems < nodeArr.length){
        // remove each element
        for(let i = nodeArr.length; i > numItems; i--){
            
            // remove last node
            let popped = nodeArr.pop(); 
            // remove lines cooresponding with that node
            for(let j = 0; j < connectionsArr.length; j++){
                if(connectionsArr[j].end.letter == popped.letter || connectionsArr[j].start.letter == popped.letter){
                    if(connectionsArr[j].line != null && connectionsArr[j].line != undefined){
                        (connectionsArr[j].line).remove();
                        connectionsArr.splice(j, 1);
                        j--;
                    }
                }
            }
            
            // remove visual part of node
            let element = document.getElementById(`group${popped.letter}`);
            element.remove();

            // remove node from table
            document.getElementById('distTable').deleteRow(numItems+1);

            // rescale when removing nodes
            let offsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(nodeArr.length)),2));
            let prevOffsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(nodeArr.length+1)),2));
            if(offsetVal != prevOffsetVal){
                nodeArr = [];
                for(let j = 0; j < numItems; j++){
                    document.getElementById('distTable').deleteRow(1);
                }
                for(let j = 0; j < numItems; j++){
                    addNodeToArray(numItems, j, prevOffsetVal);
                }
            }else{ // change offsets
                if((numItems+1) % offsetVal == 0){
                    offsetY -= 1/(offsetVal - .5);
                    // if node is last in col and offsetX has been set to zero
                    offsetX += (1/(offsetVal - .5)*(offsetVal-1));
                }else if(offsetX > 0){
                    offsetX -= 1/(offsetVal - .5);
                }
            }
        }
    }
}

// when user clicks submit button 
document.getElementById('submit').addEventListener('click', () =>{
    let numItems = document.getElementById("num-items").value;

    // make sure user's number is at more than 0 and less than 27
    if(numItems > 26 || numItems < 1){
        alert("please enter a number greater than 1 and less than 27");
        return;
    }

    // gets delay value in case that user didnt touch the slider
    delay = document.getElementById("speedSlider").value;
    // fast is to right, slow is to left
    delay = (delay - 250) * (-1);

    // clear old nodes
    document.querySelectorAll('.leader-line').forEach(e => e.remove());
    connectionsArr = [];

    addConnections();
    if(!inputCheck(numItems))
        return;
    addVisualConnections();

    // disables button so that graphs cant overlap
    document.getElementById('submit').disabled = true;
    document.getElementById('num-items').disabled = true;

    // remove stack table
    document.getElementById("stackTable").setAttribute("hidden", "hidden");

    // remove text saying there is a negative cycle
    if(document.getElementById("negText") != null)
        document.getElementById("negText").remove();

    // get which algorithm is chosen by user
    let el = document.getElementById('options');
    algoPick(el);

    // clear table for use without any settings changes
    for(let i = 1; i < numItems; i++){
        tableChange((nodeArr[i].letter).charCodeAt(0) - 64, "INF", "distTable", 1)
        nodeArr[i].distFromSrc = 10000;
    }
})

// function to load 2 nodes when website is first loaded
function startFunction(){
    document.getElementById("stackTable").setAttribute("hidden", "hidden");
    generateArray(2);
}

// picks algorithm from user
// important to use await so button stays disabled
async function algoPick(el){
    switch(el.options[el.selectedIndex].innerHTML){
        case "Dijkstra's Algorithm":
            console.log("dijkstra's algorithm");
            document.getElementById("stackTable").removeAttribute("hidden");
            await dijkstras();
            break;
        case "Bellman-Ford Algorithm":
            console.log("bellman-ford algorithm");
            await bellmanFord();
            break;
        case "Floyd-Warshall Algorithm":
            console.log("floyd-warshall algorithm");
            await floydWarshall();
            break;
        default:
            break;
    }
    document.getElementById('submit').disabled = false;
    document.getElementById('num-items').disabled = false;
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
        if(Number(inputArr[i+1]) > 20 || Number(inputArr[i+1]) < -20){
            alert("Please enter a weight less than 20 and greater than -20");
            return false;
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
        let el = document.getElementById('options')
        if(Number(inputArr[i+1]) < 0 && el.options[el.selectedIndex].innerHTML == "Dijkstra's Algorithm"){
            alert("Dijkstra's algorithm can't handle negative weights. Please try again");
            return false;
        }
        if(inputArr[i] == inputArr[i+2]){
            alert("Please don't have the start node the the same as the end node");
            return false;
        }
    }
    return true;
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
    // get square root of closest even square root of numItems to make nice square with nodes
    let offsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(numItems)),2));
    let prevOffsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(numItems-1)),2));
    offsetX = 0;
    offsetY = 0;
    for(let i = 0; i < numItems; i++){
        addNodeToArray(offsetVal, i, prevOffsetVal)
    }
}

// creates a new node and adds it to array
function addNodeToArray(numItems, itemIndex, prevOffsetVal){
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // get square root of closest even square root of numItems 
    let offsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(numItems)),2));

    let backgroundHeight = document.getElementById('screen').clientHeight;
    let backgroundWidth = document.getElementById('screen').clientWidth;
    let width = Math.floor(backgroundHeight*.15);
    let height = Math.floor(backgroundWidth*.1);

    // need to change all nodes coords since offsetVal(scaling) just changed
    if(offsetVal != prevOffsetVal){
        offsetX = 0;
        offsetY = 0;
        // clear screen of old nodes
        document.getElementById("screensvg").innerHTML = "";
        for(let i = 0; i < nodeArr.length; i++){
            nodeArr[i].x = parseInt(backgroundWidth*offsetY);
            nodeArr[i].y = parseInt(backgroundHeight*offsetX);
            addNodeToScreen(nodeArr[i].x, nodeArr[i].y, width, height, nodeArr[i].letter);
            // move x values to right and y values down
            if((i+1) % offsetVal == 0){
                offsetY += 1/(offsetVal - .5);
                offsetX = 0;
            }else{
                offsetX += 1/(offsetVal - .5);
            }
        }
        // redo connections
        document.querySelectorAll('.leader-line').forEach(e => e.remove());
    }

    let x = parseInt(backgroundWidth*offsetY);
    let y = parseInt(backgroundHeight*offsetX);
    let letter = characters.charAt(itemIndex);
    let tempObj = new node(x, y, width, height, letter);
    nodeArr.push(tempObj);

    // add visual part of node to screen
    addNodeToScreen(x, y, width, height, letter);

    // move x values to right and y values down
    if((itemIndex+1) % offsetVal == 0){
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

// function to add visual part of node to screen
function addNodeToScreen(x, y, width, height, letter){
    // creates group to hold both the rectangle and letter
    let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute('class', "draggable");
    group.setAttribute('id', `group${letter}`);
    
    // creates rectangle
    let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('height', height);
    rect.setAttribute('width', width);
    rect.setAttribute('fill', "white");
    rect.setAttribute('id', letter);
    rect.setAttribute('rx', "15");
    rect.setAttribute('class', "draggable");

    // creates letter text
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute('x', x+(width/2));
    text.setAttribute('y', y+(height/2));
    text.setAttribute('fill', "black");
    text.setAttribute('class', "draggable");
    text.innerHTML = letter;

    // adds rectangle and letter text to group
    group.appendChild(rect);
    group.appendChild(text);
    
    // adds group to svg screen
    let svg = document.getElementById("screensvg");
    svg.appendChild(group);
}

// adds the visual part of connections
// TODO: make arrow for if start node is same as end node
function addVisualConnections(){
    // add connections to nodes using Leader Line
    for(let i = 0; i < connectionsArr.length; i++){
        connectionsArr[i].line = new LeaderLine(
        document.getElementById(`group${connectionsArr[i].start.letter}`),
        document.getElementById(`group${connectionsArr[i].end.letter}`),
        {color: 'blue', 
        middleLabel: LeaderLine.pathLabel({text: (connectionsArr[i].weight).toString(), 
        outlineColor: 'black', 
        color: 'orange',
        textDecoration: 'underline'})});
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
    var selectedElement = null, offset, line = [];

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

            line = [];
            // get connections so they can update
            for(let i = 0; i < connectionsArr.length; i++){
                if(connectionsArr[i].start.letter == evt.target.id || connectionsArr[i].end.letter == evt.target.id){
                    // console.log("before");
                    line.push(connectionsArr[i].line);
                    // console.log("after");
                }
            }
        }
    }

    function drag(evt){
        if(selectedElement){
            evt.preventDefault();
            var coord = getMousePosition(evt);
            transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
            for(let i = 0; i < line.length; i++){
                line[i].position();
            }
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

// bellman-ford algorithm
async function bellmanFord(){
    nodeArr[0].distFromSrc = 0;
    tableChange(1, nodeArr[0].distFromSrc, "distTable", 1);

    const E = connectionsArr.length; // number of edges
    const V = nodeArr.length; // number of verticies

    // relax edges N-1 times (N = #Verticies)
    for(let i = 1; i <= V-1; i++){
        for(let j = 0; j < E; j++){
            const start = connectionsArr[j].start;
            const end = connectionsArr[j].end;
            const weight = connectionsArr[j].weight;
            connectionsArr[j].changeLineColor("red");
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );
            if(start.distFromSrc != "10000" && start.distFromSrc + weight < end.distFromSrc){
                end.distFromSrc = start.distFromSrc + weight;
                tableChange((end.letter).charCodeAt(0) - 64, start.distFromSrc+weight, "distTable", 1);
            }
            connectionsArr[j].changeLineColor("blue");
        }
    }

    // relax edges once more to check for negative cycle
    let isNeg = false;
    for(let i = 0; i < E; i++){
        const start = connectionsArr[i].start;
        const end = connectionsArr[i].end;
        const weight = connectionsArr[i].weight;
        if(start.distFromSrc != "10000" && start.distFromSrc + weight < end.distFromSrc){
            isNeg = true;
        }
    }
    if(isNeg){
        const negText = document.createElement("div");
        negText.innerText = "There is a negative cycle!";
        negText.setAttribute("style", "color:red; text-align:center; font-size:25px");
        negText.setAttribute("id", "negText");
        document.getElementById("right-container").appendChild(negText);
    }
}

// floyd-warshall algorithm
async function floydWarshall(){
    let V = nodeArr.length; // # of verticies
    let dist = Array.from(Array(V), () => new Array(V).fill(10000));

    // initialize solution matrix
    connectionsArr.forEach(e => {
        dist[(e.start.letter).charCodeAt(0)-65][(e.end.letter).charCodeAt(0)-65] = e.weight;
    });

    // diagonals equal zero
    for(let i = 0; i < V; i++){
        dist[i][i] = 0;
    }

    // initialize table
    for(let i = 0; i < V; i++){
        let tempString = "";
        
        for(let j = 0; j < V; j++){
            if(dist[i][j] == 10000)
                tempString += `${String.fromCharCode(j+65)}: INF, `;
            else
                tempString += `${String.fromCharCode(j+65)}: ${dist[i][j]}, `;
        }

        tempString = tempString.slice(0,-2); // remove last comma
        await tableChange(i+1, tempString, "distTable", 1);
    }

    for(let k = 0; k < V; k++){
        for(let i = 0; i < V; i++){
            for(let j = 0; j < V; j++){
                if(dist[i][k] + dist[k][j] < dist[i][j]){
                    dist[i][j] = dist[i][k] + dist[k][j];

                    // updates table
                    let tempString = "";
                    for(let a = 0; a < V; a++){
                        if(dist[i][a] == 10000)
                            tempString += `${String.fromCharCode(a+65)}: INF, `;
                        else
                            tempString += `${String.fromCharCode(a+65)}: ${dist[i][a]}, `;
                    }
                    tableChange(i+1, tempString, "distTable", 1);

                    await new Promise((resolve) =>
                        setTimeout(() => {
                            resolve();
                        }, delay)
                    );
                }
            }
        }
    }
}