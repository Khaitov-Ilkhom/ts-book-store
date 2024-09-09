"use strict";
const createForm = document.querySelector("#createForm");
const bookListContainer = document.querySelector("#bookListContainer");
let bookList = JSON.parse(localStorage.getItem("books")) || [];
class Book {
    bookId;
    bookName;
    bookAuthor;
    bookPages;
    bookGenre;
    bookPrice;
    bookStatus;
    bookStock;
    constructor(bookName, bookAuthor, bookPages, bookGenre, bookPrice, bookStock) {
        this.bookId = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
        this.bookName = bookName;
        this.bookAuthor = bookAuthor;
        this.bookPages = bookPages;
        this.bookGenre = bookGenre;
        this.bookPrice = bookPrice;
        this.bookStock = bookStock;
        this.bookStatus = "available";
    }
    addToBookList() {
        // @ts-ignore
        bookList.push(this);
        localStorage.setItem("books", JSON.stringify(bookList));
    }
}
class Render {
    renderBooks(bookList) {
        if (bookList.length == 0)
            return bookListContainer.innerHTML = '<div class="flex justify-center w-full text-slate-500 text-xl">No books available for now</div>';
        while (bookListContainer.firstChild) {
            bookListContainer.removeChild(bookListContainer.firstChild);
        }
        bookList.forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("card");
            bookElement.innerHTML = `
        <div class="w-full flex justify-center items-start rounded gap-4">
          <div>
           <img src="${book.bookImage}" alt="${book.bookName}" width="150" class="rounded" />
          </div>
          <div class="flex-1">
            <h3 class="text-3xl text-black">${book.bookName}</h3>
            <p class="text-gray-700">${book.bookAuthor}</p>
            <p class="text-gray-700">Stock: ${book.bookStock}</p>
            <p class="text-gray-600 capitalize">${book.bookStatus}</p>
            <strong class="text-2xl mt-4 block text-black">$${book.bookPrice}</strong>
          </div>
        </div>
        <div data-book-id="${book.bookId}" class="flex flex-col gap-4 mt-[5px]">
          <button class="py-1 px-3 rounded text-white bg-black">Edit</button>
          <button class="py-1 px-3 rounded text-white bg-gray-500">Update</button>
          <button id="deleteBtn" class="py-1 px-3 rounded text-white bg-gray-700">Delete</button>
        </div>`;
            bookListContainer.appendChild(bookElement);
        });
    }
}
const render = new Render();
const handleDeleteBook = (e) => {
    const eventTarget = e.target;
    switch (eventTarget.id) {
        case "deleteBtn":
            const bookId = eventTarget.parentElement?.dataset.bookId;
            const book = bookList.find((book) => book.bookId === bookId);
            if (!book)
                return;
            const userAgreeToDelete = confirm(`Are you really going to delete ${book.bookName}?`);
            if (userAgreeToDelete) {
                bookList = bookList.filter((book) => book.bookId != bookId);
                localStorage.setItem("books", JSON.stringify(bookList));
                render.renderBooks(bookList);
            }
            break;
    }
};
bookListContainer.addEventListener("click", handleDeleteBook);
const handleCreateBook = (e) => {
    e.preventDefault();
    const inputs = createForm.querySelectorAll('input, select');
    const values = Array.from(inputs).map((input) => {
        const inputElement = input;
        if (inputElement.id == "bookPrice" || inputElement.id == "bookStock") {
            return +inputElement.value;
        }
        return inputElement.value;
    });
    const newBook = new Book(...values);
    newBook.addToBookList();
    render.renderBooks(bookList);
};
createForm.addEventListener("submit", handleCreateBook);
render.renderBooks(bookList);
