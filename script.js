// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define grid dimensions and cell size
const rows = 50;
const cols = 50;
const cellSize = 10;

// Set canvas size
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

// Initialize grid and control state
let grid = createGrid(rows, cols);
let running = true;

// --- Grid Functions ---

function createGrid(rows, cols) {
//   const grid = [];
//   for (let r = 0; r < rows; r++) {
//     const row = new Array(cols).fill(0);
//     grid.push(row);
//   }
    const grid = createRandomGrid(rows, cols);
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
    const nextGrid = createGrid(rows, cols);
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

function loop() {
    if (running) {
        grid = updateGrid(grid);
    }
    drawGrid(grid);
    requestAnimationFrame(loop);
}

// --- Controls ---

function toggleRunning() {
    running = !running;
}

function resetGrid() {
    grid = createGrid(rows, cols);
}

// --- Start the simulation ---
drawGrid(grid);
loop();
