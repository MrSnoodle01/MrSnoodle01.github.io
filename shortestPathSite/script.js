const MAX = 20;
var delay = 0;
var nodeArr = [];
var container = document.getElementById("array");

// connection class to connect nodes
class connection{
    constructor(start, weight, end){
        this.start = start;
        this.weight = weight;
        this.end = end;
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

    // clear old bars
    document.getElementById("array").innerHTML = "";

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
        case "Djikstra's algorithm":
            console.log("djikstra's algorithm");
            await djikstras(blocks);
            break;
        default:
            break;
    }
    document.getElementById('submit').disabled = false;
}

// generate array of nodes and connects them
function generateArray(numItems){
    let characters = 'SABCDEFGHIJKLMNOPQRTUVWXYZ'
    // get square root of closest even square root of numItems to make nice square with nodes
    let offsetVal = Math.sqrt(Math.pow(Math.ceil(Math.sqrt(numItems)),2));
    let offsetX = 0;
    let offsetY = 0;
    let backgroundHeight = document.getElementById('array').offsetHeight;
    let backgroundWidth = document.getElementById('array').offsetWidth;
    for(let i = 0; i < numItems; i++){
        let value = characters.charAt(i);
        nodeArr[i] = value;

        // create element div
        let array_ele = document.createElement("div");

        // add class node to div
        array_ele.classList.add("node");

        // move nodes to correct location
        // TODO: MAKE THIS DYNAMICALLY WORK WHEN CHANGING SCREEN SIZES
        array_ele.style.transform = `translate(${backgroundWidth*offsetX}px, ${backgroundHeight*offsetY}px)`;

        // array_ele.style.transform = `translateY(${offset*100}%)`;

        // creating label element for displaying node identifier
        let array_ele_label = document.createElement("label");
        array_ele_label.classList.add("node_id");
        array_ele_label.innerText = value;

        // appending created elements to index.html
        array_ele.appendChild(array_ele_label);
        container.appendChild(array_ele);

        if((i+1) % offsetVal == 0){
            offsetY += 1/(offsetVal - .5);
            offsetX = 0;
        }else{
            offsetX += 1/(offsetVal - .5);
        }
    }
}

function djikstras(){

}