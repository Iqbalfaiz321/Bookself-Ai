
const {addBook, getAllBooks, getBookById, updateBookById, deleteBookById } = require("./handle")

const routes = [
    {
        method: "POST",
        path: "/books",
        handler: addBook
    },

    {
        method: "GET",
        path: "/books",
        handler: getAllBooks
    },
    {
        method : "GET",
        path: "/books/{id}",
        handler: getBookById
    },
    {
        method: "PUT",
        path: "/books/{id}",
        handler: updateBookById
    },
    {
        method: "DELETE",
        path: "/books/{id}",
        handler: deleteBookById
    }
];

module.exports = routes;