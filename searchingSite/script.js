const MAX = 100;
var delay = 0;
var container = document.getElementById("array");

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

// checks if custom input has been chosen
document.getElementById("customInput").oninput = function(){
    if(customInput.checked){
        document.getElementById("custom").style.display = "block";
    }else{
        document.getElementById("custom").style.display = "none";
    }
}

// when user clicks submit button begin the sorting process
document.getElementById('submit').addEventListener('click', () =>{
    var numItems = document.getElementById("num-items").value;

    // make sure user's number is at more than 0 and less than 101
    if(numItems > 100 || numItems < 1){
        alert("please enter a number greater than 0 and less than 101");
        return;
    }

    // gets delay value in case that user didnt touch the slider
    delay = document.getElementById("speedSlider").value;
    // fast is to right, slow is to left
    delay = (delay - 250) * (-1);

    // clear old bars
    document.getElementById("array").innerHTML = "";

    // generate random array and cooresponding divs
    generateArray(numItems);

     // make bar widths a percentage instead of number of pixels
    let item = document.querySelector(':root');
    item.style.setProperty('--width', 100/numItems + '%');

    // get item to be searched for
    let index = 0;
    if(document.getElementById("customInput").checked){
        index = Number(document.getElementById("numberInput").value);
        // bound checking
        if(index >= numItems || index < 0){
            alert(`Please insert a number less than ${numItems} and greater than -1`);
            return;
        }
        if(!/^[0-9]*$/.test(index)){
            alert("You have entered a non-number. Please try again");
            return;
        }
    }else{
        index = Math.floor(Math.random() * numItems);
    }

    var blocks = document.querySelectorAll(".block");

    var searchValue = blocks[index].childNodes[0].innerText;
    blocks[index].style.backgroundColor = "#bfa615";

    // disables button so that graphs cant overlap
    document.getElementById('submit').disabled = true;

    // get which algorithm is chosen by user
    let el = document.getElementById('options');
    algoPick(el, blocks, searchValue);
})

// picks algorithm from user
// important to use await so button stays disabled
async function algoPick(el, blocks, searchValue){
    switch(el.options[el.selectedIndex].innerHTML){
        case 'Linear Search':
            console.log("linear search");
            await linearSearch(blocks, searchValue);
            break;
        default:
            break;
    }
    document.getElementById('submit').disabled = false;
}

// generate array of blocks with no duplicate values
function generateArray(numItems){
    // let tempArray = [4,10,3,5,1];
    let tempArr = [];
    for(let i = 0; i < numItems; i++){
        // get value between 1 and MAX 
        let value = Math.ceil(Math.random() * MAX);
        while(isIn(tempArr, value))
            value = Math.ceil(Math.random() * MAX);
        tempArr[i] = value;
        // let value = tempArray[i];
        // myArr[i] = value;

        // create element div
        let array_ele = document.createElement("div");

        // adding class 'block' to div
        array_ele.classList.add("block",i);

        // add height to bars
        array_ele.style.height = `${value}%`;
        // move bars over
        array_ele.style.transform = `translate(${i * 100}%)`;

        // creating label element for displaying size of particular block
        let array_ele_label = document.createElement("label");
        array_ele_label.classList.add("block_id");
        array_ele_label.innerText = value;

        // appending created elemets to index.html
        array_ele.appendChild(array_ele_label);
        container.appendChild(array_ele);
    }
}

// swaps two blocks
function swap(blocks, index1, index2){
    return new Promise((resolve) => {
        window.requestAnimationFrame(function() {
            // wait .1 seconds
            setTimeout(() => {
                let temp1 = blocks[index1].childNodes[0].innerHTML;
                let temp2 = blocks[index1].style.height;


                blocks[index1].childNodes[0].innerHTML = blocks[index2].childNodes[0].innerHTML;
                blocks[index1].style.height = blocks[index2].style.height;

                blocks[index2].childNodes[0].innerHTML = temp1;
                blocks[index2].style.height = temp2;
                resolve();
            }, delay/2);
        });
    });
}

function isIn(arr, num){
    for(let i = 0; i < arr.length; i++){
        if(arr[i] == num)
            return true;
    }
    return false;
}

// linear search function
async function linearSearch(blocks, searchValue){
    for(let i = 0; i < blocks.length; i++){
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
        );
        if(Number(blocks[i].childNodes[0].innerText) == searchValue){
            blocks[i].style.backgroundColor = "#13CE66";
            return;
        }else{
            blocks[i].style.backgroundColor = "#FF4949";
        }
    }
        
}


