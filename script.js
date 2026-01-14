// 1. Storage
let myLibrary = [];

// 2. Book Constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = Number(pages); // Fix: Ensure pages is a number
    this.read = Boolean(read);  // Fix: Ensure read is a boolean
}

// 3. Logic to add book
function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    render(); // Update UI
}

// 4. Update Catalog and Stats
function render() {
    const libraryContainer = document.getElementById('library-container');
    const totalBooksEl = document.getElementById('total-books');
    const readPercentageEl = document.getElementById('read-percentage');

    // FIX 1: Clear the container every time to remove "Empty" message & old cards
    libraryContainer.innerHTML = '';

    if (myLibrary.length === 0) {
        libraryContainer.innerHTML = '<p class="empty-msg">The library is empty</p>';
        totalBooksEl.textContent = '0';
        readPercentageEl.textContent = '0%';
        return;
    }

    // FIX 2: Re-calculate stats accurately
    const total = myLibrary.length;
    const readCount = myLibrary.filter(book => book.read).length;
    const percentage = Math.floor((readCount / total) * 100);

    // Update Stats Display
    totalBooksEl.textContent = total;
    readPercentageEl.textContent = `${percentage}%`;

    // 5. Draw the Cards
    myLibrary.forEach((book, index) => {
        const card = document.createElement('div');
        card.classList.add('book-card');
        
        card.innerHTML = `
            <div class="card-content">
                <h3>${book.title}</h3>
                <p>By ${book.author}</p>
                <p>${book.pages} pages</p>
                <button class="status-btn ${book.read ? 'is-read' : ''}" onclick="toggleRead(${index})">
                    ${book.read ? 'Read' : 'Not Read'}
                </button>
                <button class="remove-btn" onclick="removeBook(${index})">Remove</button>
            </div>
        `;
        libraryContainer.appendChild(card);
    });
}

// 6. Interaction Functions
function removeBook(index) {
    myLibrary.splice(index, 1);
    render();
}

function toggleRead(index) {
    myLibrary[index].read = !myLibrary[index].read;
    render();
}

// 7. Event Listeners for your Form
const bookForm = document.getElementById('add-book-form');
if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = document.getElementById('pages').value;
        const read = document.getElementById('read-status').checked;

        addBookToLibrary(title, author, pages, read);
        
        // Reset form and close modal if you have one
        bookForm.reset();
    });
}

// Initial call to show "Empty" state
render();;

