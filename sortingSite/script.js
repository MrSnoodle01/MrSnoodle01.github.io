const MAX = 50;
var container = document.getElementById("array");

// send user back to home page when clicking home button
document.getElementById('home-button').addEventListener('click', () =>{
    location.href = "../";
})

// when user clicks submit button begin the sorting process
document.getElementById('submit').addEventListener('click', () =>{
    let numItems = document.getElementById("num-items").value;

    // make sure user's number is at most 100
    if(numItems > 100){
        alert("please enter a number less than 100");
        return;
    }

    // clear old bars
    document.getElementById("array").innerHTML = "";

    // make bar widths a percentage instead of number of pixels
    let item = document.querySelector(':root');
    item.style.setProperty('--width', 100/numItems + '%');

    // generate array and cooresponding divs
    generateArray(numItems);

    let el = document.getElementById('options');
    switch(el.options[el.selectedIndex].innerHTML){
        case 'Selection Sort':
            console.log("selection sort");
            selectionSort();
            break;
        case 'Bubble Sort':
            console.log("bubble sort");
            bubbleSort();
            break;
        default:
            break;
    }
})

// generate array of blocks
function generateArray(numItems){
    // let tempArr = [20,17,5,30,18];
    for(let i = 0; i < numItems; i++){
        // get value between 1 and MAX
        let value = Math.ceil(Math.random() * MAX);
        // let value = tempArr[i];

        // create element div
        let array_ele = document.createElement("div");

        // adding class 'block' to div
        array_ele.classList.add("block",i);

        // add height to bars
        array_ele.style.height = `${value * 2}%`;
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

// swap two blocks
function swap(el1, el2){
    return new Promise((resolve) => {
        // for exchanging styles of two blocks
        let temp = el1.style.transform;
        el1.style.transform = el2.style.transform;
        el2.style.transform = temp;

        window.requestAnimationFrame(function (){
            // wait .25 seconds
            setTimeout(() => {
                container.insertBefore(el2, el1);
                resolve();
            }, 250);
        });
    });
}

async function selectionSort(delay = 500){
    // let blocks = document.querySelectorAll(".block");

    // // selection sort algorithm
    // for(let i = 0; i < blocks.length - 1; i++){
    //     let minVal = i;
    //     // change min value to red color
    //     blocks[minVal].style.backgroundColor = "#FF4949";
    //     // find min value in unsorted array
    //     for(let j = i + 1; j < blocks.length; j++){
    //         // change currently selected block to yellow
    //         blocks[j].style.backgroundColor = "#e8f013";

    //         // delay .1 seconds
    //         await new Promise((resolve) =>
    //         setTimeout(() => {
    //             resolve();
    //         }, delay)
    //         );

    //         let value1 = Number(blocks[j].childNodes[0].innerHTML);
    //         let value2 = Number(blocks[minVal].childNodes[0].innerHTML);
    //         console.log("value1: ", value1);
    //         console.log("value2: ", value2);
    //         // if lower value, then change color and set minVal variable
    //         if(value1 < value2){
    //             console.log("got here");
    //             blocks[minVal].style.backgroundColor = "#6b5b95";
    //             minVal = j;
    //             blocks[minVal].style.backgroundColor = "#FF4949";
    //         }else{
    //             blocks[j].style.backgroundColor = "#6b5b95";
    //         }
    //     }

    //     console.log("i: ", i, "min: ", minVal);
    //     console.log("swapped: ", Number(blocks[i].childNodes[0].innerHTML), " ", Number(blocks[minVal].childNodes[0].innerHTML));
    //     if(i != minVal){
    //         await swap(blocks[i], blocks[minVal]);
    //         blocks[minVal].style.backgroundColor = "#13CE66";
    //         blocks = document.querySelectorAll(".block");
    //     }
    //     // blocks = document.querySelectorAll(".block");
        
    //     // blocks = document.querySelectorAll(".block");
    // }
    // blocks[blocks.length - 1].style.backgroundColor = "#13CE66";
}

async function bubbleSort(delay = 100){
    let blocks = document.querySelectorAll(".block");
 
    // BubbleSort Algorithm
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks.length - i - 1; j++) {
 
            // To change background-color of the
            // blocks to be compared
            blocks[j].style.backgroundColor = "#FF4949";
            blocks[j + 1].style.backgroundColor = "#FF4949";
 
            // To wait for .1 sec
            await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
            );
 
            let value1 = Number(blocks[j].childNodes[0].innerHTML);
            let value2 = Number(blocks[j + 1].childNodes[0].innerHTML);
 
            // To compare value of two blocks
            if (value1 > value2) {
                await swap(blocks[j], blocks[j + 1]);
                blocks = document.querySelectorAll(".block");
            }
 
            // Changing the color to the previous one
            blocks[j].style.backgroundColor ="#6b5b95";
            blocks[j + 1].style.backgroundColor ="#6b5b95";
        }
 
        //changing the color of greatest element 
        //found in the above traversal
        blocks[blocks.length - i - 1].style.backgroundColor ="#13CE66";
    }
}