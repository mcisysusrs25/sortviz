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

// Quick Sort algorithm
async function quickSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;

    // Initial call to quick sort
    await quickSortRecursive(0, n - 1);
}

// Recursive Quick Sort helper function
async function quickSortRecursive(low, high) {
    if (low < high) {
        const pi = await partition(low, high);

        // Recursively sort elements before and after partition
        await quickSortRecursive(low, pi - 1);
        await quickSortRecursive(pi + 1, high);
    }
}

// Partition function for Quick Sort
async function partition(low, high) {
    const bars = document.querySelectorAll('.array-bar');
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        // Highlight element being compared
        bars[j].style.backgroundColor = '#FFD700'; // Yellow
        await delay(getDelay());

        comparisons++;
        comparisonCount.textContent = `Comparisons: ${comparisons}`;

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];

            bars[i].style.height = `${array[i]}%`;
            bars[j].style.height = `${array[j]}%`;
            arrayAccesses += 2;
            arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;
        }

        bars[j].style.backgroundColor = '#13CE66'; // Green
    }

    // Swap the pivot element
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}%`;
    bars[high].style.height = `${array[high]}%`;
    arrayAccesses += 2;
    arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;

    return i + 1;
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
    await quickSort();

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