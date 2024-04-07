const key = "f346aa8729f5e5b5257e045c0a45c973";

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

async function search(){
    const phrase = document.querySelector('input').value;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`)
    const data = await response.json();
    const ul = document.querySelector('form ul');
    ul.innerHTML = '';
    for(let i=0; i<data.length; i++){
        const city = data[i];
        ul.innerHTML += `<li 
        data-lat = ${city.lat} 
        data-lon = ${city.lon} 
        data-name = ${city.name}>
        ${city.name} <span>${city.country}</span></li>`
    } 
}

const debouncedSearch = debounce(() => {
    search()
    }, 600);

async function showSearchResult(lat, lon, name){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
    const data = await response.json();  
    const temp = Math.round(data.main.temp);
    const humidity = Math.round(data.main.humidity);
    const feelsLike = Math.round(data.main.feels_like);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon; 
    document.querySelector('.degree').innerHTML = temp + ' &#8451;';
    document.querySelector('.name').innerHTML = name;
    document.querySelector('#windValue').innerHTML = wind + ' <span>m/s</span>';
    document.querySelector('#feelsLikeValue').innerHTML = feelsLike + ' <span>&#8451;</span>';
    document.querySelector('#humidityValue').innerHTML = humidity + ' <span>%</span>';
    document.querySelector('.icon img').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('.info').style.display = 'block';
    document.querySelector('form').style.display = 'none';

}

document.querySelector("input").addEventListener('keyup', debouncedSearch);

document.body.addEventListener('click', ev => {
    const li = ev.target;
    const {lat, lon, name} = li.dataset;
    if(!lat){
        return ;
    }
    showSearchResult(lat, lon, name);
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    localStorage.setItem('name', name);

})

document.querySelector('#change').addEventListener('click', () => {
    document.querySelector('.info').style.display = 'none';    
    document.querySelector('form').style.display = 'block';
})

document.body.onload = () => {
    if(localStorage.getItem('lat')){
        const lon = localStorage.getItem( 'lon' );
        const lat = localStorage.getItem( 'lat');
        const name = localStorage.getItem( 'name' );
        showSearchResult(lat, lon, name);
    }
};

