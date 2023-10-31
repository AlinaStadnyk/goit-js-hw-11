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
const lightbox = new SimpleLightbox('.gallery a').refresh();
let query = null;
let page = 1;

const observer = new IntersectionObserver(loadMore, options);

selectors.form.addEventListener('submit', handlerSearch);

function handlerSearch(evt) {
  selectors.gallery.innerHTML = '';
  evt.preventDefault();

  const request = evt.currentTarget[0].value;
  query = request;
  fetchPhotos(request, page)
    .then(async response => {
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

        await lightbox.refresh();
        slowScroll();
      }
    })

    .catch(err => {
      console.log(err);
    });
}

function loadMore(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      fetchPhotos(query, page)
        .then(async response => {
          createMarkup(response.hits);
          // const lightbox = new SimpleLightbox('.gallery a').refresh();
          await lightbox.refresh();
          slowScroll();
          const totalHits = response.totalHits;
          const totalPages = Math.floor(totalHits / 40);

          if (page >= totalPages) {
            observer.unobserve(selectors.guard);
            Notiflix.Notify.info(
              'You have now seen all the images matching your query!',
              {
                timeout: 5000,
              }
            );
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

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
