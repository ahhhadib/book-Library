// 1. Select DOM Elements
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list'); // The container for cards or table rows
const searchInput = document.getElementById('search-input');

// Stats Elements
const totalBooksEl = document.getElementById('total-books');
const borrowedCountEl = document.getElementById('borrowed-count');
const availableCountEl = document.getElementById('available-count');

// 2. State Management (Initialize from LocalStorage or empty array)
let library = JSON.parse(localStorage.getItem('myLibrary')) || [];

// 3. Event Listeners
bookForm.addEventListener('submit', addBook);
searchInput.addEventListener('input', searchBooks); // Search as you type
document.addEventListener('DOMContentLoaded', renderUI);

// 4. Function: Add Book
function addBook(e) {
    e.preventDefault();

    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;

    if (title.trim() === '' || author.trim() === '') {
        alert("Please enter both title and author.");
        return;
    }

    // Create book object
    const book = {
        id: Date.now(),
        title,
        author,
        isBorrowed: false // Default status
    };

    library.push(book);
    saveData();
    renderUI();
    bookForm.reset();
}

// 5. Function: Remove Book
function removeBook(id) {
    library = library.filter(book => book.id !== id);
    saveData();
    renderUI();
}

// 6. Function: Toggle Borrow Status
function toggleStatus(id) {
    const book = library.find(b => b.id === id);
    if (book) {
        book.isBorrowed = !book.isBorrowed;
        saveData();
        renderUI();
    }
}

// 7. Function: Search (Loops & Filter)
function searchBooks() {
    const term = searchInput.value.toLowerCase();
    
    // We filter the state and pass it to the render function
    const filteredBooks = library.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
    );
    
    renderUI(filteredBooks);
}

// 8. Function: Save to LocalStorage
function saveData() {
    localStorage.setItem('myLibrary', JSON.stringify(library));
}

// 9. Function: Render UI
function renderUI(dataToDisplay = library) {
    bookList.innerHTML = '';

    dataToDisplay.forEach(book => {
        const div = document.createElement('div');
        div.className = `book-item ${book.isBorrowed ? 'borrowed' : ''}`;
        div.innerHTML = `
            <div class="book-info">
                <strong>${book.title}</strong>
                <span>by ${book.author}</span>
            </div>
            <div class="book-actions">
                <button onclick="toggleStatus(${book.id})">
                    ${book.isBorrowed ? 'Return' : 'Borrow'}
                </button>
                <button class="delete-btn" onclick="removeBook(${book.id})">Remove</button>
            </div>
        `;
        bookList.appendChild(div);
    });

    calculateStats();
}

// 10. Function: Generate Statistics
function calculateStats() {
    let borrowedCount = 0;

    // Loop for statistics
    for (let i = 0; i < library.length; i++) {
        if (library[i].isBorrowed) {
            borrowedCount++;
        }
    }

    const total = library.length;
    const available = total - borrowedCount;

    // Update UI
    totalBooksEl.innerText = total;
    borrowedCountEl.innerText = borrowedCount;
    availableCountEl.innerText = available;
}
