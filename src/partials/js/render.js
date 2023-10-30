import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
const selectors = {
  gallery: document.querySelector('.gallery'),
};
function createMarkup(arr) {
  const markup = arr
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
}
export { createMarkup };
