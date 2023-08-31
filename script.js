let height, width, mines;
let URLParams = new URLSearchParams(window.location.search);
height = URLParams.get("param1");
width = URLParams.get("param2");
mines = URLParams.get("param3");

console.log(height, width, mines);

//global
let isInitialized = false;

class Box 
{
    constructor()
    {
        this.isMine = false;
        this.numberOfSurroundMines = 0;
        this.marked = false;
    }
}


let grid = document.querySelector(".grid");
for (let x = 0; x < height; ++x)
{
    let boxRow = document.createElement("div");
    for(let y = 0; y < width; ++y)
    {
        let singleBox = document.createElement("div");
        singleBox.classList.add("single-box");
        singleBox.style.width = "100px";
        singleBox.style.height = "100px";
        singleBox.box = new Box;
        boxRow.appendChild(singleBox);
    }
    grid.appendChild(boxRow);
}