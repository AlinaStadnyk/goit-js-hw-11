import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './partials/js/pixabay';
import { createMarkup } from './partials/js/render';

const selectors = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  btnSearch: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  guard: document.querySelector('.guard'),
};
const options = {
  rootMargin: '300px',
};

const observer = new IntersectionObserver(loadMore, options);

selectors.form.addEventListener('submit', handlerSearch);

function handlerSearch(evt) {
  selectors.gallery.innerHTML = '';
  evt.preventDefault();
  page = 1;
  console.log(evt);
  const request = evt.currentTarget[0].value;
  fetchPhotos(request, page)
    .then(response => {
      createMarkup(response.hits);

      const totalHits = response.totalHits;
      const totalPages = Math.ceil(totalHits / 40);
      if (page < totalPages) {
        observer.observe(selectors.guard);
      }

      if (totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`"Hooray! We found ${totalHits} images."`);
        const lightbox = new SimpleLightbox('.gallery a').refresh();
      }
    })

    .catch(err => {
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
}

let page = 1;

function loadMore(entries, observer) {
  console.log(entries);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchPhotos(page)
        .then(response => {
          createMarkup(response.hits);

          const totalHits = response.totalHits;
          const totalPages = Math.ceil(totalHits / 40);
          if (page < totalPages) {
            observer.observe(selectors.guard);
            const lightbox = new SimpleLightbox('.gallery a').refresh();
          }
        })
        .catch(err => {
          Notiflix.Notify.failure(
            'Oops! Something went wrong! Try reloading the page!'
          );
        });
    }
  });
}
