const zurichButton = document.querySelector('#zurich');
const luzernButton = document.querySelector('#luzern');
const bernButton = document.querySelector('#bern');
const schaffhausenButton = document.querySelector('#schaffhausen');
const altdorfButton = document.querySelector('#altdorf');
const zermattButton = document.querySelector('#zermatt');
const churButton = document.querySelector('#chur');
const badenButton = document.querySelector('#baden');

const currentWeather = document.querySelector('#currentWeather');

function getAverageDayTemperature(temperaturePerHour, date) {
    const dayTemps = Array.from({ length: 6 }, () => temperaturePerHour.splice(0, 24));
    return dayTemps.map((temps, i) => {
        const nightSum = temps.slice(0, 6).reduce((a, b) => a + b, 0) + temps.slice(18, 24).reduce((a, b) => a + b, 0);
        const daySum = temps.slice(6, 18).reduce((a, b) => a + b, 0);
        const nightAverage = Math.round((nightSum / 12) * 10) / 10;
        const dayAverage = Math.round((daySum / 12) * 10) / 10;
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + i);
        return { date: new Date(currentDate).toLocaleDateString(), day: dayAverage, night: nightAverage };
    });
}

function createWeeklyTemperatureContainers(averages) {
    const weatherCards = document.getElementById('weatherCards');
    while (weatherCards.firstChild) {
        weatherCards.removeChild(weatherCards.firstChild);
    }

    averages.forEach(ave => {
        // Create wrapper for each pair of cards
        const wrapper = document.createElement('div');
        wrapper.classList.add('card-wrapper');

        // div für das Datum wird erstellt
        const dateCard = document.createElement('div');
        dateCard.classList.add('item');
        dateCard.classList.add('date');
        if (ave.date === new Date().toLocaleDateString()) {
            dateCard.textContent = 'Heute';
        } else if (ave.date === new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()) {
            dateCard.textContent = 'Morgen';
        } else {
            dateCard.textContent = ave.date;
        }
        wrapper.appendChild(dateCard);

        // div für die Temperatur wird erstellt
        const tempCard = document.createElement('div');
        tempCard.classList.add('item');
        tempCard.classList.add('temperature');
        tempCard.textContent = ave.day + "° / " + ave.night + "°";
        wrapper.appendChild(tempCard);

        // Falls Temperatur über 20 Grad, Feuerbild, sonst Eisbild
        if (ave.day > 20) {
            let img = document.createElement('img');
            img.classList.add('img');
            img.src = '/images/Feuer.PNG';
            wrapper.appendChild(img);
        } else {
            let img = document.createElement('img');
            img.classList.add('img');
            img.src = '/images/Eis.PNG';
            wrapper.appendChild(img);
        }

        weatherCards.appendChild(wrapper);
    });
}

async function createTodaysWeatherContainer(weather, cityName) {
    while (currentWeather.firstChild) {
        currentWeather.removeChild(currentWeather.firstChild);
    } 
    let title = document.createElement('div');
    title.classList.add('title');
    title.innerText = cityName;
    currentWeather.appendChild(title);

    let container = document.createElement('div');
    container.classList.add('lowerContainer');

    let currentWeatherRight = document.createElement('div');
    currentWeatherRight.classList.add('currentWeatherRight');

    let temp = document.createElement('div');
    temp.classList.add('temp');
    temp.innerText = weather.current.temperature_2m + "°C ";
    currentWeatherRight.appendChild(temp);

    var thermometer = document.createElement('div');
    thermometer.classList.add('thermometer');
    var fill = document.createElement('div');
    fill.classList.add('fill');
    fill.style.height = '0';
    thermometer.appendChild(fill);
    currentWeatherRight.appendChild(thermometer);

    let currentWeatherLeft = document.createElement('div');
    currentWeatherLeft.classList.add('currentWeatherLeft');

    let rainImg = document.createElement('img');
    rainImg.classList.add('smallImg');
    rainImg.src = '/images/Regen.png';
    currentWeatherLeft.appendChild(rainImg);

    let rain = document.createElement('div');
    rain.classList.add('rain');
    rain.innerText = weather.current.precipitation_probability + "%";
    currentWeatherLeft.appendChild(rain);

    let windImg = document.createElement('img');
    windImg.classList.add('smallImg');
    windImg.src = '/images/Wind.png';
    currentWeatherLeft.appendChild(windImg);

    let wind = document.createElement('div');
    wind.classList.add('wind');
    wind.innerText = weather.current.wind_speed_10m + "km/h";
    currentWeatherLeft.appendChild(wind);

    container.appendChild(currentWeatherLeft);
    container.appendChild(currentWeatherRight);
    currentWeather.appendChild(container);

    await fillThermometer(fill, weather.current.temperature_2m);

}

function fillThermometer(fill, temperature) {
    return new Promise(resolve => {
        var interval = setInterval(function () {
            if (fill.offsetHeight >= (temperature / 40) * fill.parentElement.offsetHeight) {
                clearInterval(interval);
                resolve();
            } else {
                fill.style.height = fill.offsetHeight + 8 + 'px';
            }
        }, 5); // Intervallzeit: 50 Millisekunden (langsamer)
    });
}

async function loadWeather(long, lat) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m,precipitation_probability&hourly=temperature_2m,wind_speed_10m`;
    try {
        const weather = await fetch(url);
        return weather.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function getWeather(latitude, longitude, cityName) {
    const weather = await loadWeather(longitude, latitude);
    let averages = getAverageDayTemperature(weather.hourly.temperature_2m, weather.current.time);
    createWeeklyTemperatureContainers(averages);
    await createTodaysWeatherContainer(weather, cityName);
}

luzernButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(47.05, 8.31, luzernButton.alt);
})

zurichButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(47.36, 8.55, zurichButton.alt);
})

bernButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(46.79, 7.70, bernButton.alt);
})

schaffhausenButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(47.42, 8.38, schaffhausenButton.alt);
})

altdorfButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(46.88, 8.64, altdorfButton.alt);
})

zermattButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(46.01, 7.45, zermattButton.alt);
})

churButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(46.84, 9.53, churButton.alt);
})

badenButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(47.28, 8.18, badenButton.alt);
})

document.getElementById('hoverText').addEventListener('mouseenter', createSnowflakes);

function createSnowflakes() {
    for (let i = 0; i < 100; i++) {
        let snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random();
        document.body.appendChild(snowflake);

        // Remove the snowflake after it finishes falling
        setTimeout(() => {
            document.body.removeChild(snowflake);
        }, (Math.random() * 3 + 2) * 1000);
    }
}
