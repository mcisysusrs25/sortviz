// Global variables
let algorithmData = null;
let currentAlgorithm = null;
let array = [];
let arraySize = 50;
let animationSpeed = 3;
let sortingInProgress = false;
let arrayAccesses = 0;
let comparisons = 0;
let darkMode = false;

// DOM Elements
const arraySizeSlider = document.getElementById('array-size');
const animationSpeedSlider = document.getElementById('animation-speed');
const generateArrayBtn = document.getElementById('generate-array');
const startSortingBtn = document.getElementById('start-sorting');
const arrayContainer = document.getElementById('array-container');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');
const sizeValue = document.getElementById('size-value');
const currentAlgorithmTitle = document.getElementById('current-algorithm-title');
const currentAlgorithmIcon = document.getElementById('current-algorithm-icon');
const currentAlgorithmComplexity = document.getElementById('current-algorithm-complexity');
const currentAlgorithmDescription = document.getElementById('current-algorithm-description');
const arrayAccessCount = document.getElementById('array-access-count');
const comparisonCount = document.getElementById('comparison-count');
const algorithmButtons = document.getElementById('algorithm-buttons');
const speedLabels = document.getElementById('speed-labels');
const colorLegend = document.getElementById('color-legend');
const algorithmDetails = document.getElementById('algorithm-details');
const complexityTable = document.getElementById('complexity-table');
const navbar = document.getElementById('navbar');
const footer = document.getElementById('footer');

// Load JSON data
async function loadData() {
    try {
        const response = await fetch('Data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        algorithmData = await response.json();
        
        // Initialize the app after data is loaded
        initializeApp();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Failed to load algorithm data. Please refresh the page to try again.');
    }
}

// Initialize the application
function initializeApp() {
    // Set initial values from JSON data
    arraySize = algorithmData.arraySizeSettings.default;
    arraySizeSlider.min = algorithmData.arraySizeSettings.min;
    arraySizeSlider.max = algorithmData.arraySizeSettings.max;
    arraySizeSlider.value = arraySize;
    document.getElementById('size-min').textContent = algorithmData.arraySizeSettings.min;
    document.getElementById('size-max').textContent = algorithmData.arraySizeSettings.max;
    sizeValue.textContent = arraySize;
    
    // Generate algorithm buttons
    generateAlgorithmButtons();
    
    // Set up speed labels
    generateSpeedLabels();
    
    // Generate color legend
    generateColorLegend();
    
    // Generate algorithm details
    generateAlgorithmDetails();
    
    // Generate complexity table
    generateComplexityTable();
    
    // Set current algorithm to bubble sort (first in the list)
    setCurrentAlgorithm(algorithmData.algorithms[0].id);
    
    // Generate initial array
    generateArray();
    
    // Set up accordion behavior
    setupAccordion();
    
    // Initialize dark mode from localStorage if available
    initDarkMode();
}

// Initialize dark mode from localStorage
function initDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }
}

// Generate algorithm buttons
function generateAlgorithmButtons() {
    algorithmButtons.innerHTML = '';
    
    algorithmData.algorithms.forEach(algo => {
        const button = document.createElement('button');
        button.className = 'algorithm-btn';
        button.dataset.algorithm = algo.id;
        
        button.innerHTML = `
            <div class="p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-center">
                <i class="fas ${algo.icon} text-2xl mb-2 ${algo.iconColor}"></i>
                <h3 class="font-medium">${algo.name}</h3>
                <p class="text-xs text-gray-500 mt-1">O(${algo.complexity.time.average.slice(2)})</p>
            </div>
        `;
        
        button.addEventListener('click', () => {
            if (!sortingInProgress) {
                setCurrentAlgorithm(algo.id);
            }
        });
        
        algorithmButtons.appendChild(button);
    });
}

// Generate speed labels
function generateSpeedLabels() {
    speedLabels.innerHTML = '';
    
    // Create first, middle, and last labels
    const speeds = algorithmData.speedSettings;
    
    const minLabel = document.createElement('span');
    minLabel.textContent = speeds[0].label;
    speedLabels.appendChild(minLabel);
    
    const currentLabel = document.createElement('span');
    currentLabel.id = 'speed-value';
    currentLabel.textContent = speeds[2].label;
    speedLabels.appendChild(currentLabel);
    
    const maxLabel = document.createElement('span');
    maxLabel.textContent = speeds[speeds.length - 1].label;
    speedLabels.appendChild(maxLabel);
}

// Generate color legend
function generateColorLegend() {
    colorLegend.innerHTML = '';
    
    Object.entries(algorithmData.colorCodes).forEach(([state, color]) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'flex items-center space-x-2';
        
        legendItem.innerHTML = `
            <div class="w-4 h-4 rounded-full" style="background-color: ${color}"></div>
            <span class="text-sm text-gray-600">${state.charAt(0).toUpperCase() + state.slice(1)}</span>
        `;
        
        colorLegend.appendChild(legendItem);
    });
}

// Generate algorithm details
function generateAlgorithmDetails() {
    algorithmDetails.innerHTML = '';
    
    algorithmData.algorithms.forEach(algo => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item bg-white rounded-lg shadow-md mb-4 overflow-hidden';
        
        accordionItem.innerHTML = `
            <div class="accordion-header flex justify-between items-center p-6 cursor-pointer">
                <div class="flex items-center">
                    <i class="fas ${algo.icon} ${algo.iconColor} mr-3"></i>
                    <h3 class="text-xl font-semibold text-gray-800">${algo.name}</h3>
                </div>
                <i class="fas fa-chevron-down text-gray-500 transition-transform"></i>
            </div>
            <div class="accordion-content p-6 pt-0 hidden border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2">
                        <h4 class="text-lg font-medium text-gray-700 mb-2">How It Works</h4>
                        <p class="text-gray-600 mb-4">
                            ${algo.longDescription}
                        </p>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Key Properties</h4>
                        <ul class="list-disc list-inside ml-4 text-gray-600 mb-4">
                            <li><span class="font-medium">Time Complexity:</span> 
                                Best case: ${algo.complexity.time.best}, 
                                Average case: ${algo.complexity.time.average}, 
                                Worst case: ${algo.complexity.time.worst}
                            </li>
                            <li><span class="font-medium">Space Complexity:</span> ${algo.complexity.space}</li>
                            <li><span class="font-medium">Stable:</span> ${algo.stable ? 'Yes' : 'No'}</li>
                            <li><span class="font-medium">In-place:</span> ${algo.inPlace ? 'Yes' : 'No'}</li>
                        </ul>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Advantages</h4>
                        <ul class="list-disc list-inside ml-4 text-gray-600 mb-4">
                            ${algo.advantages.map(adv => `<li>${adv}</li>`).join('')}
                        </ul>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Disadvantages</h4>
                        <ul class="list-disc list-inside ml-4 text-gray-600 mb-4">
                            ${algo.disadvantages.map(dis => `<li>${dis}</li>`).join('')}
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Pseudocode</h4>
                        <pre class="bg-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">${algo.pseudocode}</pre>
                        <h4 class="text-lg font-medium text-gray-700 mt-4 mb-2">When to Use</h4>
                        <ul class="list-disc list-inside ml-4 text-gray-600">
                            ${algo.useCases.map(use => `<li>${use}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        algorithmDetails.appendChild(accordionItem);
    });
}

// Generate complexity table
function generateComplexityTable() {
    complexityTable.innerHTML = '';
    
    algorithmData.algorithms.forEach(algo => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        
        row.innerHTML = `
            <td class="py-3 px-4 font-medium">${algo.name}</td>
            <td class="py-3 px-4">${algo.complexity.time.best}</td>
            <td class="py-3 px-4">${algo.complexity.time.average}</td>
            <td class="py-3 px-4">${algo.complexity.time.worst}</td>
            <td class="py-3 px-4">${algo.complexity.space}</td>
            <td class="py-3 px-4">${algo.stable ? 'Yes' : 'No'}</td>
        `;
        
        complexityTable.appendChild(row);
    });
}

// Set current algorithm
function setCurrentAlgorithm(algorithmId) {
    // Find the algorithm in the data
    currentAlgorithm = algorithmData.algorithms.find(algo => algo.id === algorithmId);
    
    if (!currentAlgorithm) {
        console.error(`Algorithm with id ${algorithmId} not found.`);
        return;
    }
    
    // Update the UI
    currentAlgorithmTitle.textContent = currentAlgorithm.name;
    currentAlgorithmIcon.className = `fas ${currentAlgorithm.icon} ${currentAlgorithm.iconColor} mr-3`;
    currentAlgorithmComplexity.textContent = currentAlgorithm.complexity.time.average;
    currentAlgorithmDescription.textContent = currentAlgorithm.description;
    
    // Update algorithm buttons
    document.querySelectorAll('.algorithm-btn').forEach(btn => {
        if (btn.dataset.algorithm === algorithmId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Setup accordion behavior
function setupAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i.fa-chevron-down');
            
            // Toggle active class
            header.classList.toggle('active');
            
            // Toggle display of content
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

// Generate a new random array
function generateArray() {
    if (sortingInProgress) return;
    
    // Reset counters
    resetCounters();
    
    // Clear the array container
    arrayContainer.innerHTML = '';
    array = [];
    
    // Generate random values and create bars
    const maxHeight = 80; // Maximum height percentage
    
    for (let i = 0; i < arraySize; i++) {
        // Generate random height between 10% and maxHeight%
        const height = Math.floor(Math.random() * maxHeight) + 10;
        array.push(height);
        
        // Create a bar element
        createBar(i, height);
    }
}

// Create a single bar in the visualization
function createBar(index, height) {
    const bar = document.createElement('div');
    bar.className = 'array-bar';
    bar.style.height = `${height}%`;
    bar.style.width = `${90/arraySize}%`;
    bar.style.backgroundColor = algorithmData.colorCodes.default;
    
    // Add the bar to the container
    arrayContainer.appendChild(bar);
}

// Update array size based on slider value
function updateArraySize() {
    if (sortingInProgress) return;
    
    arraySize = parseInt(arraySizeSlider.value);
    sizeValue.textContent = arraySize;
    generateArray();
}

// Update animation speed based on slider value
function updateAnimationSpeed() {
    animationSpeed = parseInt(animationSpeedSlider.value);
    const speedSetting = algorithmData.speedSettings.find(s => s.value === animationSpeed);
    document.getElementById('speed-value').textContent = speedSetting.label;
}

// Toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    
    // Toggle icons
    moonIcon.classList.toggle('hidden');
    sunIcon.classList.toggle('hidden');
    
    // Apply dark mode to all containers
    applyDarkMode();
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
}

// Apply dark mode to specific elements
function applyDarkMode() {
    // Handle container backgrounds
    document.querySelectorAll('.bg-white, .bg-gray-50, .bg-gray-100').forEach(el => {
        if (darkMode) {
            if (el.classList.contains('bg-white')) {
                el.classList.remove('bg-white');
                el.classList.add('dark-bg-card');
            } else if (el.classList.contains('bg-gray-50')) {
                el.classList.remove('bg-gray-50');
                el.classList.add('dark-bg-content');
            } else if (el.classList.contains('bg-gray-100')) {
                el.classList.remove('bg-gray-100');
                el.classList.add('dark-bg-highlight');
            }
        } else {
            if (el.classList.contains('dark-bg-card')) {
                el.classList.remove('dark-bg-card');
                el.classList.add('bg-white');
            } else if (el.classList.contains('dark-bg-content')) {
                el.classList.remove('dark-bg-content');
                el.classList.add('bg-gray-50');
            } else if (el.classList.contains('dark-bg-highlight')) {
                el.classList.remove('dark-bg-highlight');
                el.classList.add('bg-gray-100');
            }
        }
    });
    
    // Handle text colors
    document.querySelectorAll('.text-gray-600, .text-gray-700, .text-gray-800').forEach(el => {
        if (darkMode) {
            if (el.classList.contains('text-gray-600')) {
                el.classList.remove('text-gray-600');
                el.classList.add('dark-text-secondary');
            } else if (el.classList.contains('text-gray-700')) {
                el.classList.remove('text-gray-700');
                el.classList.add('dark-text-primary');
            } else if (el.classList.contains('text-gray-800')) {
                el.classList.remove('text-gray-800');
                el.classList.add('dark-text-heading');
            }
        } else {
            if (el.classList.contains('dark-text-secondary')) {
                el.classList.remove('dark-text-secondary');
                el.classList.add('text-gray-600');
            } else if (el.classList.contains('dark-text-primary')) {
                el.classList.remove('dark-text-primary');
                el.classList.add('text-gray-700');
            } else if (el.classList.contains('dark-text-heading')) {
                el.classList.remove('dark-text-heading');
                el.classList.add('text-gray-800');
            }
        }
    });
    
    // Handle border colors
    document.querySelectorAll('.border-gray-200').forEach(el => {
        if (darkMode) {
            el.classList.remove('border-gray-200');
            el.classList.add('dark-border');
        } else {
            el.classList.remove('dark-border');
            el.classList.add('border-gray-200');
        }
    });
    
    // Apply to algorithm buttons
    document.querySelectorAll('.algorithm-btn div').forEach(el => {
        if (darkMode) {
            el.classList.remove('bg-gray-100', 'hover:bg-gray-200');
            el.classList.add('dark-btn', 'hover:dark-btn-hover');
        } else {
            el.classList.remove('dark-btn', 'hover:dark-btn-hover');
            el.classList.add('bg-gray-100', 'hover:bg-gray-200');
        }
    });
}

// Reset counters
function resetCounters() {
    arrayAccesses = 0;
    comparisons = 0;
    updateCountersDisplay();
}

// Update counters display
function updateCountersDisplay() {
    arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;
    comparisonCount.textContent = `Comparisons: ${comparisons}`;
}

// Start sorting
async function startSorting() {
    if (sortingInProgress) return;
    
    // Set sorting state
    sortingInProgress = true;
    disableControls();
    resetCounters();
    
    // Run the selected algorithm
    switch(currentAlgorithm.id) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort();
            break;
        case 'quick':
            await quickSort();
            break;
        case 'heap':
            await heapSort();
            break;
        default:
            console.error(`Algorithm ${currentAlgorithm.id} not implemented.`);
    }
    
    // Reset sorting state
    sortingInProgress = false;
    enableControls();
}

// Bubble Sort algorithm
async function bubbleSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight bars being compared
            bars[j].style.backgroundColor = algorithmData.colorCodes.comparing;
            bars[j+1].style.backgroundColor = algorithmData.colorCodes.comparing;
            
            // Increment comparison counter
            comparisons++;
            updateCountersDisplay();
            
            // Wait for animation
            await delay(getDelay());
            
            // Compare and swap if needed
            if (array[j] > array[j+1]) {
                // Increment array access counter (for both read and write)
                arrayAccesses += 4;
                updateCountersDisplay();
                
                // Swap elements
                [array[j], array[j+1]] = [array[j+1], array[j]];
                
                // Update bar heights
                bars[j].style.height = `${array[j]}%`;
                bars[j+1].style.height = `${array[j+1]}%`;
                
                // Wait for animation
                await delay(getDelay());
            } else {
                // Increment array access counter (for read only)
                arrayAccesses += 2;
                updateCountersDisplay();
            }
            
            // Reset color
            bars[j].style.backgroundColor = algorithmData.colorCodes.default;
            bars[j+1].style.backgroundColor = algorithmData.colorCodes.default;
        }
        
        // Mark the sorted element
        bars[n - i - 1].style.backgroundColor = algorithmData.colorCodes.sorted;
    }
    
    // Mark the first element as sorted (as it's now the smallest)
    bars[0].style.backgroundColor = algorithmData.colorCodes.sorted;
}

// Selection Sort algorithm
async function selectionSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Mark current position
        bars[i].style.backgroundColor = algorithmData.colorCodes.selected;
        
        let minIdx = i;
        
        // Find the minimum element in the unsorted portion
        for (let j = i + 1; j < n; j++) {
            // Highlight bar being compared
            bars[j].style.backgroundColor = algorithmData.colorCodes.comparing;
            
            // Increment comparison counter
            comparisons++;
            arrayAccesses += 2; // Reading two values
            updateCountersDisplay();
            
            await delay(getDelay());
            
            if (array[j] < array[minIdx]) {
                // If we found a new minimum, reset the old minimum color
                if (minIdx !== i) {
                    bars[minIdx].style.backgroundColor = algorithmData.colorCodes.default;
                }
                
                minIdx = j;
                bars[minIdx].style.backgroundColor = algorithmData.colorCodes.selected;
            } else {
                // Reset color if not the new minimum
                bars[j].style.backgroundColor = algorithmData.colorCodes.default;
            }
        }
        
        // Swap the found minimum element with the first element
        if (minIdx !== i) {
            // Increment array access counter
            arrayAccesses += 4; // Reading and writing two values
            updateCountersDisplay();
            
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            
            // Update bar heights
            bars[i].style.height = `${array[i]}%`;
            bars[minIdx].style.height = `${array[minIdx]}%`;
            
            await delay(getDelay());
            
            // Reset color of the previous minimum
            bars[minIdx].style.backgroundColor = algorithmData.colorCodes.default;
        }
        
        // Mark the element as sorted
        bars[i].style.backgroundColor = algorithmData.colorCodes.sorted;
    }
    
    // Mark the last element as sorted
    bars[n - 1].style.backgroundColor = algorithmData.colorCodes.sorted;
}

// Insertion Sort algorithm
async function insertionSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;
    
    // Mark the first element as already sorted
    bars[0].style.backgroundColor = algorithmData.colorCodes.sorted;
    
    for (let i = 1; i < n; i++) {
        // Element to be inserted
        const key = array[i];
        let j = i - 1;
        
        // Highlight the current element being inserted
        bars[i].style.backgroundColor = algorithmData.colorCodes.selected;
        arrayAccesses++; // Reading the key value
        
        await delay(getDelay());
        
        // Move elements greater than key one position ahead
        while (j >= 0 && array[j] > key) {
            // Highlight bar being compared
            bars[j].style.backgroundColor = algorithmData.colorCodes.comparing;
            
            comparisons++;
            arrayAccesses += 2; // Reading array[j] and key
            updateCountersDisplay();
            
            await delay(getDelay());
            
            // Move the element
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1]}%`;
            
            arrayAccesses += 2; // Reading and writing a value
            updateCountersDisplay();
            
            // Reset color after comparison
            bars[j].style.backgroundColor = algorithmData.colorCodes.sorted;
            
            j--;
        }
        
        // Insert the key in its correct position
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;
        bars[j + 1].style.backgroundColor = algorithmData.colorCodes.sorted;
        
        arrayAccesses++; // Writing a value
        updateCountersDisplay();
        
        await delay(getDelay());
    }
}

// Merge Sort algorithm
async function mergeSort() {
    const bars = document.querySelectorAll('.array-bar');
    
    // Create a temporary array to visualize the process
    const tempArray = [...array];
    
    await mergeSortRecursive(array, 0, array.length - 1, tempArray, bars);
    
    // Mark all bars as sorted when done
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = algorithmData.colorCodes.sorted;
    }
}

// Recursive function for merge sort
async function mergeSortRecursive(arr, left, right, tempArray, bars) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Recursively sort both halves
        await mergeSortRecursive(arr, left, mid, tempArray, bars);
        await mergeSortRecursive(arr, mid + 1, right, tempArray, bars);
        
        // Merge the sorted halves
        await merge(arr, left, mid, right, tempArray, bars);
    }
}

// Merge function for merge sort
async function merge(arr, left, mid, right, tempArray, bars) {
    // Highlight the subarray being merged
    for (let i = left; i <= right; i++) {
        bars[i].style.backgroundColor = algorithmData.colorCodes.selected;
    }
    
    await delay(getDelay());
    
    // Copy data to temp arrays
    for (let i = left; i <= right; i++) {
        tempArray[i] = arr[i];
        arrayAccesses += 2; // Reading from arr and writing to tempArray
    }
    
    let i = left; // Initial index of first subarray
    let j = mid + 1; // Initial index of second subarray
    let k = left; // Initial index of merged subarray
    
    // Merge the temp arrays back
    while (i <= mid && j <= right) {
        // Highlight bars being compared
        bars[i].style.backgroundColor = algorithmData.colorCodes.comparing;
        bars[j].style.backgroundColor = algorithmData.colorCodes.comparing;
        
        comparisons++;
        arrayAccesses += 2; // Reading two values from tempArray
        updateCountersDisplay();
        
        await delay(getDelay());
        
        if (tempArray[i] <= tempArray[j]) {
            arr[k] = tempArray[i];
            bars[k].style.height = `${arr[k]}%`;
            i++;
        } else {
            arr[k] = tempArray[j];
            bars[k].style.height = `${arr[k]}%`;
            j++;
        }
        
        // Reset colors after comparison
        if (i <= mid) {
            bars[i-1].style.backgroundColor = algorithmData.colorCodes.default;
        }
        if (j <= right) {
            bars[j-1].style.backgroundColor = algorithmData.colorCodes.default;
        }
        
        arrayAccesses += 2; // Reading from tempArray and writing to arr
        updateCountersDisplay();
        
        // Mark this position as being processed
        bars[k].style.backgroundColor = algorithmData.colorCodes.default;
        
        k++;
        await delay(getDelay() / 2); // Slightly faster for better visualization
    }
    
    // Copy the remaining elements
    while (i <= mid) {
        arr[k] = tempArray[i];
        bars[k].style.height = `${arr[k]}%`;
        
        arrayAccesses += 2; // Reading from tempArray and writing to arr
        updateCountersDisplay();
        
        i++;
        k++;
        await delay(getDelay() / 2);
    }
    
    while (j <= right) {
        arr[k] = tempArray[j];
        bars[k].style.height = `${arr[k]}%`;
        
        arrayAccesses += 2; // Reading from tempArray and writing to arr
        updateCountersDisplay();
        
        j++;
        k++;
        await delay(getDelay() / 2);
    }
}

// Quick Sort algorithm
async function quickSort() {
    const bars = document.querySelectorAll('.array-bar');
    
    await quickSortRecursive(array, 0, array.length - 1, bars);
    
    // Mark all bars as sorted when done
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = algorithmData.colorCodes.sorted;
    }
}

// Recursive function for quick sort
async function quickSortRecursive(arr, low, high, bars) {
    if (low < high) {
        // Partition and get pivot index
        const pivotIndex = await partition(arr, low, high, bars);
        
        // Recursively sort elements before and after pivot
        await quickSortRecursive(arr, low, pivotIndex - 1, bars);
        await quickSortRecursive(arr, pivotIndex + 1, high, bars);
    } else if (low === high) {
        // If there's only one element, mark it as sorted
        bars[low].style.backgroundColor = algorithmData.colorCodes.sorted;
    }
}

// Partition function for quick sort
async function partition(arr, low, high, bars) {
    // Choose the rightmost element as pivot
    const pivot = arr[high];
    bars[high].style.backgroundColor = algorithmData.colorCodes.selected;
    
    arrayAccesses++; // Reading pivot
    updateCountersDisplay();
    
    await delay(getDelay());
    
    // Index of smaller element
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // Highlight current element
        bars[j].style.backgroundColor = algorithmData.colorCodes.comparing;
        
        comparisons++;
        arrayAccesses += 2; // Reading arr[j] and pivot
        updateCountersDisplay();
        
        await delay(getDelay());
        
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            i++;
            
            // Swap arr[i] and arr[j]
            [arr[i], arr[j]] = [arr[j], arr[i]];
            
            // Update bar heights
            bars[i].style.height = `${arr[i]}%`;
            bars[j].style.height = `${arr[j]}%`;
            
            // Highlight the swapped elements
            bars[i].style.backgroundColor = algorithmData.colorCodes.comparing;
            
            arrayAccesses += 4; // Reading and writing two values
            updateCountersDisplay();
            
            await delay(getDelay());
        }
        
        // Reset color for the current element
        bars[j].style.backgroundColor = algorithmData.colorCodes.default;
        if (i >= low) {
            bars[i].style.backgroundColor = algorithmData.colorCodes.default;
        }
    }
    
    // Swap arr[i+1] and arr[high] (put pivot in its correct position)
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    // Update bar heights
    bars[i + 1].style.height = `${arr[i + 1]}%`;
    bars[high].style.height = `${arr[high]}%`;
    
    // Mark the pivot position
    bars[i + 1].style.backgroundColor = algorithmData.colorCodes.sorted;
    
    // Reset the color of the high element
    bars[high].style.backgroundColor = algorithmData.colorCodes.default;
    
    arrayAccesses += 4; // Reading and writing two values
    updateCountersDisplay();
    
    await delay(getDelay());
    
    return i + 1;
}

// Heap Sort algorithm
async function heapSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i, bars);
    }
    
    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [array[0], array[i]] = [array[i], array[0]];
        
        // Update bar heights
        bars[0].style.height = `${array[0]}%`;
        bars[i].style.height = `${array[i]}%`;
        
        // Mark the sorted element
        bars[i].style.backgroundColor = algorithmData.colorCodes.sorted;
        
        arrayAccesses += 4; // Reading and writing two values
        updateCountersDisplay();
        
        await delay(getDelay());
        
        // Call heapify on the reduced heap
        await heapify(array, i, 0, bars);
    }
    
    // Mark the first element as sorted
    bars[0].style.backgroundColor = algorithmData.colorCodes.sorted;
}

// Heapify function for heap sort
async function heapify(arr, n, i, bars) {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // Left child
    const right = 2 * i + 2; // Right child
    
    // Highlight the current node and its children
    bars[i].style.backgroundColor = algorithmData.colorCodes.selected;
    
    if (left < n) {
        bars[left].style.backgroundColor = algorithmData.colorCodes.comparing;
    }
    
    if (right < n) {
        bars[right].style.backgroundColor = algorithmData.colorCodes.comparing;
    }
    
    await delay(getDelay());
    
    // If left child is larger than root
    if (left < n) {
        comparisons++;
        arrayAccesses += 2; // Reading two values
        updateCountersDisplay();
        
        if (arr[left] > arr[largest]) {
            largest = left;
        }
    }
    
    // If right child is larger than largest so far
    if (right < n) {
        comparisons++;
        arrayAccesses += 2; // Reading two values
        updateCountersDisplay();
        
        if (arr[right] > arr[largest]) {
            largest = right;
        }
    }
    
    // Reset colors after comparison
    if (left < n) {
        bars[left].style.backgroundColor = algorithmData.colorCodes.default;
    }
    
    if (right < n) {
        bars[right].style.backgroundColor = algorithmData.colorCodes.default;
    }
    
    // If largest is not root
    if (largest !== i) {
        // Swap and update visualization
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        bars[i].style.height = `${arr[i]}%`;
        bars[largest].style.height = `${arr[largest]}%`;
        
        arrayAccesses += 4; // Reading and writing two values
        updateCountersDisplay();
        
        // Highlight the swapped elements
        bars[largest].style.backgroundColor = algorithmData.colorCodes.selected;
        
        await delay(getDelay());
        
        // Reset colors
        bars[i].style.backgroundColor = algorithmData.colorCodes.default;
        bars[largest].style.backgroundColor = algorithmData.colorCodes.default;
        
        // Recursively heapify the affected sub-tree
        await heapify(arr, n, largest, bars);
    } else {
        // Reset colors if no swap happened
        bars[i].style.backgroundColor = algorithmData.colorCodes.default;
    }
}

// Calculate delay based on animation speed
function getDelay() {
    const speedSetting = algorithmData.speedSettings.find(s => s.value === animationSpeed);
    return speedSetting.delay;
}

// Create a delay using Promise
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Disable controls during sorting
function disableControls() {
    arraySizeSlider.disabled = true;
    animationSpeedSlider.disabled = true;
    generateArrayBtn.classList.add('disabled');
    startSortingBtn.classList.add('disabled');
    
    document.querySelectorAll('.algorithm-btn').forEach(btn => {
        btn.classList.add('disabled');
    });
}

// Enable controls after sorting
function enableControls() {
    arraySizeSlider.disabled = false;
    animationSpeedSlider.disabled = false;
    generateArrayBtn.classList.remove('disabled');
    startSortingBtn.classList.remove('disabled');
    
    document.querySelectorAll('.algorithm-btn').forEach(btn => {
        btn.classList.remove('disabled');
    });
}

// Event Listeners
window.addEventListener('load', loadData);
arraySizeSlider.addEventListener('input', updateArraySize);
animationSpeedSlider.addEventListener('input', updateAnimationSpeed);
generateArrayBtn.addEventListener('click', generateArray);
startSortingBtn.addEventListener('click', startSorting);
darkModeToggle.addEventListener('click', toggleDarkMode);