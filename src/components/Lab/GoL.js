const canvas = document.getElementById('gameOfLife');
const gameOfLife = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class button {
    constructor(pos, size, handleCLick) {
        this.pos = pos;
        this.x = pos[0];
        this.y = pos[1];
        this.size = size;
        this.width = size[0];
        this.height = size[1];
        this.handleCLick = handleCLick;
    }
    
    onClick () {
        if ((this.x < mousePos[0] && mousePos[0] < (this.x + this.width)) && (this.y < mousePos[1] && mousePos[1] < (this.y + this.height)) && isMouseDown && !clicked){
            clicked = true;
            this.handleCLick()
        }
    }
}

let root = {
    bgColor: "#000000",
    cellSize: 5,
    cellColor: "#FFFFFF",
    gameSpeed: 10,
    showUi: true,
    buttonColor: "#FFFFFF"
}

let gameWidth = Math.ceil(canvas.width/root.cellSize)
let gameHeight = Math.ceil(canvas.height/root.cellSize)
let gameMode = 1;

let grid = []
for (let i=0; i<=gameWidth; i++) {
    grid.push([])
    for (let n=0; n<=gameHeight; n++) {
        grid[i].push(Math.round(Math.random()*5) ? 0 : 1)
    }
}

let paused = false
let mousePos = [0, 0]
let mouseGridPos = [0, 0]
let isMouseDown = false;
let clicked = true;


function count_neighbour (grid, cellPos) {
    result = 0
    for (let i=-1; i<2; i++) {
        for (let n=-1; n<2; n++) {
            if ((i || n) && (grid.length > cellPos[0]+i && cellPos[0]+i > -1)) {
                if (grid[cellPos[0]+i][cellPos[1]+n]) {
                    result++
                }
            }
        }
    }
    return result
}

function update_game (grid) {
    returned = []
    grid.map((line, i) => {
        returned.push([]);
        line.map((cell, n) => {
            nbNeighbour = count_neighbour(grid, [i, n]);
            if (cell) { // si la cellule est vivante
                if (nbNeighbour === 2 || nbNeighbour === 3) {
                    returned[i].push(1);
                } else {
                    returned[i].push(0);
                }
            } else {
                if (nbNeighbour === 3) {
                    returned[i].push(1);
                } else {
                    returned[i].push(0);
                }
            }
        });
    });
    return returned;
}

function clear_grid (grid) {
    result = []
    for (let i=0; i<grid.length; i++) {
        result.push([]);
        for (let n=0; n<grid[0].length; n++) {
            result[i].push(0);
        }
    }
    return result;
}

function display_grid (grid) {
    grid.map((line, i) => {
        line.map((cell, n) => {
            if (cell) {
                gameOfLife.fillRect(i*root.cellSize, n*root.cellSize, root.cellSize, root.cellSize);
            }
        });
    });
}

function display_ui (inputs) {
    gameOfLife.lineWidth = 5;
    setColor(root.buttonColor, root.buttonColor);
    inputs.map((input) => {
        gameOfLife.strokeRect(input.x, input.y, input.width, input.height);
        input.onClick();
    })
}

function resize_grid (grid) {
    gameWidth = Math.ceil(canvas.width/root.cellSize)
    gameHeight = Math.ceil(canvas.height/root.cellSize)
    for (i = 0; i<=gameHeight; i++) {
        if (gameHeight>grid.length()) {
            grid.push([])
            for (n=0; n<=gameWidth; n++) {
                grid[i].push(0)
            }
        } else {
            for (n=0; n<=gameWidth; n++) {
                if (gameWidth>grid[i].length()) {
                    grid[i].push(0)
                }
            }
        }
    }
}

function setColor(fill, stroke=fill) {
    gameOfLife.fillStyle = fill;
    gameOfLife.strokeStyle = stroke;
}

canvas.addEventListener("mousedown", (event) => {
    isMouseDown = true;
});

canvas.addEventListener('mouseup', function(event) {
    isMouseDown = false;
    clicked = false;
});

canvas.addEventListener("mousemove", function(event) {
    mousePos = [event.offsetX, event.offsetY];
    mouseGridPos = [Math.floor(mousePos[0]/root.cellSize), Math.floor(mousePos[1]/root.cellSize)];
});

const inputs = [
    new button([100, canvas.height - 150], [50, 50], () => {paused = !paused}),
    new button([180, canvas.height - 150], [50, 50], () => {
        setColor(root.bgColor);
        gameOfLife.fillRect(0, 0, canvas.width, canvas.height);
        grid = update_game(grid)
        generation++
        setColor(root.cellColor);
        display_grid(grid);
    }),
    new button([260, canvas.height - 150], [50, 50], () => {grid = clear_grid(grid)}),
]

let lastCellSize = root.cellSize
let generation = 0
let iteration = 0
function draw() {
    iteration++
    iteration %= root.gameSpeed
    if (root.cellSize < lastCellSize) {
        resize_grid(grid)
    }
    
    setColor(root.bgColor);
    gameOfLife.fillRect(0, 0, canvas.width, canvas.height);
    if (!isMouseDown && !paused && !iteration) {
        grid = update_game(grid)
        generation++
    }
    if (isMouseDown) {
        grid[mouseGridPos[0]][mouseGridPos[1]] = 1;
    } else {
        setColor("#888888");
        gameOfLife.fillRect(mouseGridPos[0]*root.cellSize, mouseGridPos[1]*root.cellSize, root.cellSize, root.cellSize)
    }
    setColor(root.cellColor);
    display_grid(grid);
    if (root.showUi) {
        display_ui(inputs);
    }
}

setInterval((draw), 1); // loop of the game

window.onresize=()=>{ // reload the file if the size of the screen change
    location.reload()
}
