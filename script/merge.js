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

// Merge Sort algorithm
async function mergeSort() {
    const bars = document.querySelectorAll('.array-bar');
    const n = array.length;

    // Initial call to merge sort
    await mergeSortRecursive(0, n - 1);
}

// Recursive Merge Sort helper function
async function mergeSortRecursive(low, high) {
    if (low < high) {
        const mid = Math.floor((low + high) / 2);

        // Recursively sort the two halves
        await mergeSortRecursive(low, mid);
        await mergeSortRecursive(mid + 1, high);

        // Merge the sorted halves
        await merge(low, mid, high);
    }
}

// Merge function for Merge Sort
async function merge(low, mid, high) {
    const bars = document.querySelectorAll('.array-bar');

    let left = array.slice(low, mid + 1);
    let right = array.slice(mid + 1, high + 1);

    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            array[k] = left[i];
            bars[k].style.height = `${left[i]}%`;
            i++;
        } else {
            array[k] = right[j];
            bars[k].style.height = `${right[j]}%`;
            j++;
        }
        k++;
        arrayAccesses++;
        arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${left[i]}%`;
        i++;
        k++;
        arrayAccesses++;
        arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;
    }

    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${right[j]}%`;
        j++;
        k++;
        arrayAccesses++;
        arrayAccessCount.textContent = `Array Accesses: ${arrayAccesses}`;
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
    await mergeSort();

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