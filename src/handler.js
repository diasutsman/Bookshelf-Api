const books = require('./data/books');
const Book = require('./data/model/Book');

const addBookHandler = (request, h) => {
  try {
    const book = new Book(request.payload);
    books.push(book);
    if (books.some(({id}) => id === book.id)) {
      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          'bookId': book.id,
        },
      }).code(201);
    }

    return h.response({
      'status': 'error',
      'message': 'Buku gagal ditambahkan',
    }).code(500);
  } catch (error) {
    return h.response({
      'status': 'fail',
      'message': error.message,
    }).code(400);
  }
};

const getAllBooksHandler = (req) => {
  const {name, reading, finished} = req.query;
  return {
    'status': 'success',
    'data': {
      books: books.filter((book) =>
        Object.keys(req.query).length == 0 ||
        name != undefined &&
        book.name.toLowerCase().includes(name.toLowerCase()) ||
        reading != undefined && book.reading == parseInt(reading) ||
        finished != undefined && book.finished == parseInt(finished),
      ).map(({id, name, publisher}) => ({id, name, publisher})),
    },
  };
};

const getBookById = (req, h) => {
  const book = books.find(({id: bookId}) => bookId === req.params.bookId);

  if (!book) {
    return h.response({
      'status': 'fail',
      'message': 'Buku tidak ditemukan',
    }).code(404);
  }

  return {
    'status': 'success',
    'data': {
      book,
    },
  };
};

const editBookById = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;
  const book = books.find(({id: bookId}) => bookId === req.params.bookId);
  if (!name || readPage > pageCount || !book) {
    return h.response({
      'status': 'fail',
      'message': `Gagal memperbarui buku. ${!name ? 'Mohon isi nama buku' :
        readPage > pageCount ?
          'readPage tidak boleh lebih besar dari pageCount' :
          'Id tidak ditemukan'
      }`,
    }).code(!name || readPage > pageCount ? 400 : 404);
  }

  Object.assign(book, {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  });

  return {
    'status': 'success',
    'message': 'Buku berhasil diperbarui',
  };
};

const deleteBookById = (req, h) => {
  const {bookId} = req.params;
  const bookIndex = books.findIndex(({id}) => id === bookId);
  if (bookIndex < 0) {
    return h.response({
      'status': 'fail',
      'message': 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(bookIndex, 1);

  return {
    'status': 'success',
    'message': 'Buku berhasil dihapus',
  };
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookById, editBookById, deleteBookById,
};
