import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40365065-ce88301315fd1f49aec04ac88';

async function fetchPhotos(query, pages) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
  });
  return await axios.get(`${BASE_URL}?${params}`).then(response => {
    return response.data;
  });
}
export { fetchPhotos };
