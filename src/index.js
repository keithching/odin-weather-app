import './style.css';


// async function for fetching data from API
async function getWeatherData(location) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${appData.API_key}&units=metric`; // request in Degree Celcius 
    
    try {
        let response = await fetch(url, {mode: 'cors'});
        let json = await response.json();

        // return a weather data object
        return {
            name: json.name,
            country: json.sys.country,
            temperatureCurrent: Math.round(json.main.temp),
            temperatureMax: Math.round(json.main.temp_max),
            temperatureMin: Math.round(json.main.temp_min),
            humidity: json.main.humidity,
            description: json.weather[0].description,
            icon: json.weather[0].icon
        };
    } catch(err) { // error handling
        console.log(err);
    }

}

// Global Variables
const appData = (() => {

    const API_key = '50961b12617c36252eefc77b52a622c8'; // leave it here for this project
    let degreeCelsius = true; // toggle between degree C and degree F
    let weatherData;

    return {API_key, degreeCelsius, weatherData};
})();


// process the form data
const locationInput = document.querySelector('#locationInput');
const form = document.querySelector('form');
form.addEventListener('submit', () => {
    let location = locationInput.value;
    const errorMsg = document.getElementById('errorMsg');
    const loading = document.querySelector('.loading');
    loading.textContent = 'loading'; // loading msg when form is submitted
    
    // degree unit
    if (appData.degreeCelsius) {
        const celsius = document.getElementById('celsius');
        celsius.classList.add('active'); // default
    }

    // fetch the data from API and console log
    getWeatherData(location)
    .then(data => {

        appData.weatherData = data; // save the fetch data into a variable

        errorMsg.textContent = ''; // clear errorMsg
        loading.textContent = ''; // clear loading msg

        // clear DOM icon
        const icon = document.getElementById('icon');
        while (icon.firstChild) {
            icon.removeChild(icon.firstChild);
        }

        // displaying to DOM
        const city = document.getElementById('city');
        const description = document.getElementById('description');
        const humidity = document.getElementById('humidity');
        
        city.textContent = appData.weatherData.name;
        description.textContent = appData.weatherData.description;
        const iconImg = new Image();
        iconImg.src = `http://openweathermap.org/img/wn/${appData.weatherData.icon}@2x.png`;
        icon.appendChild(iconImg);
        humidity.textContent = `humidity ${appData.weatherData.humidity}%`;
        showTemperature();

    })
    .catch(err => {
        loading.textContent = ''; // clear loading msg
        errorMsg.textContent = 'Not Found. Please try again'; // display error msg
    })

    event.preventDefault(); // don't send out the form to the server
});


// function for toggling between degree C and degree F
function showTemperature() {
    const temp_current = document.getElementById('temp_current');
    const temp_max = document.getElementById('temp_max');
    const temp_min = document.getElementById('temp_min');

    if (appData.degreeCelsius) {
        temp_current.textContent = appData.weatherData.temperatureCurrent + '°';
        temp_max.textContent = `highest ${appData.weatherData.temperatureMax}°`;
        temp_min.textContent = `lowest ${appData.weatherData.temperatureMin}°`;
    } else {
        temp_current.textContent = `${Number(appData.weatherData.temperatureCurrent * 2 + 30)}°`;
        temp_max.textContent = `highest ${Number(appData.weatherData.temperatureMax * 2 + 30)}°`;
        temp_min.textContent = `lowest ${Number(appData.weatherData.temperatureMin * 2 + 30)}°`;
    }
}


// event listeners for toggling between degree units
const unit = document.getElementById('unit');
const array = Array.from(unit.children);

array.forEach(item => {
    item.addEventListener('click', () => {
        if (item.id !== '') {
            const celsius = document.getElementById('celsius');
            const fahranheit = document.getElementById('fahranheit');
            celsius.classList.remove('active'); // default
            fahranheit.classList.remove('active'); // default

            if (item.id == 'celsius') {
                celsius.classList.add('active'); // default
                appData.degreeCelsius = true;
            } else if (item.id == 'fahranheit') {
                fahranheit.classList.add('active'); // default
                appData.degreeCelsius = false;
            }

            showTemperature();
        }
    });
});


