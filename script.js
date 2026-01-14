let myLibrary = [];

function Book(title, author, pages, read, borrowed, borrower) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.borrowed = borrowed;
    this.borrower = borrower;
}

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

function render() {
    const libraryGrid = document.getElementById('library-grid');
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    libraryGrid.innerHTML = ""; 

    // Filter books based on search input
    const filteredLibrary = myLibrary.filter(book => 
        book.title.toLowerCase().includes(searchQuery) || 
        book.author.toLowerCase().includes(searchQuery)
    );

    if (filteredLibrary.length === 0) {
        libraryGrid.innerHTML = '<p class="empty-msg">No books found.</p>';
        updateStats();
        return;
    }

    filteredLibrary.forEach((book) => {
        const originalIndex = myLibrary.indexOf(book);
        const card = document.createElement('div');
        card.classList.add('book-card');
        if (book.borrowed) card.classList.add('borrowed');

        card.innerHTML = `
            ${book.borrowed ? `<span class="borrower-tag">Borrowed by: ${book.borrower}</span>` : ''}
            <h3>${book.title}</h3>
            <p>By ${book.author} | ${book.pages} pages</p>
            <button class="status-btn ${book.read ? 'is-read' : ''}" onclick="toggleRead(${originalIndex})">
                ${book.read ? 'Read' : 'Not Read'}
            </button>
            <button class="borrow-btn" onclick="toggleBorrow(${originalIndex})">
                ${book.borrowed ? 'Return Book' : 'Loan Book'}
            </button>
            <button class="remove-btn" onclick="removeBook(${originalIndex})">Remove</button>
        `;
        libraryGrid.appendChild(card);
    });

    updateStats();
    saveToLocal();
}

function updateStats() {
    const total = myLibrary.length;
    const readCount = myLibrary.filter(b => b.read).length;
    const percent = total > 0 ? Math.floor((readCount / total) * 100) : 0;
    document.getElementById('total-books').textContent = total;
    document.getElementById('read-percentage').textContent = `${percent}%`;
}

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
    myLibrary.splice(index, 1);
    render();
}

document.getElementById('add-book-form').addEventListener('submit', (e) => {
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

restoreFromLocal();
if (myLibrary.length === 0) render();;




