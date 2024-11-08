class BooksList {
  constructor() {
    this.favBooks = [];
    this.filters = [];
    this.init();
  }

  init() {
    this.getElements();
    this.render();
    this.initActions();
  }

  getElements() {
    this.bookList = document.querySelector('.books-list');
    this.template = Handlebars.compile(document.querySelector('#template-book').innerHTML);
    this.filterForm = document.querySelector('.filters');
  }

  determineRatingBgc(rating) {
    if (rating < 6) {
      return "linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)";
    } else if (rating > 6 && rating <= 8) {
      return "linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)";
    } else if (rating > 8 && rating <= 9) {
      return "linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)";
    } else if (rating > 9) {
      return "linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)";
    }
  }

  render() {
    for (const book of dataSource.books) {
      const ratingBgc = this.determineRatingBgc(book.rating);
      const ratingWidth = book.rating * 10;

      const generatedHTML = this.template({
        ...book,
        ratingBgc: ratingBgc,
        ratingWidth: ratingWidth,
      });
      
      const li = document.createElement('li');
      li.innerHTML = generatedHTML;
      this.bookList.appendChild(li);
    }
  }

  initActions() {
    this.bookList.addEventListener('dblclick', (event) => this.handleFavorite(event));
    this.filterForm.addEventListener('click', (event) => this.handleFilter(event));
  }

  handleFavorite(event) {
    const bookId = event.target.offsetParent.getAttribute('data-id');

    if (event.target.offsetParent.classList.contains('book__image')) {
      event.preventDefault();
      if (this.favBooks.includes(bookId)) {
        event.target.offsetParent.classList.remove('favorite');
        this.favBooks = this.favBooks.filter((id) => id !== bookId);
      } else {
        event.target.offsetParent.classList.add('favorite');
        this.favBooks.push(bookId);
      }
    }
  }

  handleFilter(event) {
    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
      if (event.target.checked) {
        this.filters.push(event.target.value);
      } else {
        const filterIndex = this.filters.indexOf(event.target.value);
        if (filterIndex !== -1) {
          this.filters.splice(filterIndex, 1);
        }
      }
      this.hideBooks();
    }
  }

  hideBooks() {
    for (const book of dataSource.books) {
      const bookImage = document.querySelector(`.book__image[data-id="${book.id}"]`);
      bookImage.classList.remove('hidden');
      
      if (
        (this.filters.includes('adults') && !book.details.adults) ||
        (this.filters.includes('nonFiction') && !book.details.nonFiction)
      ) {
        bookImage.classList.add('hidden');
      }
    }
  }
}

const app = new BooksList();
