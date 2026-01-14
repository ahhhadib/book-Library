// 1. Setup the Library array
let myLibrary = [];

// 2. Book Constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = Number(pages); // Ensures math works
    this.read = read; // Expected to be boolean
}

// 3. Add Book to Library
function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    render(); // Refresh the UI
}

// 4. Update Stats (Percentage and Counts)
function updateStats() {
    const totalBooks = myLibrary.length;
    const booksRead = myLibrary.filter(book => book.read).length;
    
    // Calculate percentage correctly
    const percentage = totalBooks > 0 ? Math.floor((booksRead / totalBooks) * 100) : 0;

    // Update the DOM elements (Update these IDs to match your HTML)
    document.getElementById('total-books').textContent = totalBooks;
    document.getElementById('read-books').textContent = booksRead;
    document.getElementById('read-percentage').textContent = `${percentage}%`;
}

// 5. Render the Library to the UI
function render() {
    const libraryContainer = document.querySelector('.library-grid');
    const emptyMessage = document.getElementById('empty-message');

    // FIX: Clear existing cards to prevent duplicates and remove "Empty" message
    libraryContainer.innerHTML = '';

    if (myLibrary.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        updateStats();
        return;
    } else {
        if (emptyMessage) emptyMessage.style.display = 'none';
    }

    // Create a card for each book
    myLibrary.forEach((book, index) => {
        const card = document.createElement('div');
        card.classList.add('book-card');
        card.setAttribute('data-index', index);

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>By: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <button class="status-btn">${book.read ? 'Read' : 'Not Read'}</button>
            <button class="delete-btn">Remove</button>
        `;

        // Logic for Toggle Read Status
        card.querySelector('.status-btn').addEventListener('click', () => {
            book.read = !book.read;
            render();
        });

        // Logic for Delete
        card.querySelector('.delete-btn').addEventListener('click', () => {
            myLibrary.splice(index, 1);
            render();
        });

        libraryContainer.appendChild(card);
    });

    updateStats();
}

// 6. Form Handling
const bookForm = document.getElementById('add-book-form');
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read-status').checked;

    addBookToLibrary(title, author, pages, read);
    bookForm.reset(); // Clear the form
});
