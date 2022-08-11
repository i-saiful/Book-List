// Define UI Element 
const form = document.querySelector('#form')
const bookList = document.querySelector('#book-list')

// Event Listener 
form.addEventListener('submit', addBook);
document.addEventListener('DOMContentLoaded', render);
bookList.addEventListener('click', removeBook);

// Book Class 
class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI Class 
class UI {
    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert ${className}`
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        container.insertBefore(div, form);
        
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000);
    }
}

// Store class
class Store {
    static getBook() {
        let books = JSON.parse(localStorage.getItem('books'))
        if(!books) {
            books = []
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
        render()
    }

    static pushBookList(books) {
        localStorage.setItem('books', JSON.stringify(books))
        render()
    }
}

// Add Book
function addBook(e) {
    e.preventDefault()
    const title = document.querySelector('#title')
    const author = document.querySelector('#author');
    const isbn = document.querySelector('#isbn');
    
    if(title.value && author.value && isbn.value) {
        const book = new Book(title.value, author.value, isbn.value);

        title.value = ''
        author.value = ''
        isbn.value = ''

        Store.addBook(book);
        UI.showAlert("Successfully Add Book", 'success');
    } else {
        UI.showAlert("Please fill up full form", 'error');
    }
}

// render display
function render() {
    let books = Store.getBook()
    let bookList = ''
    books.forEach(({title, author, isbn}) => {
        bookList += `<tr>
                        <td>${title}</td>
                        <td>${author}</td>
                        <td>${isbn}</td>
                        <td><a href="#">X</a></td>
                    </tr>`
    });
    document.querySelector('#book-list').innerHTML = bookList 
}

function removeBook(e) {
    if(e.target.hasAttribute('href')) {
        let isbn = e.target.parentElement.previousElementSibling.textContent.trim()
        let books = Store.getBook();
        books.forEach((book, index) => {
            if(isbn === book.isbn) {
                books.splice(index, 1)
            }
        })
        Store.pushBookList(books);
        UI.showAlert('Delete book', 'success')
    }
}