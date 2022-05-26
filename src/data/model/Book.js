const {nanoid} = require('nanoid');

/**
 * @type {Book}
 */
class Book {
  /**
   * Book constructor
   * @param {{
   * name: string,
   * year: number,
   * author: string,
   * summary: string,
   * publisher: string,
   * pageCount: number,
   * readPage: number,
   * reading: boolean
   * }} payload
   */
  constructor(payload) {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = payload;
    // validation
    if (!name || readPage > pageCount) {
      throw new Error(`Gagal menambahkan buku. ${!name?
      'Mohon isi nama buku' : 'readPage tidak boleh lebih besar dari pageCount'
      }`,
      );
    }

    this.id = nanoid(16);
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.finished = this.readPage === this.pageCount;
    this.reading = reading;
    this.insertedAt = new Date().toISOString();
    this.updatedAt = this.insertedAt;
  }
}

module.exports = Book;
