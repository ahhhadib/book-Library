// 1. Data Store
let myLibrary = [];

// 2. Book Constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = Number(pages);
    this.read = read;
}

// 3. The Core "Fix" Function (The Renderer)
function render() {
    const libraryGrid = document.getElementById('library-grid');
    const totalDisplay = document.getElementById('total-books');
    const percentDisplay = document.getElementById('read-percentage');

    // Step A: Clear the grid completely (Fixes "Empty" message bug)
    libraryGrid.innerHTML = "";

    // Step B: Check if library is empty
    if (myLibrary.length === 0) {
        libraryGrid.innerHTML = '<p class="empty-msg">Your library is currently empty.</p>';
        totalDisplay.textContent = "0";
        percentDisplay.textContent = "0%";
        return;
    }

    // Step C: Calculate Stats (Fixes Percentage bug)
    const total = myLibrary.length;
    const readCount = myLibrary.filter(book => book.read).length;
    const percentage = Math.floor((readCount / total) * 100);

    totalDisplay.textContent = total;
    percentDisplay.textContent = `${percentage}%`;

    // Step D: Create Book Cards
    myLibrary.forEach((book, index) => {
        const card = document.createElement('div');
        card.classList.add('book-card');
        
        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>By ${book.author}</p>
            <p>${book.pages} Pages</p>
            <button onclick="toggleRead(${index})" class="${book.read ? 'read-true' : 'read-false'}">
                ${book.read ? 'Read' : 'Not Read'}
            </button>
            <button onclick="removeBook(${index})" class="delete-btn">Remove</button>
        `;
        libraryGrid.appendChild(card);
    });
}

// 4. Interaction Logic
function removeBook(index) {
    myLibrary.splice(index, 1);
    render(); // Redraw everything
}

function toggleRead(index) {
    myLibrary[index].read = !myLibrary[index].read;
    render(); // Redraw everything
}

// 5. Form Handling
const bookForm = document.getElementById('add-book-form');
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read-status').checked;

    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    
    render(); // Draw the new book and update percentage
    bookForm.reset(); // Clear form fields
});

// Run once on load to show initial empty state
render();


