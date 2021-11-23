const loaderEl = document.querySelector('.component-search__loader');
const form = document.querySelector('#form');
const myInput = document.querySelector('#myInput');
const resultsEl = document.querySelector('.component-search__results-list');
const counterEl = document.querySelector('.component-search__counter');

let field,
    API_KEY = "****",
    API_URL = "https://www.googleapis.com/youtube/v3/",
    maxResults=10,
    totalResults,
    videos

const renderResults = videos => {
  resultsEl.innerHTML = (
    videos.map( video => (
      `
        <li class="component-search__wrap-video">
          <div>
          </div>
        </li>
      `
    )).join('')
  )
}

const render = res => {
  counterEl.innerHTML = `${totalResults} resultats`;

  res ? renderResults( res ) : null
}

const fetchSearch = async(val) => {
  url = `${API_URL}search?key=${API_KEY}&part=snippet&q=${val}&maxResults=${maxResults}&type=video`
  
  await fetch(url)
  .then( data => data.json())
  .then( data =>  {
    
    if(data) {
      const { items, pageInfo } = data;
      totalResults = pageInfo.totalResults;
      videos = items.map( elt => elt);
      videos ? render(videos) : null;

      console.log(videos);
      //resultsPerPage, totalResults
    }
  })
  .catch( error => {
    console.log(error);
  })
}

const previewSearch = async(e) => {
    e.preventDefault();
    loaderEl.classList.remove('is-active');
    counterEl.innerHTML = '';

    field = myInput.value;
    
    if(field.trim().length === 0) {
      return;
    }

    if(field.length) {
      loaderEl.classList.add('is-active');
      await fetchSearch(field);
    }
}

window.addEventListener('load', () => {
  form.addEventListener('submit', previewSearch);
})





