var container = document.getElementById("grid");

// send user back to home page when clicking home button
document.getElementById('home-button').addEventListener('click', () =>{
    location.href = "../";
})

//TODO: make blocks change color when clicking on them
//TODO: make blocks animate smaller when hovering over them

// create grid
document.getElementById('start-button').addEventListener('click', () =>{
    
})

// creates grid on loading of website
function startFunction(){
    // TODO: fix performance issues with creating grid
    //populate the screen with blocks
    let pos = 0;
    for(let i = 0; i < Math.floor(document.getElementById("grid").scrollHeight/20); i++){
        for(let j = 0; j < Math.floor(document.getElementById("grid").scrollWidth/20); j++){
            // create div element  
            let grid_ele = document.createElement("div");

            // add class block to div
            grid_ele.classList.add("block");
            
            // move block left/right
            grid_ele.style.transform = `translate(${j*100}%)`;
            grid_ele.style.top = `${pos}px`;

            // append div
            container.append(grid_ele); 
        }
        pos += 20;
    }
    // adds click event listener to all blocks
    let blocks = document.getElementsByClassName('block');
    for(let i = 0; i < blocks.length; i++){
        blocks[i].addEventListener('click', blockFunction, false);
    }
}

// click event listener functin for blocks
function blockFunction(){
    let selector = document.getElementById("options");
    let color = selector.options[selector.selectedIndex].innerHTML;
    // changes color based on which node type is selected
    switch(color){
        case "Start": 
            // remove other start node if there is one
            if(document.getElementsByClassName("start").length == 1){
                // remove start class and make it white
            }
            this.style.setProperty("background-color", "green");
            this.classList.add("start");
            break;
        case "Wall":
            this.style.setProperty("background-color", "black");
            break;
        case "Finish":
            // remove other finish class if there is one
            if(document.getElementsByClassName("finish").length == 1){
                // remove finish class andmake it white
            }
            this.style.setProperty("background-color", "red");
            this.classList.add("finish");
            break;
        case "Empty":
            this.style.setProperty("background-color", "white");
            break;
    }
}