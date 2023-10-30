import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  btnSearch: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
};

selectors.form.addEventListener('submit', handlerSearch);

async function handlerSearch(evt) {
  evt.preventDefault();
  const request = evt.currentTarget[0].value;
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40365065-ce88301315fd1f49aec04ac88';
  const params = new URLSearchParams({
    key: API_KEY,
    q: request,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  const data = response.data;
  console.log(data);
  const totalHits = data.totalHits;
  console.log(data.hits);
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        views,
        tags,
        likes,
        comments,
        downloads,
      }) =>
        `
      <div class="photo-card">
   <a class = "gallery-link" href="${largeImageURL}"><img width = 100px src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>${likes} Likes</b>
    </p>
    <p class="info-item">
      <b>${views} Views</b>
    </p>
    <p class="info-item">
      <b>${comments} Comments</b>
    </p>
    <p class="info-item">
      <b>${downloads} Downloads</b>
    </p>
  </div>
</div>

      
      `
    )
    .join('');
  selectors.gallery.innerHTML = markup;

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`"Hooray! We found ${totalHits}images."`);
    const lightbox = new SimpleLightbox('.gallery a').refresh();
  }
}
