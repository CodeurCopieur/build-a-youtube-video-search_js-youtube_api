const loaderEl = document.querySelector('.component-search__loader');
const form = document.querySelector('#form');
const myInput = document.querySelector('#myInput');
const resultsEl = document.querySelector('.component-search__results-list');
const counterEl = document.querySelector('.component-search__counter');

const select = (s) => document.querySelector(s);

let field,
    API_KEY = "******",
    API_URL = "https://www.googleapis.com/youtube/v3/",
    maxResults=20,
    totalResults,
    videos,
    duration = 'any',
    order = 'revelance'

select('#duration').addEventListener('change', e => {
  duration = e.target.value;
});

select('#order').addEventListener('change', e => {
  order = e.target.value;
})


const renderResults = videos => {
  resultsEl.innerHTML = (
    videos.map( item => (
      `
        <li class="component-search__wrap-video">
          <a 
            href="http://www.youtube.com/watch?v=${item.id.videoId}"
            target="_blank">
            <div class="component-search__wrap-picture">
              <img src="${item.snippet.thumbnails.high.url}" alt="">
            </div>
          </a>
          <div class="component-search__wrap-texts">
            <h3 class="component-search__wrap-title">${item.snippet.title}</h3>
            <a 
              href="https://www.youtube.com/channel/${item.snippet.channelId}"
              target="_blank">
              <span class="component-search__wrap-title">${item.snippet.channelTitle}</span>
            </a>
            <p>${item.snippet.description}</p>
          </div>
        </li>
      `
    )).join('')
  )
};

const render = res => {
  loaderEl.classList.remove('is-active');
  counterEl.innerHTML = `${totalResults} resultats`;

  res ? renderResults( res ) : null;
};

const fetchSearch = async(val) => {
  url = `${API_URL}search?key=${API_KEY}&part=snippet&q=${val.split(" ").join("")}${duration != 'any' ? `&videoDuration=${duration}` : '' }${ order != 'revelance' ? `&order=${order}` : ''}&type=video&maxResults=${maxResults}`

  
  await fetch(url)
  .then( data => data.json())
  .then( data =>  {
    
    if(data) {
      const { items, pageInfo } = data;
      totalResults = pageInfo.totalResults;
      videos = items.map( elt => elt);
      videos ? render(videos) : null;

      console.log(data, url);
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





