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
        this.solved = false;
        this.solvedSurround = false;
        this.ID = Box.count++;
    }
}

//functions
function initialize(grid, clickedOn)
{
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

function whenLeftClicked()
{
    if (!isInitialized) initialize(arrayOfBoxes, this.box.ID);
    if (this.box.solved) return solveForSolved(this.box.ID);
    if (this.box.isMine) return clickedMine();
    
    if (this.box.numberOfSurroundMines)
    {
        this.textContent = String(this.box.numberOfSurroundMines);
    }
    else
    {
        solveSurrounding(this.box.ID);
    }
    this.box.solved = true;
    this.classList.add("solved");
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
        if (arrayOfBoxes[id + 1] && !arrayOfBoxes[id + 1].box.isMine)
        {
            arrayOfBoxes[id + 1].box.solved = true;
            arrayOfBoxes[id + 1].classList.add("solved");
            if (arrayOfBoxes[id + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + 1);
            else arrayOfBoxes[id + 1].textContent = String(arrayOfBoxes[id + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width + 1] && !arrayOfBoxes[id - width + 1].box.isMine)
        {
            arrayOfBoxes[id - width + 1].box.solved = true;
            arrayOfBoxes[id - width + 1].classList.add("solved");
            if (arrayOfBoxes[id - width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width + 1);
            else arrayOfBoxes[id - width + 1].textContent = String(arrayOfBoxes[id - width + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width + 1] && !arrayOfBoxes[id + width + 1].box.isMine)
        {
            arrayOfBoxes[id + width + 1].box.solved = true;
            arrayOfBoxes[id + width + 1].classList.add("solved");
            if (arrayOfBoxes[id + width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width + 1);
            else arrayOfBoxes[id + width + 1].textContent = String(arrayOfBoxes[id + width + 1].box.numberOfSurroundMines);
        }

    }

    if (id % width != 0) 
    {
        if (arrayOfBoxes[id - 1] && !arrayOfBoxes[id - 1].box.isMine )
        {
            arrayOfBoxes[id - 1].box.solved = true;
            arrayOfBoxes[id - 1].classList.add("solved");
            if (arrayOfBoxes[id - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - 1);
            else arrayOfBoxes[id - 1].textContent = String(arrayOfBoxes[id - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width - 1] && !arrayOfBoxes[id - width - 1].box.isMine)
        {
            arrayOfBoxes[id - width - 1].box.solved = true;
            arrayOfBoxes[id - width - 1].classList.add("solved");
            if (arrayOfBoxes[id - width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width - 1);
            else arrayOfBoxes[id - width - 1].textContent = String(arrayOfBoxes[id - width - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width - 1] && !arrayOfBoxes[id + width - 1].box.isMine)
        {
            arrayOfBoxes[id + width - 1].box.solved = true;
            arrayOfBoxes[id + width - 1].classList.add("solved");
            if (arrayOfBoxes[id + width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width - 1);
            else arrayOfBoxes[id + width - 1].textContent = String(arrayOfBoxes[id + width - 1].box.numberOfSurroundMines);
        }
        
    }
    
    if (arrayOfBoxes[id - width] && !arrayOfBoxes[id - width].box.isMine)
    {
        arrayOfBoxes[id - width].box.solved = true;
        arrayOfBoxes[id - width].classList.add("solved");
        if (arrayOfBoxes[id - width].box.numberOfSurroundMines == 0) solveSurrounding(id - width);
        else arrayOfBoxes[id - width].textContent = String(arrayOfBoxes[id - width].box.numberOfSurroundMines);
    }
        
    if (arrayOfBoxes[id + width] && !arrayOfBoxes[id + width].box.isMine)
    {
        arrayOfBoxes[id + width].box.solved = true;
        arrayOfBoxes[id + width].classList.add("solved");
        if (arrayOfBoxes[id + width].box.numberOfSurroundMines == 0) solveSurrounding(id + width);
        else arrayOfBoxes[id + width].textContent = String(arrayOfBoxes[id + width].box.numberOfSurroundMines);
    }

    


}

function solveSurrounding(id)
{
    console.log("lets go", id);
    if(arrayOfBoxes[id].box.solvedSurround) return;
    arrayOfBoxes[id].box.solvedSurround = true;

    if ((id + 1) % width != 0)
    {
        if (arrayOfBoxes[id + 1])
        {
            arrayOfBoxes[id + 1].box.solved = true;
            arrayOfBoxes[id + 1].classList.add("solved");
            if (arrayOfBoxes[id + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + 1);
            else arrayOfBoxes[id + 1].textContent = String(arrayOfBoxes[id + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width + 1])
        {
            arrayOfBoxes[id - width + 1].box.solved = true;
            arrayOfBoxes[id - width + 1].classList.add("solved");
            if (arrayOfBoxes[id - width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width + 1);
            else arrayOfBoxes[id - width + 1].textContent = String(arrayOfBoxes[id - width + 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width + 1])
        {
            arrayOfBoxes[id + width + 1].box.solved = true;
            arrayOfBoxes[id + width + 1].classList.add("solved");
            if (arrayOfBoxes[id + width + 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width + 1);
            else arrayOfBoxes[id + width + 1].textContent = String(arrayOfBoxes[id + width + 1].box.numberOfSurroundMines);
        }

    }

    if (id % width != 0) 
    {
        if (arrayOfBoxes[id - 1])
        {
            arrayOfBoxes[id - 1].box.solved = true;
            arrayOfBoxes[id - 1].classList.add("solved");
            if (arrayOfBoxes[id - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - 1);
            else arrayOfBoxes[id - 1].textContent = String(arrayOfBoxes[id - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id - width - 1])
        {
            arrayOfBoxes[id - width - 1].box.solved = true;
            arrayOfBoxes[id - width - 1].classList.add("solved");
            if (arrayOfBoxes[id - width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id - width - 1);
            else arrayOfBoxes[id - width - 1].textContent = String(arrayOfBoxes[id - width - 1].box.numberOfSurroundMines);
        }
        if (arrayOfBoxes[id + width - 1])
        {
            arrayOfBoxes[id + width - 1].box.solved = true;
            arrayOfBoxes[id + width - 1].classList.add("solved");
            if (arrayOfBoxes[id + width - 1].box.numberOfSurroundMines == 0) solveSurrounding(id + width - 1);
            else arrayOfBoxes[id + width - 1].textContent = String(arrayOfBoxes[id + width - 1].box.numberOfSurroundMines);
        }
        
    }
    
    if (arrayOfBoxes[id - width])
    {
        arrayOfBoxes[id - width].box.solved = true;
        arrayOfBoxes[id - width].classList.add("solved");
        if (arrayOfBoxes[id - width].box.numberOfSurroundMines == 0) solveSurrounding(id - width);
        else arrayOfBoxes[id - width].textContent = String(arrayOfBoxes[id - width].box.numberOfSurroundMines);
    }
        
    if (arrayOfBoxes[id + width])
    {
        arrayOfBoxes[id + width].box.solved = true;
        arrayOfBoxes[id + width].classList.add("solved");
        if (arrayOfBoxes[id + width].box.numberOfSurroundMines == 0) solveSurrounding(id + width);
        else arrayOfBoxes[id + width].textContent = String(arrayOfBoxes[id + width].box.numberOfSurroundMines);
    }
}

function clickedMine()
{

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
        singleBox.style.width = "100px";
        singleBox.style.height = "100px";
        singleBox.box = new Box;
        
        singleBox.addEventListener("click", whenLeftClicked);
        singleBox.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            if (singleBox.box.solved) return;
            if (singleBox.box.marked)
            {
                singleBox.box.marked = false;
                singleBox.classList.remove("marked");
            }
            else
            {
                singleBox.classList.add("marked");
                singleBox.box.marked = true;
            }
        });

        boxRow.appendChild(singleBox);
        arrayOfBoxes.push(singleBox);
    }
    grid.appendChild(boxRow);
}


/*
NOTES

either you calculate the number in the boxes when you are initializing or you calculate it per click. (i think ill go with the in initialise option) ******done********

write functionality for 0 boxes to solve their surroundings *****done******

test solveForSolved

add coloring to the solved boxes

*/