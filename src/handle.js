const { nanoid } = require('nanoid');
const books = require('./Book');

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const timestamp = new Date().toISOString();
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt: timestamp, updatedAt: timestamp,
  };

  books.push(newBook);

  return books.some((book) => book.id === id) ?
    h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } }).code(201) :
    h.response({ status: 'error', message: 'Buku gagal ditambahkan' }).code(500);
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;
  if (name) filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  if (reading !== undefined) filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  if (finished !== undefined) filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  }).code(200);
};

const getBookById = (request, h) => {
  const book = books.find((b) => b.id === request.params.id);
  return book ?
    h.response({ status: 'success', data: { book } }).code(200) :
    h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
};

const updateBookById = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name, year, author, summary, publisher, pageCount, readPage, reading,
      updatedAt: new Date().toISOString(),
    };
    return h.response({ status: 'success', message: 'Buku berhasil diperbarui' }).code(200);
  }

  return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }).code(404);
};

const deleteBookById = (request, h) => {
  const bookIndex = books.findIndex((book) => book.id === request.params.id);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    return h.response({ status: 'success', message: 'Buku berhasil dihapus' }).code(200);
  }
  return h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }).code(404);
};

module.exports = { addBook, getAllBooks, getBookById, updateBookById, deleteBookById };
