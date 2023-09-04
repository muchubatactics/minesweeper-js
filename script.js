/*

muchubatactics 4/09/23
~I also am other than what I imagine myself to be, to know this is forgiveness.


*/

let height, width, mines;
let URLParams = new URLSearchParams(window.location.search);

height = Number(URLParams.get("param1"));
width = Number(URLParams.get("param2"));
mines = Number(URLParams.get("param3"));

//global
let isInitialized = false;
let arrayOfBoxes = [];
let timer, startTime = 0, isVisible = true;
let markedMineCount = 0;
let boxDimensions;

class Box 
{
    static count = 0;
    constructor()
    {
        this.isMine = false;
        this.numberOfSurroundMines = 0;
        this.marked = false;
        this.solved = false;
        this.solvedSurround = false;
        this.ID = Box.count++;
    }
}

//functions
function runTimer()
{
    setInterval(() => {
        if (isVisible)
        {
            startTime++;
            timer.textContent = formatTime(startTime);
        }
    }, 1000);
}

function formatTime(seconds)
{
    let str;
    let x = Math.floor(seconds / 60);
    let y = seconds - (x * 60);
    // console.log(x, y);

    if (x < 10) str = `0${x}:`;
    else str = `${x}:`;
    if (y < 10) str += `0${y}`;
    else str += `${y}`;
    return str;
}

function initialize(grid, clickedOn)
{
    runTimer();

    markedMineCount = 0;
    minesSoFar.textContent = `${markedMineCount}/${mines}`;

    let minePos = generateRandomMines(height * width, mines, clickedOn);
    for (let i = 0; i < grid.length; ++i)
    {
        grid[i].box.marked = false;
        grid[i].classList.remove("marked");
        if (minePos.indexOf(grid[i].box.ID) != -1)
        {
            grid[i].box.isMine = true;
        }
    }

    numberEachBox(grid);
    isInitialized = true;
}

function numberEachBox(grid)
{
    for (let i = 0; i < grid.length; i++)
    {
        if (grid[i].box.isMine) continue;

        let count = 0;
        if ((grid[i].box.ID + 1) % width != 0)
        {
            if (grid[i + 1])
            {
                if(grid[i + 1].box.isMine) count++;
            }
            if (grid[i - width + 1])
            {
                if(grid[i - width + 1].box.isMine) count++;
            }
            if (grid[i + width + 1])
            {
                if(grid[i + width + 1].box.isMine) count++;
            }

        }

        if (grid[i].box.ID % width != 0) 
        {
            if (grid[i - 1])
            {
                if(grid[i - 1].box.isMine) count++;
            }
            if (grid[i - width - 1])
            {
                if(grid[i - width - 1].box.isMine) count++;
            }
            if (grid[i + width - 1])
            {
                if(grid[i + width - 1].box.isMine) count++;
            }
            
        }
        
        if (grid[i - width])
        {
            if(grid[i - width].box.isMine) count++;
        }
            
        if (grid[i + width])
        {
            if(grid[i + width].box.isMine) count++;
        }   

        grid[i].box.numberOfSurroundMines = count;
    }
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

    return array;
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

function whenLeftClicked()
{
    if (this.box.marked) return;
    if (!isInitialized) initialize(arrayOfBoxes, this.box.ID);
    if (this.box.solved) return solveForSolved(this.box.ID);
    if (this.box.isMine) return clickedMine(this.box.ID);
    
    if (this.box.numberOfSurroundMines)
    {
        this.textContent = String(this.box.numberOfSurroundMines);
    }
    else
    {
        solveSurrounding(this.box.ID);
    }
    solveWithColor(this.box.ID);
    checkWin();
}

function whenRightClicked(event)
{
    event.preventDefault();
    if (this.box.solved) return;
    if (this.box.marked)
    {
        this.box.marked = false;
        this.classList.remove("marked");
        markedMineCount--;
        minesSoFar.textContent = `${markedMineCount}/${mines}`;
    }
    else
    {
        this.classList.add("marked");
        this.box.marked = true;
        markedMineCount++;
        minesSoFar.textContent = `${markedMineCount}/${mines}`;
    }
    checkWin();
}


function numberOfMarkedAround(id)
{
    let x = 0;
    if ((id + 1) % width != 0)
    {
        if (arrayOfBoxes[id + 1] && arrayOfBoxes[id + 1].box.marked) x++;
        if (arrayOfBoxes[id - width + 1] && arrayOfBoxes[id - width + 1].box.marked) x++;
        if (arrayOfBoxes[id + width + 1] && arrayOfBoxes[id + width + 1].box.marked) x++;

    }

    if (id % width != 0) 
    {
        if (arrayOfBoxes[id - 1] && arrayOfBoxes[id - 1].box.marked) x++;
        if (arrayOfBoxes[id - width - 1] && arrayOfBoxes[id - width - 1].box.marked) x++;
        if (arrayOfBoxes[id + width - 1] && arrayOfBoxes[id + width - 1].box.marked) x++;
        
    }
    
    if (arrayOfBoxes[id - width] && arrayOfBoxes[id - width].box.marked) x++;   
    if (arrayOfBoxes[id + width] && arrayOfBoxes[id + width].box.marked) x++;

    return x;
}

function solveForSolved(id)
{
    if(arrayOfBoxes[id].box.solvedSurround) return;
    
    if (arrayOfBoxes[id].box.numberOfSurroundMines == 0) return;
    let basis = numberOfMarkedAround(id);
    if (basis != arrayOfBoxes[id].box.numberOfSurroundMines) return;
    
    arrayOfBoxes[id].box.solvedSurround = true;

    if ((id + 1) % width != 0)
    {
        if (arrayOfBoxes[id + 1] && !arrayOfBoxes[id + 1].box.marked)
        {
            if (arrayOfBoxes[id + 1].box.isMine) return clickedMine(id + 1);
            solveWithColor(id + 1);
            if (arrayOfBoxes[id + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + 1);
            else arrayOfBoxes[id + 1].textContent = String(arrayOfBoxes[id + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width + 1] && !arrayOfBoxes[id - width + 1].box.marked)
        {
            if (arrayOfBoxes[id - width + 1].box.isMine) return clickedMine(id - width + 1);
            solveWithColor(id - width + 1);
            if (arrayOfBoxes[id - width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width + 1);
            else arrayOfBoxes[id - width + 1].textContent = String(arrayOfBoxes[id - width + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width + 1] && !arrayOfBoxes[id + width + 1].box.marked)
        {
            if (arrayOfBoxes[id + width + 1].box.isMine) return clickedMine(id + width + 1);
            solveWithColor(id + width + 1);
            if (arrayOfBoxes[id + width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width + 1);
            else arrayOfBoxes[id + width + 1].textContent = String(arrayOfBoxes[id + width + 1].box.numberOfSurroundMines);
        }

    }

    if (id % width != 0) 
    {
        if (arrayOfBoxes[id - 1] && !arrayOfBoxes[id - 1].box.marked )
        {
            if (arrayOfBoxes[id - 1].box.isMine) return clickedMine(id - 1);
            solveWithColor(id - 1);
            if (arrayOfBoxes[id - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - 1);
            else arrayOfBoxes[id - 1].textContent = String(arrayOfBoxes[id - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width - 1] && !arrayOfBoxes[id - width - 1].box.marked)
        {
            if (arrayOfBoxes[id - width - 1].box.isMine) return clickedMine(id - width - 1);
            solveWithColor(id - width - 1);
            if (arrayOfBoxes[id - width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width - 1);
            else arrayOfBoxes[id - width - 1].textContent = String(arrayOfBoxes[id - width - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width - 1] && !arrayOfBoxes[id + width - 1].box.marked)
        {
            if (arrayOfBoxes[id + width - 1].box.isMine) return clickedMine(id + width - 1);
            solveWithColor(id + width - 1);
            if (arrayOfBoxes[id + width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width - 1);
            else arrayOfBoxes[id + width - 1].textContent = String(arrayOfBoxes[id + width - 1].box.numberOfSurroundMines);
        }
        
    }
    
    if (arrayOfBoxes[id - width] && !arrayOfBoxes[id - width].box.marked)
    {
        if (arrayOfBoxes[id - width].box.isMine) return clickedMine(id - width);
        solveWithColor(id - width);
        if (arrayOfBoxes[id - width].box.numberOfSurroundMines == 0) solveSurrounding(id - width);
        else arrayOfBoxes[id - width].textContent = String(arrayOfBoxes[id - width].box.numberOfSurroundMines);
    }
        
    if (arrayOfBoxes[id + width] && !arrayOfBoxes[id + width].box.marked)
    {
        if (arrayOfBoxes[id + width].box.isMine) return clickedMine(id + width);
        solveWithColor(id + width);
        if (arrayOfBoxes[id + width].box.numberOfSurroundMines == 0) solveSurrounding(id + width);
        else arrayOfBoxes[id + width].textContent = String(arrayOfBoxes[id + width].box.numberOfSurroundMines);
    }

    checkWin();


}

function solveSurrounding(id)
{
    // console.log("lets go", id);
    if(arrayOfBoxes[id].box.solvedSurround) return;
    arrayOfBoxes[id].box.solvedSurround = true;

    if ((id + 1) % width != 0)
    {
        if (arrayOfBoxes[id + 1])
        {
            solveWithColor(id + 1);
            if (arrayOfBoxes[id + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + 1);
            else arrayOfBoxes[id + 1].textContent = String(arrayOfBoxes[id + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width + 1])
        {
            solveWithColor(id - width + 1);
            if (arrayOfBoxes[id - width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width + 1);
            else arrayOfBoxes[id - width + 1].textContent = String(arrayOfBoxes[id - width + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width + 1])
        {
            solveWithColor(id + width + 1);
            if (arrayOfBoxes[id + width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width + 1);
            else arrayOfBoxes[id + width + 1].textContent = String(arrayOfBoxes[id + width + 1].box.numberOfSurroundMines);
        }

    }

    if (id % width != 0) 
    {
        if (arrayOfBoxes[id - 1])
        {
            solveWithColor(id - 1);
            if (arrayOfBoxes[id - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - 1);
            else arrayOfBoxes[id - 1].textContent = String(arrayOfBoxes[id - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width - 1])
        {
            solveWithColor(id - width - 1);
            if (arrayOfBoxes[id - width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width - 1);
            else arrayOfBoxes[id - width - 1].textContent = String(arrayOfBoxes[id - width - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width - 1])
        {
            solveWithColor(id + width - 1);
            if (arrayOfBoxes[id + width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width - 1);
            else arrayOfBoxes[id + width - 1].textContent = String(arrayOfBoxes[id + width - 1].box.numberOfSurroundMines);
        }
        
    }
    
    if (arrayOfBoxes[id - width])
    {
        solveWithColor(id - width);
        if (arrayOfBoxes[id - width].box.numberOfSurroundMines == 0) solveSurrounding(id - width);
        else arrayOfBoxes[id - width].textContent = String(arrayOfBoxes[id - width].box.numberOfSurroundMines);
    }
        
    if (arrayOfBoxes[id + width])
    {
        solveWithColor(id + width);
        if (arrayOfBoxes[id + width].box.numberOfSurroundMines == 0) solveSurrounding(id + width);
        else arrayOfBoxes[id + width].textContent = String(arrayOfBoxes[id + width].box.numberOfSurroundMines);
    }

    checkWin();
}

function clickedMine(id)
{
    isVisible = false;
    arrayOfBoxes[id].classList.add("clicked-mine-this");
    for (let i = 0; i < arrayOfBoxes.length; i++)
    {
        arrayOfBoxes[i].removeEventListener("click", whenLeftClicked);
        arrayOfBoxes[i].removeEventListener("contextmenu", whenRightClicked);
        if (i != id && arrayOfBoxes[i].box.isMine && !arrayOfBoxes[i].box.marked)
        {
            arrayOfBoxes[i].classList.add("clicked-mine");
        }
        if (arrayOfBoxes[i].box.marked && !arrayOfBoxes[i].box.isMine)
        {
            arrayOfBoxes[i].style.backgroundColor = "red";
        } 
    }
}

function solveWithColor(id)
{
    arrayOfBoxes[id].box.solved = true;
    arrayOfBoxes[id].classList.add("solved");

    switch (arrayOfBoxes[id].box.numberOfSurroundMines)
    {
        case 0:
            arrayOfBoxes[id].style.backgroundColor = "rgb(222, 222, 220)";
            break;
        case 1:
            arrayOfBoxes[id].style.backgroundColor = "rgb(221, 250, 195)";
            break;
        case 2:
            arrayOfBoxes[id].style.backgroundColor = "rgb(236, 237, 191)";
            break;
        case 3:
            arrayOfBoxes[id].style.backgroundColor = "rgb(237, 218, 180)";
            break;
        case 4:
            arrayOfBoxes[id].style.backgroundColor = "rgb(237, 195, 138)";
            break;
        case 5:
            arrayOfBoxes[id].style.backgroundColor = "rgb(254, 167, 133)";
            break;
        case 6:
            arrayOfBoxes[id].style.backgroundColor = "rgb(247, 161, 162)";
            break;
        case 7:
            arrayOfBoxes[id].style.backgroundColor = "rgb(163, 33, 33)";
            break;
        case 8:
            arrayOfBoxes[id].style.backgroundColor = "rgb(116, 8, 8)";
            break;
                
    }

    checkWin();
}

function calculateBoxDimensions()
{
    //height 9
    //width 17

    let maxHeight = Math.floor(0.9 * window.innerHeight);
    let maxWidth = Math.floor(0.7 * window.innerWidth);

    let x = Math.floor(maxWidth / (width + 2));
    let y = Math.floor(maxHeight / (height + 2));

    return x < y ? x : y;
}

function pauseResume()
{
    if (isPaused)
    {
        grid.removeChild(pauseDiv);
        pauseButton.textContent = "Pause";
        isPaused = false;
        isVisible = true;
    }
    else
    {
        grid.appendChild(pauseDiv);
        pauseButton.textContent = "Resume";
        isPaused = true;
        isVisible = false;
    }
}

function checkWin()
{
    let marked = 0, markedMines = 0;
    let solved = 0;
    for (let i = 0; i < arrayOfBoxes.length; i++)
    {
        if (arrayOfBoxes[i].box.solved) solved++;
        if (arrayOfBoxes[i].marked)
        {
            if (arrayOfBoxes[i].isMine) markedMines++;
            marked++;
        }
    }
    ///marked all and only the mines
    if (marked == markedMines)
    {
        if (marked == mines) return win();
    }
    //solved everything but mines
    if (solved == (arrayOfBoxes.length - mines)) return win();
}

function win()
{
    isVisible = false;
    pauseButton.removeEventListener("click", pauseResume);
    winDiv.textContent = "Congratulations, you won in " + formatTime(startTime) ;
    grid.appendChild(winDiv);
}

//script
let grid = document.querySelector(".grid");


for (let x = 0; x < height; ++x)
{
    let boxRow = document.createElement("div");
    for(let y = 0; y < width; ++y)
    {
        let singleBox = document.createElement("div");
        singleBox.classList.add("single-box");
        let temp = calculateBoxDimensions();
        singleBox.style.width = String(temp) + "px";
        singleBox.style.height = String(temp) + "px";
        boxDimensions = temp;
        singleBox.box = new Box;

        if (temp < 60) singleBox.style.fontSize = "large";
        if (temp < 40) singleBox.style.fontSize = "medium";
        
        singleBox.addEventListener("click", whenLeftClicked);
        singleBox.addEventListener("contextmenu", whenRightClicked);

        boxRow.appendChild(singleBox);
        arrayOfBoxes.push(singleBox);
    }
    grid.appendChild(boxRow);
}


//pause content
let isPaused = false;
let pauseDiv = document.createElement("div");
pauseDiv.style.height = String((boxDimensions * height) + (height * 2)) + "px";
pauseDiv.style.width = String((boxDimensions * width) + (width * 2)) + "px";
pauseDiv.style.position = "absolute";
pauseDiv.style.zIndex = "1";
pauseDiv.style.backgroundColor = "grey";
pauseDiv.classList.add("paused-div");
pauseDiv.textContent = "Paused";

//win content
let winDiv = document.createElement("div");
winDiv.style.height = String((boxDimensions * height) + (height * 2)) + "px";
winDiv.style.width = String((boxDimensions * width) + (width * 2)) + "px";
winDiv.style.position = "absolute";
winDiv.style.zIndex = "1";
winDiv.classList.add("win-div");


//timer
timer = document.getElementById("timer");

//field to keep track of mines
let minesSoFar = document.getElementById("mines-sofar");
minesSoFar.textContent = `${markedMineCount}/${mines}`;

//buttons and event listeners
let changeButton = document.getElementById("change-button");
changeButton.addEventListener("mouseover", () => {
    changeButton.style.backgroundColor = "rgb(70, 70, 70)";
});
changeButton.addEventListener("mouseout", () => {
    changeButton.style.backgroundColor = "rgb(50, 50, 50)";
});
changeButton.addEventListener("click", () => {
    window.open("./index.html", "_self");
});

let startOverButton = document.getElementById("start-button");
startOverButton.addEventListener("mouseover", () => {
    startOverButton.style.backgroundColor = "rgb(70, 70, 70)";
});
startOverButton.addEventListener("mouseout", () => {
    startOverButton.style.backgroundColor = "rgb(50, 50, 50)";
});
startOverButton.addEventListener("click", () => {
    window.open(`./game.html?param1=${height}&param2=${width}&param3=${mines}`, "_self");
});

let pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("mouseover", () => {
    pauseButton.style.backgroundColor = "rgb(70, 70, 70)";
});
pauseButton.addEventListener("mouseout", () => {
    pauseButton.style.backgroundColor = "rgb(50, 50, 50)";
});
pauseButton.addEventListener("click", pauseResume);

document.addEventListener("visibilitychange", () => {
    if(document.hidden)
    {
        isVisible = false;
        pauseResume();
    }
    else
    {
        isVisible = true;
        pauseResume();
    }
});

/*
NOTES
add pop up windows
*/