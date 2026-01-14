let myLibrary = [];

function Book(title, author, pages, read, borrowed, borrower) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.borrowed = borrowed;
    this.borrower = borrower;
}

function render() {
    const libraryGrid = document.getElementById('library-grid');
    libraryGrid.innerHTML = ""; // This cleans the "Empty" message

    if (myLibrary.length === 0) {
        libraryGrid.innerHTML = '<p class="empty-msg">The library is empty.</p>';
        updateStats(0, 0);
        return;
    }

    myLibrary.forEach((book, index) => {
        const card = document.createElement('div');
        card.classList.add('book-card');
        if (book.borrowed) card.classList.add('borrowed');

        card.innerHTML = `
            ${book.borrowed ? `<span class="borrower-tag">Borrowed by: ${book.borrower}</span>` : ''}
            <h3>${book.title}</h3>
            <p>By ${book.author} | ${book.pages} pages</p>
            <button class="status-btn ${book.read ? 'is-read' : ''}" onclick="toggleRead(${index})">
                ${book.read ? 'Read' : 'Not Read'}
            </button>
            <button class="borrow-btn" onclick="toggleBorrow(${index})">
                ${book.borrowed ? 'Return Book' : 'Loan Book'}
            </button>
            <button class="remove-btn" onclick="removeBook(${index})">Remove</button>
        `;
        libraryGrid.appendChild(card);
    });

    const readCount = myLibrary.filter(b => b.read).length;
    updateStats(myLibrary.length, readCount);
}

function updateStats(total, read) {
    const percent = total > 0 ? Math.floor((read / total) * 100) : 0;
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

render(); // Start empty


