// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define grid dimensions and cell size
const rows = 30;
const cols = 30;
const cellSize = 10;

// Set canvas size
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Initialize grid and control state
let grid = createEmptyGrid(rows, cols);
let running = false;
let isMouseDown = false;
let speed = document.getElementById("speedSlider").value;
let lastTime = 0;

// Event listener for speed control
const speedSlider = document.getElementById("speedSlider");
speedSlider.addEventListener("input", () => {
    setSpeed(speedSlider.value);
    speedDisplay.textContent = `${1050-speedSlider.value} ms`;
});

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  paintCell(e);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

canvas.addEventListener("mouseleave", () => {
  isMouseDown = false; // stop painting if mouse leaves canvas
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    paintCell(e);
  }
});

function paintCell(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientY - rect.top) / cellSize); // row
    const y = Math.floor((e.clientX - rect.left) / cellSize); // col
    if (x >= 0 && x < rows && y >= 0 && y < cols) {
        grid[x][y] = grid[x][y] ? 0 : 1; // toggle cell state
        drawGrid(grid);
    }
}

// --- Grid Functions ---

function createEmptyGrid(rows, cols) {
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = new Array(cols).fill(0);
        grid.push(row);
    }
    return grid;
}

function createRandomGrid(rows, cols, aliveProb = 0.3) {
    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(Math.random() < aliveProb ? 1 : 0);
        }
        grid.push(row);
    }
    return grid;
}

function resetGrid() {
    grid = createEmptyGrid(rows, cols);
    drawGrid(grid);
}

function randomizeGrid() {
    grid = createRandomGrid(rows, cols);
    drawGrid(grid);
}

function countAliveNeighbors(grid, x, y) {
    let numAlive = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // skip the cell itself
            const neighbor_X = (x + i + rows) % rows; // wraparound logic
            const neighbor_Y = (y + j + cols) % cols; // wraparound logic
            numAlive += grid[neighbor_X][neighbor_Y];
        }
    }
    return numAlive;
}

function updateGrid(grid) {
    const nextGrid = createEmptyGrid(rows, cols);
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const alive_neighbors = countAliveNeighbors(grid, x, y);
            if (grid[x][y] === 0) {
                nextGrid[x][y] = (alive_neighbors === 3) ? 1 : 0; // reproduction
            } else {
                nextGrid[x][y] = (alive_neighbors < 2 || alive_neighbors > 3) ? 0 : 1;
                // if (alive_neighbors < 2 || alive_neighbors > 3) {
                //     nextGrid[x][y] = 0; // cell dies due to underpopulation or overpopulation
                // } else {
                //     nextGrid[x][y] = 1; // cell stays alive
                // }
            }
        }
    }
    return nextGrid;
}

// --- Drawing ---

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.fillStyle = grid[i][j] ? "black" : "white";
            ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        }
    }
}

// --- Simulation Loop ---
function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;

    if (running && deltaTime > speed) {
        grid = updateGrid(grid);
        lastTime = timestamp; // reset lastTime to current timestamp
    }

    drawGrid(grid);
    requestAnimationFrame(loop);
}

// --- Controls ---

function toggleRunning() {
    running = !running;
}

function step() {
    if (!running) {
        grid = updateGrid(grid);
        drawGrid(grid);
    }
}

function setSpeed(newSpeed) {
    speed = 1000 - parseInt(newSpeed, 10);
}

// --- Start the simulation ---
drawGrid(grid);
loop();
