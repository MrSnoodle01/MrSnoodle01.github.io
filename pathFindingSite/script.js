var container = document.getElementById("grid");
var grid = []; // [1][0] is down, [0][1] is right

// send user back to home page when clicking home button
document.getElementById('home-button').addEventListener('click', () =>{
    location.href = "../";
})

// TODO: make blocks change color when clicking on them
// TODO: make blocks animate smaller when hovering over them
// TODO: make grid randomized when loading website
// TODO: add a clear grid button

// button to start algorithms
document.getElementById('start-button').addEventListener('click', () =>{
        
})

// creates grid on loading of website
function startFunction(){
    // TODO: fix performance issues with creating grid
    //populate the screen with blocks
    let pos = 0;
    let temp = [];
    let height = Math.floor(document.getElementById("grid").scrollHeight/20);
    let width = Math.floor(document.getElementById("grid").scrollWidth/20);
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            // create div element  
            let grid_ele = document.createElement("div");

            // add class block to div
            grid_ele.classList.add("block");
            
            // move block left/right
            grid_ele.style.transform = `translate(${j*100}%)`;
            grid_ele.style.top = `${pos}px`;

            // append div
            container.append(grid_ele); 

            temp.push(grid_ele);
        }
        pos += 20;
        grid.push(temp);
        temp = [];
    }

    // adds click event listener to all blocks
    let blocks = document.getElementsByClassName('block');
    for(let i = 0; i < blocks.length; i++){
        blocks[i].addEventListener('click', blockFunction, false);
    }

    console.log(grid);

    // sets up initial grid
    grid[height/2][width/4].style.setProperty("background-color", "green");
    grid[height/2][width/4].classList.add("start");

    grid[height/2][width-width/4].style.setProperty("background-color", "red");
    grid[height/2][width-width/4].classList.add("finish");

    for(let i = 0; i < 10; i++){
        grid[height/3+i][width/2].style.setProperty("background-color", "black");
    }
}

// click event listener functin for blocks
function blockFunction(){
    let selected = document.querySelector('input[name="nodeType"]:checked').value;

    console.log(grid);
    let temp = document.getElementsByClassName("start").item(0);
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j] == temp){
                console.log(grid[i][j]);
            }
        }
    }

    // changes color based on which node type is selected
    switch(selected){
        case "start": 
            // remove other start node if there is one
            if(document.getElementsByClassName("start").length == 1){
                let element = document.getElementsByClassName("start").item(0);
                element.classList.remove("start");
                element.style.setProperty("background-color", "white");
            }
            this.style.setProperty("background-color", "green");
            this.classList.add("start");
            break;
        case "wall":
            // remove start or finish class
            this.classList.remove("finish");
            this.classList.remove("start");
            this.style.setProperty("background-color", "black");
            break;
        case "finish":
            // remove other finish class if there is one
            if(document.getElementsByClassName("finish").length == 1){
                let element = document.getElementsByClassName("finish").item(0);
                element.classList.remove("finish");
                element.style.setProperty("background-color", "white");
            }
            this.style.setProperty("background-color", "red");
            this.classList.add("finish");
            break;
        case "empty":
            // remove start or finish class
            this.classList.remove("finish");
            this.classList.remove("start");
            this.style.setProperty("background-color", "white");
            break;
    }
}