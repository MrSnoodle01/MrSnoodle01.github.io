const MAX = 50;

// send user back to home page when clicking home button
document.getElementById('home-button').addEventListener('click', () =>{
    location.href = "../";
})

// when user clicks submit button begin the sorting process
document.getElementById('submit').addEventListener('click', () =>{
    let numItems = document.getElementById("num-items").value;

    // fill array with random values
    let numArray = []
    for(let i = 0; i < numItems; i++){
        numArray.push(Math.floor(Math.random()*MAX));
        console.log(numArray[i]);
    }
})
