const rows = 20;
const cols = 50;
const grid = [];
let startNode = { row: 0, col: 0 };
let endNode = { row: 19, col: 49 };
let settingStart = false;
let settingEnd = false;
let addingWalls = false;

document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById('grid');

    // Initialize grid
    for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
            const node = createNode(row, col);
            currentRow.push(node);
            gridElement.appendChild(node.element);
        }
        grid.push(currentRow);
    }

    // Mark start and end nodes
    grid[startNode.row][startNode.col].element.classList.add('start');
    grid[endNode.row][endNode.col].element.classList.add('end');

    document.getElementById('visualizeButton').addEventListener('click', () => {
        resetGrid();
        visualizeDijkstra(grid, startNode, endNode);
    });

    document.getElementById('startButton').addEventListener('click', () => {
        settingStart = true;
        settingEnd = false;
        addingWalls = false;
    });

    document.getElementById('endButton').addEventListener('click', () => {
        settingEnd = true;
        settingStart = false;
        addingWalls = false;
    });

    document.getElementById('wallButton').addEventListener('click', () => {
        addingWalls = true;
        settingStart = false;
        settingEnd = false;
    });

    gridElement.addEventListener('click', handleNodeClick);
});

function createNode(row, col) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.dataset.row = row;
    nodeElement.dataset.col = col;
    return {
        row,
        col,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
        element: nodeElement
    };
}

function handleNodeClick(event) {
    const element = event.target;
    if (!element.classList.contains('node')) return;

    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);

    if (settingStart) {
        grid[startNode.row][startNode.col].element.classList.remove('start');
        startNode = { row, col };
        element.classList.add('start');
        settingStart = false;
    } else if (settingEnd) {
        grid[endNode.row][endNode.col].element.classList.remove('end');
        endNode = { row, col };
        element.classList.add('end');
        settingEnd = false;
    } else if (addingWalls) {
        if (!element.classList.contains('start') && !element.classList.contains('end')) {
            element.classList.toggle('wall');
            grid[row][col].isWall = !grid[row][col].isWall;
        }
    }
}

function resetGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node = grid[row][col];
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
            node.element.classList.remove('visited', 'shortest-path');
        }
    }
}

function visualizeDijkstra(grid, startNode, endNode) {
    const unvisitedNodes = [];
    grid[startNode.row][startNode.col].distance = 0;

    for (const row of grid) {
        for (const node of row) {
            if (!node.isWall) {
                unvisitedNodes.push(node);
            }
        }
    }

    animateDijkstra(unvisitedNodes, grid, endNode);
}

function animateDijkstra(unvisitedNodes, grid, endNode) {
    if (unvisitedNodes.length === 0) return;

    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.distance === Infinity) return;

    closestNode.isVisited = true;
    closestNode.element.classList.add('visited');

    if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
        animateShortestPath(grid[endNode.row][endNode.col]);
        return;
    }

    updateUnvisitedNeighbors(closestNode, grid);

    setTimeout(() => {
        animateDijkstra(unvisitedNodes, grid, endNode);
    }, 20);
}

function updateUnvisitedNeighbors(node, grid) {
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
        if (!neighbor.isVisited && !neighbor.isWall) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    }
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < cols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
}

function animateShortestPath(endNode) {
    let currentNode = endNode;
    const nodesInShortestPathOrder = [];
    while (currentNode !== null) {
        nodesInShortestPathOrder.push(currentNode);
        currentNode = currentNode.previousNode;
    }
    nodesInShortestPathOrder.reverse();

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            nodesInShortestPathOrder[i].element.classList.add('shortest-path');
        }, 50 * i);
    }
}
