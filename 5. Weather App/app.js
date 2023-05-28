// get the input field and set a debounced search function to limit the number of API requests
const locationFormInput = document.getElementById('weather-location');
const debouncedSearch = debounce(searchLocations, 300);

// add event listeners to show, update and hide search results when the input field is focused, has text entered, and loses focus respectively
locationFormInput.addEventListener('focus', showSearchResults);
locationFormInput.addEventListener('input', showSearchResults);
locationFormInput.addEventListener('blur', hideSearchResults);

// limit the number of function calls in a given time period, in this case we are limiting the number of API requests to 1 every 300ms
function debounce(func, delay) {
  // create a variable to hold the timeout ID
  let timeoutId;

  // return a function to be called by the event handler
  return function (...args) {
    // if there is a timeout ID, clear it
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // set a timeout to call the function after a delay
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// hide the search results by setting the CSS class to 'hidden'
function hideSearchResults() {
  const locationResults = document.getElementById('location-results');
  locationResults.className = 'hidden';
}

// show the search results by setting the CSS class to 'visible' and perform a debounced search with the current input value
function showSearchResults() {
  const locationResults = document.getElementById('location-results');
  locationResults.className = 'visible';
  debouncedSearch(locationFormInput.value);
}

// perform an asynchronous search for locations based on the input value. If valid results are found they are displayed, if not then a message is displayed
async function searchLocations(location) {
  if (location) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=5`;

    try {
      const geocodingResponse = await fetch(geocodingUrl);
      if (!geocodingResponse.ok) {
        throw new Error(`HTTP error! Status: ${geocodingResponse.status}`);
      } else {
        const geocodingData = await geocodingResponse.json();
        if (geocodingData.results) {
          displayLocationResults(geocodingData.results);
        } else {
          displayNoLocationsFound();
        }
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}

// display a message when no search results are found
function displayNoLocationsFound() {
  const locationResults = document.getElementById('location-results');
  locationResults.innerHTML = '';
  const noLocation = document.createElement('li');
  noLocation.classList.add('no-location');
  noLocation.innerHTML = `<p>No locations found!</p>`;
  locationResults.appendChild(noLocation);
}

// create and display a list of location results
function displayLocationResults(locations) {
  const locationResults = document.getElementById('location-results');
  locationResults.innerHTML = '';

  // create a new li element for each location
  locations.forEach((location) => {
    const locationLi = document.createElement('li');
    locationLi.classList.add('location');
    locationLi.dataset.id = location.id;

    // if the location has an admin1 value, add it to the location string
    const locationString = location.admin1
      ? `${location.name} <span>${location.admin1}, ${location.country}</span>`
      : `${location.name} ${location.country}</span>`;

    // add the location string to the li element
    locationLi.innerHTML = `<p>${locationString}</p>`;

    // add the li element to the location results
    locationResults.appendChild(locationLi);
  });

  // add event listeners to each li element
  const locationLis = document.querySelectorAll('.location');
  locationLis.forEach((locationLi) => {
    // we use 'mousedown' here instead of 'click' because the 'click' event is fired after the blur event meaning that the location results would be hidden before the click event is fired by the blur event listener we made previously
    locationLi.addEventListener('mousedown', () => {
      handleLocationClick(locations, Number(locationLi.dataset.id));
    });
  });
}

// handle what happens when a location result is clicked, clear the search results and retrieve the weather data for the selected location
function handleLocationClick(locations, locationId) {
  const location = locations.find((location) => location.id === locationId);
  console.log(location);
  const locationResults = document.getElementById('location-results');
  locationResults.innerHTML = '';
  getWeatherData(location);
}

// get weather data from the Open Meteo API
async function getWeatherData({ name, admin1, country, latitude, longitude }) {
  // construct the location string, including the admin1 if it exists
  const locationString = admin1 ? `${name}, ${admin1}, ${country}` : `${name}, ${country}`;

  // define the variables we want to request from the API
  const hourlyVars = ['precipitation_probability', 'surface_pressure'].join(',');
  const dailyVars = ['temperature_2m_min', 'temperature_2m_max', 'uv_index_max'].join(',');

  // construct the URL to request the data from the API
  const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto&hourly=${hourlyVars}&daily=${dailyVars}`;

  // fetch the data from the API
  try {
    const weatherResponse = await fetch(weatherApiUrl);
    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
    } else {
      const weatherData = await weatherResponse.json();
      displayWeatherData(
        locationString,
        weatherData.current_weather,
        weatherData.hourly,
        weatherData.daily
      );
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// take in weather data and update the displayed weather data in the DOM
function displayWeatherData(locationString, currentWeather, hourly, daily) {
  // get the weather data via destructuring
  const { temperature, time, windspeed, weathercode } = currentWeather;
  const { precipitation_probability, surface_pressure } = hourly;
  const { temperature_2m_min, temperature_2m_max, uv_index_max } = daily;

  // animate weather grid and cards
  animateWeatherGrid();
  animateWeatherData();

  // display the weather data in the DOM
  document.getElementById('today-location').innerHTML = locationString;
  document.getElementById('today-time').textContent = formatDate(time);
  document.getElementById('today-temp').innerHTML = `${temperature}&deg;`;
  document.getElementById('today-min').innerHTML = `${temperature_2m_min[0]}&deg;`;
  document.getElementById('today-max').innerHTML = `${temperature_2m_max[0]}&deg;`;

  const weatherCondition = getWeatherCondition(weathercode);
  document.getElementById('today-conditions').textContent = weatherCondition;
  document.getElementById('today-wind').textContent = `${windspeed} MPH`;
  document.getElementById('today-rain').textContent = `${precipitation_probability[0]}%`;
  document.getElementById('today-pressure').textContent = `${surface_pressure[0]} hPa`;
  document.getElementById('today-uv').textContent = uv_index_max[0];

  document.querySelector(
    '.weather-grid__weather'
  ).style.backgroundImage = `url(./img/${weatherCondition.toLowerCase()}.jpg)`;
}

// expand the weather grid to display the weather data
function animateWeatherGrid() {
  const weatherGrid = document.querySelector('.weather-grid');
  weatherGrid.style.maxHeight = '1000px';
  weatherGrid.style.marginTop = '16px';
}

// animate the weather data cards
function animateWeatherData() {
  // get the weather elements
  const weather = document.querySelector('.weather-grid__weather');
  const wind = document.querySelector('.weather-grid__wind');
  const rain = document.querySelector('.weather-grid__rain');
  const pressure = document.querySelector('.weather-grid__pressure');
  const uvIndex = document.querySelector('.weather-grid__uv-index');

  // define animation delays
  const WEATHER_DELAY = 100;
  const WIND_DELAY = 100;
  const RAIN_DELAY = 100;
  const PRESSURE_DELAY = 100;
  const UV_INDEX_DELAY = 100;

  // animate each element one-after another
  setTimeout(() => {
    weather.classList.remove('weather-card--hidden');
  }, WEATHER_DELAY);

  setTimeout(() => {
    wind.classList.remove('weather-card--hidden');
  }, WIND_DELAY);

  setTimeout(() => {
    rain.classList.remove('weather-card--hidden');
  }, RAIN_DELAY);

  setTimeout(() => {
    pressure.classList.remove('weather-card--hidden');
  }, PRESSURE_DELAY);

  setTimeout(() => {
    uvIndex.classList.remove('weather-card--hidden');
  }, UV_INDEX_DELAY);
}

// take in a date string and format it for display
function formatDate(dateString) {
  const date = new Date(dateString);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // pad the minutes with a 0 if less than 10
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // return the formatted date
  return `Local time: ${hours}:${minutes} ${ampm}`;
}

// take the weather code and return the corresponding weather condition
function getWeatherCondition(weatherCode) {
  let condition = '';

  if ([0].includes(weatherCode)) {
    condition = 'Clear';
  } else if ([1, 2, 3].includes(weatherCode)) {
    condition = 'Cloudy';
  } else if ([45, 48].includes(weatherCode)) {
    condition = 'Fog';
  } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(weatherCode)) {
    condition = 'Rain';
  } else if ([71, 73, 75, 77, 80, 81, 82, 85, 86].includes(weatherCode)) {
    condition = 'Snow';
  } else if ([95, 96, 99].includes(weatherCode)) {
    condition = 'Thunderstorm';
  } else {
    condition = 'Unknown';
  }

  return condition;
}
