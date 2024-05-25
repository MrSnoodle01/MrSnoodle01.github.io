const MAX = 50;
var delay = 0;
var container = document.getElementById("array");

// gets the value of the speed slider
document.getElementById("speedSlider").oninput = function(){
    delay = document.getElementById("speedSlider").value;
    // fast is to right, slow is to left 
    delay = (delay - 250) * (-1);
    console.log(delay);
}

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

    // gets delay value in case that user didnt touch the slider
    delay = document.getElementById("speedSlider").value;
    // fast is to right, slow is to left
    delay = (delay - 250) * (-1);

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
        case 'Insertion Sort':
            console.log("insertion sort");
            insertionSort();
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

// swaps two block that are right next to eachother
// function swap(el1, el2){
    // return new Promise((resolve) => {
    //     // for exchanging styles of two blocks
    //     let temp = el1.style.transform;
    //     el1.style.transform = el2.style.transform;
    //     el2.style.transform = temp;

    //     window.requestAnimationFrame(function (){
    //         // wait .25 seconds
    //         setTimeout(() => {
    //             container.insertBefore(el2, el1);
    //             resolve();
    //         }, 250);
    //     });
    // });
// }

// selection sort function
async function selectionSort(){
    let blocks = document.querySelectorAll(".block");

    // selection sort algorithm
    for(let i = 0; i < blocks.length - 1; i++){
        let minVal = i;
        // change min value to red color
        blocks[minVal].style.backgroundColor = "#FF4949";
        // find min value in unsorted array
        for(let j = i + 1; j < blocks.length; j++){
            // change currently selected block to yellow
            blocks[j].style.backgroundColor = "#e8f013";

            // wait for delay
            await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
            );

            let value1 = Number(blocks[j].childNodes[0].innerHTML);
            let value2 = Number(blocks[minVal].childNodes[0].innerHTML);
            // if lower value, then change color and set minVal variable
            if(value1 < value2){
                blocks[minVal].style.backgroundColor = "#6b5b95";
                minVal = j;
                blocks[minVal].style.backgroundColor = "#FF4949";
            }else{
                blocks[j].style.backgroundColor = "#6b5b95";
            }
        }

        // swap smallest block to i
        if(i != minVal){
            // wait .2 seconds
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );

            let temp1 = blocks[minVal].childNodes[0].innerHTML;
            let temp2 = blocks[minVal].style.height;

            blocks[minVal].childNodes[0].innerHTML = blocks[i].childNodes[0].innerHTML;
            blocks[minVal].style.height = blocks[i].style.height;

            blocks[i].childNodes[0].innerHTML = temp1;
            blocks[i].style.height = temp2;

            blocks[minVal].style.backgroundColor = "#6b5b95";
        }
        blocks[i].style.backgroundColor = "#13CE66";
    }
    blocks[blocks.length - 1].style.backgroundColor = "#13CE66";
}

// bubble sort function
async function bubbleSort(){
    let blocks = document.querySelectorAll(".block");
 
    // BubbleSort Algorithm
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks.length - i - 1; j++) {
 
            // To change background-color of the
            // blocks to be compared
            blocks[j].style.backgroundColor = "#FF4949";
            blocks[j + 1].style.backgroundColor = "#FF4949";
 
            // To wait for delay
            await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
            );
 
            let value1 = Number(blocks[j].childNodes[0].innerHTML);
            let value2 = Number(blocks[j + 1].childNodes[0].innerHTML);
 
            // To compare value of two blocks
            if (value1 > value2) {
                // await swap(blocks[j], blocks[j + 1]);
                await swap(blocks, j, j+1);
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

// insertion sort function
async function insertionSort(){
    let blocks = document.querySelectorAll(".block");

    // iterate through each element in array
    for(let i = 1; i < blocks.length; i++){
        let key = Number(blocks[i].childNodes[0].innerHTML);
        let j = i - 1;

        // move elements of blocks[0..i-1] greater than the key one to left
        while(j >= 0 && Number(blocks[j].childNodes[0].innerHTML) > key){
            // item currently being sorted turns red
            blocks[j+1].style.backgroundColor = "#FF4949";
            // To wait for delay
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
                );
            await swap(blocks, j+1, j);
            // turns partially sorted array green
            blocks[j].style.backgroundColor = "#13CE66"
            blocks[j+1].style.backgroundColor = "#13CE66"
            j--;
        }
        blocks[j + 1] = key;
    }
}