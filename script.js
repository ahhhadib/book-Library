// 1. DATA INITIALIZATION
let myLibrary = [];

// 2. BOOK CONSTRUCTOR
function Book(title, author, pages, read, borrowed, borrower) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.borrowed = borrowed;
    this.borrower = borrower;
}

// 3. STORAGE LOGIC
function saveToLocal() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function restoreFromLocal() {
    const savedData = localStorage.getItem('myLibrary');
    if (savedData) {
        myLibrary = JSON.parse(savedData);
        render();
    }
}

// 4. THE RENDER ENGINE (Handles display, filtering, and highlighting)
function render() {
    const libraryGrid = document.getElementById('library-grid');
    const searchInput = document.getElementById('search-bar');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
    
    // Clear the grid to prevent duplicates and remove "Empty" message
    libraryGrid.innerHTML = ""; 

    // Filter books based on search input
    const filteredLibrary = myLibrary.filter(book => 
        book.title.toLowerCase().includes(searchQuery) || 
        book.author.toLowerCase().includes(searchQuery)
    );

    // Handle Empty States
    if (filteredLibrary.length === 0) {
        if (myLibrary.length === 0) {
            libraryGrid.innerHTML = '<p class="empty-msg">Your library is currently empty.</p>';
        } else {
            libraryGrid.innerHTML = '<p class="empty-msg">No books match your search.</p>';
        }
        updateStats();
        return;
    }

    // Create and Display Book Cards
    filteredLibrary.forEach((book) => {
        // Find the index in the ORIGINAL array so buttons work correctly
        const originalIndex = myLibrary.indexOf(book);
        
        const card = document.createElement('div');
        card.classList.add('book-card');
        if (book.borrowed) card.classList.add('borrowed');

        // Highlight matching text to "point" to search results
        const highlightedTitle = highlightText(book.title, searchQuery);
        const highlightedAuthor = highlightText(book.author, searchQuery);

        card.innerHTML = `
            ${book.borrowed ? `<span class="borrower-tag">Borrowed by: ${book.borrower}</span>` : ''}
            <h3>${highlightedTitle}</h3>
            <p>By ${highlightedAuthor} | ${book.pages} pages</p>
            <div class="card-buttons">
                <button class="status-btn ${book.read ? 'is-read' : ''}" onclick="toggleRead(${originalIndex})">
                    ${book.read ? 'Read' : 'Not Read'}
                </button>
                <button class="borrow-btn" onclick="toggleBorrow(${originalIndex})">
                    ${book.borrowed ? 'Return' : 'Loan'}
                </button>
                <button class="remove-btn" onclick="removeBook(${originalIndex})">Remove</button>
            </div>
        `;
        libraryGrid.appendChild(card);
    });

    updateStats();
    saveToLocal();
}

// 5. SEARCH HIGHLIGHTER
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 6. STATISTICS LOGIC
function updateStats() {
    const total = myLibrary.length;
    const readCount = myLibrary.filter(b => b.read).length;
    const percent = total > 0 ? Math.floor((readCount / total) * 100) : 0;
    
    const totalDisplay = document.getElementById('total-books');
    const percentDisplay = document.getElementById('read-percentage');
    
    if (totalDisplay) totalDisplay.textContent = total;
    if (percentDisplay) percentDisplay.textContent = `${percent}%`;
}

// 7. INTERACTION FUNCTIONS
function toggleRead(index) {
    myLibrary[index].read = !myLibrary[index].read;
    render();
}

function toggleBorrow(index) {
    const book = myLibrary[index];
    if (!book.borrowed) {
        const name = prompt("Who is borrowing this book?");
        if (name) {
            book.borrowed = true;
            book.borrower = name;
        }
    } else {
        book.borrowed = false;
        book.borrower = "";
    }
    render();
}

function removeBook(index) {
    if (confirm("Are you sure you want to remove this book?")) {
        myLibrary.splice(index, 1);
        render();
    }
}

// 8. FORM HANDLING
const bookForm = document.getElementById('add-book-form');
if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = document.getElementById('pages').value;
        const read = document.getElementById('read-status').checked;
        const isBorrowed = document.getElementById('is-borrowed').checked;
        const borrower = document.getElementById('borrower-name').value;

        myLibrary.push(new Book(title, author, pages, read, isBorrowed, borrower));
        render();
        e.target.reset();
    });
}

// 9. INITIALIZATION
// Load from storage and perform initial render
restoreFromLocal();
if (myLibrary.length === 0) render();





