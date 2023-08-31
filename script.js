let height, width, mines;
let URLParams = new URLSearchParams(window.location.search);

//work on impossible percentages
height = Number(URLParams.get("param1"));
width = Number(URLParams.get("param2"));
mines = Number(URLParams.get("param3"));

console.log(height, width, mines);

//global
let isInitialized = false;
let arrayOfBoxes = [];

class Box 
{
    static count = 0;
    constructor()
    {
        this.isMine = false;
        this.numberOfSurroundMines = 0;
        this.marked = false;
        this.ID = Box.count++;
    }
}

//functions
function initialize(grid, clickedOn)
{
    let minePos = generateRandomMines(height * width, mines, clickedOn);
    for (let i = 0; i < grid.length; ++i)
    {
        if (minePos.indexOf(grid[i].box.ID) != -1)
        {
            grid[i].box.isMine = true;
        }
    }

    numberEachBox(grid);
}

function numberEachBox(grid)
{
    //go around each box, check the 8 surroundings, use an outofbounds check, it should probably return undefined
    
}

function generateRandomMines(total, numberOfMines, clickedOn)
{
    let illegalSpace = generateSafety(clickedOn);
    let array = [];
    let count = 0;
    while (count < numberOfMines)
    {
        let x = Math.floor(Math.random() * total);
        if(illegalSpace.indexOf(x) == -1 && array.indexOf(x) == -1)
        {
            array.push(x);
            count++;
        }
    }

    return array.length == numberOfMines ? array : console.log("error in generateRand0mMines()");
}

function generateSafety(clickedOn)
{
    let array = [];
    array.push(clickedOn);
    if ((clickedOn % width) != 0) array.push(clickedOn - 1);
    if (((clickedOn + 1) % width != 0)) array.push(clickedOn + 1);
    if (clickedOn - width >= 0)
    {
        array.push(clickedOn - width);
        if (((clickedOn - width) % width) != 0) array.push(clickedOn - width - 1);
        if (((clickedOn - width + 1) % width != 0)) array.push(clickedOn - width + 1);
    }
    if (clickedOn + width < (width * height))
    {
        array.push(clickedOn + width);
        if (((clickedOn + width) % width) != 0) array.push(clickedOn + width - 1);
        if (((clickedOn + width + 1) % width != 0)) array.push(clickedOn + width + 1);
    }
    return array;
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
        console.log(singleBox.box.ID);
        arrayOfBoxes.push(singleBox);
    }
    grid.appendChild(boxRow);
}



/*
NOTES

either you calculate the number in the boxes when you are initializing or you calculate it per click. (i think ill go with the in initialise option)
*/