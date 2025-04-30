const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Language Tabs
const languageTabs = document.querySelectorAll('#language-tabs button');
const tabContents = document.querySelectorAll('.tab-content');

languageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        languageTabs.forEach(t => {
            t.classList.remove('border-blue-600', 'text-blue-600');
            t.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300');
            t.setAttribute('aria-selected', 'false');
        });

        // Add active class to clicked tab
        tab.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300');
        tab.classList.add('border-blue-600', 'text-blue-600');
        tab.setAttribute('aria-selected', 'true');

        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Show the corresponding tab content
        const target = tab.getAttribute('data-target');
        document.getElementById(target).classList.remove('hidden');
    });
});

// Simple visualization script
const arraySizeInput = document.getElementById('array-size');
const speedInput = document.getElementById('animation-speed');
const generateButton = document.getElementById('generate-array');
const sortButton = document.getElementById('start-sorting');
const arrayContainer = document.getElementById('array-container');
const sizeValue = document.getElementById('size-value');
const speedValue = document.getElementById('speed-value');
const arrayAccessCount = document.getElementById('array-access-count');
const comparisonCount = document.getElementById('comparison-count');

let array = [];
let arraySize = parseInt(arraySizeInput.value);
let animationSpeed = parseInt(speedInput.value);
let arrayAccesses = 0;
let comparisons = 0;
let sortingInProgress = false;

// Update size display
arraySizeInput.addEventListener('input', () => {
    arraySize = parseInt(arraySizeInput.value);
    sizeValue.textContent = arraySize;
    generateArray();
});

// Update speed display
speedInput.addEventListener('input', () => {
    animationSpeed = parseInt(speedInput.value);
    const speedLabels = ['Slow', 'Medium-Slow', 'Medium', 'Medium-Fast', 'Fast'];
    speedValue.textContent = speedLabels[animationSpeed - 1];
});

// Generate a new random array
function generateArray() {
    if (sortingInProgress) return;

    array = [];
    arrayContainer.innerHTML = '';
    resetCounters();

    for (let i = 0; i < arraySize; i++) {
        const value = Math.floor(Math.random() * 80) + 10;
        array.push(value);

        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value}%`;
        bar.style.width = `${90 / arraySize}%`;
        bar.style.margin = '0 1px';
        bar.style.backgroundColor = '#4299e1';
        bar.style.transition = 'height 0.3s ease, background-color 0.3s ease';
        bar.style.borderRadius = '2px 2px 0 0';

        arrayContainer.appendChild(bar);
    }
}

// Reset counters
function resetCounters() {
    arrayAccesses = 0;
    comparisons = 0;
    arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;
    comparisonCount.textContent = `Comparisons: ${comparisons}`;
}

// Insertion Sort algorithm
async function insertionSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;

    // Mark the first element as sorted
    bars[0].style.backgroundColor = '#13CE66'; // Green

    for (let i = 1; i < n; i++) {
        // Highlight current element to be inserted
        bars[i].style.backgroundColor = '#FF4949'; // Red
        await delay(getDelay());

        // Store the current element
        let key = array[i];
        arrayAccesses++;
        arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;

        // Initialize j to element right before current one
        let j = i - 1;

        // Compare key with each element on the left until a smaller element is found
        while (j >= 0 && array[j] > key) {
            // Highlight element being compared
            bars[j].style.backgroundColor = '#FFD700'; // Yellow
            await delay(getDelay());

            // Increment comparison counter
            comparisons++;
            comparisonCount.textContent = `Comparisons: ${comparisons}`;

            // Move elements greater than key to one position ahead
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j]}%`;

            // Increment array access counter (1 read + 1 write)
            arrayAccesses += 2;
            arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;

            // Reset color of compared element and mark it as sorted
            bars[j].style.backgroundColor = '#13CE66'; // Green

            j = j - 1;
            await delay(getDelay());
        }

        // Place the key in its correct position
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;

        // Increment array access counter (1 write)
        arrayAccesses++;
        arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;

        // Mark the current element as sorted
        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = '#13CE66'; // Green
        }

        await delay(getDelay());
    }
}

// Get delay based on speed
function getDelay() {
    const delays = [300, 150, 75, 25, 5];
    return delays[animationSpeed - 1];
}

// Create delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Start sorting
async function startSorting() {
    if (sortingInProgress) return;

    sortingInProgress = true;
    sortButton.disabled = true;
    generateButton.disabled = true;
    arraySizeInput.disabled = true;

    resetCounters();
    await insertionSort();

    sortingInProgress = false;
    sortButton.disabled = false;
    generateButton.disabled = false;
    arraySizeInput.disabled = false;
}

// Event listeners
generateButton.addEventListener('click', generateArray);
sortButton.addEventListener('click', startSorting);

// Initialize
generateArray();