const MAX = 50;
var delay = 0;
var myArr = [];
var blocks;
var container = document.getElementById("array");

// checks if custom input has been chosen
document.getElementById("customInput").oninput = function(){
    if(customInput.checked){
        document.getElementById("custom").style.display = "block";
    }else{
        document.getElementById("custom").style.display = "none";
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

    // get custom numbers if selected
    if(document.getElementById("customInput").checked){
        if(!customArray())
            return;
    }else{
        // generate random array and cooresponding divs
        generateArray(numItems);
    }

    // disables button so that graphs cant overlap
    document.getElementById('submit').disabled = true;

    // make bar widths a percentage instead of number of pixels
    let item = document.querySelector(':root');
    item.style.setProperty('--width', 100/numItems + '%');

    blocks = document.querySelectorAll(".block");

    // get which algorithm is chosen by user
    let el = document.getElementById('options');
    algoPick(el);
})

// creates and error checks custom arrays
function customArray(){
    myArr = document.getElementById("numberInput").value.split(',');
    numItems = myArr.length;
    // bound checks
    if(numItems <= 1){
        alert("Please enter at least 2 numbers");
        return false;;
    }
    if(numItems > 100){
        alert("Please enter 100 or less items");
        return false;;
    }
    for(let i = 0; i < myArr.length; i++){
        // bound check
        if(myArr[i] > 50 || myArr[i] < 1){
            alert("A number that you have entered is greater than 100 or less than 1. Please try again");
            return false;
        }
        if(!/^[0-9]*$/.test(myArr[i])){
            alert("You have entered a non-number. Please try again");
            return false;
        }

        let value = Number(myArr[i]);

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
    return true;
}

// picks algorithm from user
// important to use await so button stays disabled
async function algoPick(el){
    switch(el.options[el.selectedIndex].innerHTML){
        case 'Selection Sort':
            console.log("selection sort");
            await selectionSort();
            break;
        case 'Bubble Sort':
            console.log("bubble sort");
            await bubbleSort();
            break;
        case 'Insertion Sort':
            console.log("insertion sort");
            await insertionSort();
            break;
        case 'Merge Sort':
            console.log("merge sort");
            await mergeSort(blocks, 0, blocks.length - 1);
            break;
        case 'Quick Sort':
            console.log("quick sort");
            delay *= 2;
            await quickSort(blocks, 0, blocks.length - 1);
            break;
        case 'Heap Sort':
            console.log("heap sort");
            await heapSort(blocks);
            break;
        default:
            break;
    }
    document.getElementById('submit').disabled = false;
}

// generate array of blocks
function generateArray(numItems){
    // let tempArray = [4,10,3,5,1];
    for(let i = 0; i < numItems; i++){
        // get value between 1 and MAX
        let value = Math.ceil(Math.random() * MAX);
        // let value = tempArray[i];
        myArr[i] = value;

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

function getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for(let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random()*16)];
    }
    return color;
}

// selection sort function
async function selectionSort(){
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

            await swap(blocks, minVal, i);

            blocks[minVal].style.backgroundColor = "#6b5b95";
        }
        blocks[i].style.backgroundColor = "#13CE66";
    }
    blocks[blocks.length - 1].style.backgroundColor = "#13CE66";
}

// bubble sort function
async function bubbleSort(){
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
                await swap(blocks, j, j+1);
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
        if(j >= 0 && j < blocks.length){
            if(Number(blocks[j].childNodes[0].innerHTML) < key){
            await new Promise((resolve) =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );
            blocks[j].style.backgroundColor = "#13CE66";
            }
        }
    }
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, delay)
    );
    blocks[blocks.length-1].style.backgroundColor = "#13CE66";
}

// merge sort function
// l = left index of sub-array
// r = right index of sub-array
async function mergeSort(blocks, l, r){
    if(l >= r){
        return;
    }

    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, delay)
    );

    let m = l + parseInt((r-l)/2);
    await mergeSort(myArr, l, m);
    await mergeSort(myArr, m+1, r);
    await merge(myArr, l, m, r);
}   

// merges two sub-arrays
// first sub-array = blocks[l..m]
// second sub-array = blocks[m+1..r]
async function merge(myArr, l, m, r){
    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, delay)
    );

    let n1 = m - l + 1;
    let n2 = r - m;

    // creates temp arrays
    let L = new Array(n1);
    let R = new Array(n2);

    // populate temp arrays
    for(let i = 0; i < n1; i++){
        L[i] = myArr[l + i];
    }
    for(let j = 0; j < n2; j++){
        R[j] = myArr[m + 1 + j];
    }

    // initial indexes of subarrays
    let i = 0;
    let j = 0; 
    let k = l;

    while(i < n1 && j < n2){
        if(L[i] <= R[j]){
            myArr[k] = L[i];
            i++;
        }else{
            myArr[k] = R[j];
            j++;
        }
        k++;
    }

    // copy remaining elements of L
    while(i < n1){
        myArr[k] = L[i];
        i++;
        k++;
    }

    // copy remaining elements of R
    while(j < n2){
        myArr[k] = R[j];
        j++;
        k++;
    }

    // change colors to random if not done, or green if done
    if(k == document.getElementById("num-items").value){
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
        );
        for(let i = l; i < k; i++){
            blocks[i].innerHTML = `<label class='block_id'>${myArr[i]}</label>`;
            blocks[i].style.height = `${myArr[i] * 2}%`;
            blocks[i].style.backgroundColor = "#13CE66";
        } 
    }else{
        let color = getRandomColor();
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve();
            }, delay)
        );
        for(let i = l; i < k; i++){
            blocks[i].innerHTML = `<label class='block_id'>${myArr[i]}</label>`;
            blocks[i].style.height = `${myArr[i] * 2}%`;
            blocks[i].style.backgroundColor = color;
        } 
    }
}

// quick sort function
async function quickSort(blocks, low, high){
    if(low < high){
        // partition index
        let pi = await partition(blocks, low, high);

        // sepeartely sort elements before & after pivot
        await quickSort(blocks, low, pi - 1);
        blocks[low].style.backgroundColor = "#13CE66";
        await quickSort(blocks, pi + 1, high);
        blocks[high].style.backgroundColor = "#13CE66";
    }
}

// partition function for quick sort
// returns partition index
async function partition(blocks, low, high){
    let pivot = Number(blocks[high].childNodes[0].innerText);
    blocks[high].style.backgroundColor = "#e88e17";

    let i = low - 1;

    for(let j = low; j <= high - 1; j++){
        // if current element < pivot
        if(Number(blocks[j].childNodes[0].innerText) < pivot){
            i++;
            await swap(blocks, i, j);
        }
    }

    // swap pivot
    await swap(blocks, i + 1, high);
    blocks[i + 1].style.backgroundColor = "#13CE66"
    return i + 1;
}

// heap sort function
async function heapSort(blocks){
    // rearrange array to build heap
    for(let i = Math.floor(blocks.length/2) - 1; i >= 0; i--){
        await heapify(blocks, blocks.length, i);
    }

    // extract each element from heap
    for(let i = blocks.length - 1; i > 0; i--){
        // move current root to end
        await swap(blocks, 0, i);
        blocks[i].style.backgroundColor = "#13CE66";
        await heapify(blocks, i, 0);
    }
    blocks[0].style.backgroundColor = "#13CE66";
}

// heapify a subtree with i root and N size
async function heapify(blocks, N, i){
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    await new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, delay)
    )

    // if left child is greater than root
    if(l < N && Number(blocks[l].childNodes[0].innerText) > Number(blocks[largest].childNodes[0].innerText)){
        largest = l;
    }

    // if right child is greater than root
    if(r < N && Number(blocks[r].childNodes[0].innerText) > Number(blocks[largest].childNodes[0].innerText)){
        largest = r;
    }

    // if largest is not the root
    if(largest != i){
        await swap(blocks, i, largest);
        await heapify(blocks, N, largest);
    }
}