const zurichButton = document.querySelector('#zurich');
const luzernButton = document.querySelector('#luzern');

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

function createTodaysWeatherContainer(weather) {
    while (currentWeather.firstChild) {
        currentWeather.removeChild(currentWeather.firstChild);
    }
    let temp = document.createElement('div');
    temp.classList.add('temperature');
    temp.innerText = weather.current.temperature_2m + "°C ";
    currentWeather.appendChild(temp);


    let rain = document.createElement('div');
    rain.classList.add('rain');
    rain.innerText = weather.current.precipitation_probability + "%";
    currentWeather.appendChild(rain);

    let wind = document.createElement('div');
    wind.classList.add('wind');
    wind.innerText = weather.current.wind_speed_10m + "km/h";
    currentWeather.appendChild(wind);
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

async function getWeather(latitude, longitude) {
    const weather = await loadWeather(longitude, latitude);
    let averages = getAverageDayTemperature(weather.hourly.temperature_2m, weather.current.time);
    createWeeklyTemperatureContainers(averages);
    createTodaysWeatherContainer(weather);
}

luzernButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(47.05, 8.31);
})

zurichButton.addEventListener('click', async function (e) {
    e.preventDefault();
    getWeather(47.36, 8.55);
})