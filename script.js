let gridSize = 16;
let gridContainer = document.getElementById("grid-container");
const gridMin = 16;

const gridButton = document.getElementById("grid-button");
const resetButton = document.getElementById("reset-button");

const defaultSquare = document.createElement("div");
const squareBackground = document.createElement("div");
defaultSquare.classList.add("square");
squareBackground.classList.add("square-background");
defaultSquare.appendChild(squareBackground);

gridButton.addEventListener("click", (event) => {
  changeGridSize(gridContainer, defaultSquare, gridMin);
});

resetButton.addEventListener("click", (event) => {
  resetGrid(gridContainer, defaultSquare, gridMin);
});

function formatSquare(square, width) {
  square.style.width = `${width}px`;
  square.style.height = `${width}px`;
}

function createGrid(gridContainer, square, gridMin) {
  // Size the gridContainer
  const squareWidth = determineWidth(gridContainer, gridSize);
  const adjustedContainerWidth = squareWidth * gridSize;

  gridContainer.style.width = `${adjustedContainerWidth}px`;
  gridContainer.style.height = `${adjustedContainerWidth}px`;

  // Format the defaultSquare
  formatSquare(square, squareWidth);

  // Create the correct total number of squares
  // And insert them into grid-container
  for (let i = 0; i < gridSize * gridSize; i++) {
    const newSquare = square.cloneNode(true);
    newSquare.addEventListener("mouseenter", (event) => {
      darkenSquare(newSquare, gridSize, gridMin);
    });
    gridContainer.appendChild(newSquare);
  }
}

function changeGridSize(gridContainer, square, gridMin) {
  let gridSizePrompt = prompt("Give us a new grid size (between 16-100):");

  if (gridSizePrompt === null) {
    return;
  }

  // Check if we got a correct input
  const properSize = isStringInteger(gridSizePrompt);
  if (!properSize) {
    alert("Sorry, please try inputting a valid grid size!");
    changeGridSize(gridContainer, square, gridSize, gridMin);
    return;
  }

  // Check if grid size is too small/large
  newGridSize = Number(gridSizePrompt);
  if (newGridSize < 16) {
    alert("Sorry, the size you input is too small!");
    changeGridSize(gridContainer, square, gridSize, gridMin);
    return;
  } else if (newGridSize > 100) {
    alert("Sorry, the size you input is too big!");
    changeGridSize(gridContainer, square, gridSize, gridMin);
    return;
  }

  gridSize = newGridSize;

  // Create new grid with correct grid size
  resetGrid(gridContainer, square, gridMin);
}

function isStringInteger(string) {
  return Number.isInteger(+string);
}

function resetGrid(gridContainer, square, gridMin) {
  // Remove the elements from the grid
  gridContainer.replaceChildren();

  // Create new grid
  createGrid(gridContainer, square, gridSize, gridMin);
}

function determineWidth(gridContainer, gridSize) {
  return Math.floor(gridContainer.clientWidth / gridSize);
}

function darkenSquare(square, gridMin) {
  const child = square.firstChild;

  // Get background color
  let style = window.getComputedStyle(child);
  let color = style.backgroundColor;
  let rgbValues = color.match(/\d+/g).map(Number);

  // Check if color is white, if so, give it a new color first
  if (rgbValues[0] === 255 && rgbValues[1] === 255 && rgbValues[2] === 255) {
    const r = 200 + Math.floor(Math.random() * 56);
    const g = 200 + Math.floor(Math.random() * 56);
    const b = 200 + Math.floor(Math.random() * 56);
    child.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    color = child.style.backgroundColor;
  }

  // Extract RGB values
  let rgb = color.match(/\d+/g).map(Number);

  // Adaptive step based on grid size
  const step = getAdaptiveStep(10, gridMin);

  // Calculate amount to darken
  const darkenAmount = 255 / step;

  // Subtract darkenAmount from each channel, but not below 0
  rgb = rgb.map((channel) => Math.max(channel - darkenAmount, 0));

  // Apply new color
  child.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function getAdaptiveStep(baseSteps = 10, gridMin) {
  return Math.max(Math.floor(baseSteps * (gridMin / gridSize)), 5);
}

resetGrid(gridContainer, defaultSquare, gridSize, gridMin);
