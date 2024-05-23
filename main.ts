import './style.css';
import { Map, View } from 'ol';
import { useGeographic } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

useGeographic();

const view = new View({
  center: [0, 0],
  zoom: 1,
});

const map: Map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: view
});

const cityHistory: string[] = [];
const selectBox = <HTMLSelectElement >document.querySelector("#select");
const buttonConsult = <HTMLButtonElement >document.querySelector("#consult");
const input = <HTMLInputElement>document.querySelector("#input");

const baseUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?language=pt-br&key=${(window as any).API_KEY}&address=`;
const weatherUrl: string = `https://api.hgbrasil.com/weather?user_ip=remote&format=json-cors&key=${(window as any).WEATHER_KEY}`;

const cityInfoContainerElement = <HTMLDivElement>document.querySelector(".city-info");
const cityNameParagraphElement =  <HTMLParagraphElement>document.querySelector("#city-name-paragraph");
const cityDateElement =  <HTMLParagraphElement>document.querySelector("#city-date-paragraph");
const cityWeatherDescriptionElement =  <HTMLParagraphElement>document.querySelector("#city-weather-description-paragraph");
const cityCurrentTemperatureElement =  <HTMLParagraphElement>document.querySelector("#city-current-temperature-paragraph");
const cityMaxTemperatureElement =  <HTMLParagraphElement>document.querySelector("#city-max-temperature-paragraph");
const cityMinTemperatureElement =  <HTMLParagraphElement>document.querySelector("#city-min-temperature-paragraph");
const cityRainProbabilityElement =  <HTMLParagraphElement>document.querySelector("#city-rain-probability-paragraph");
const cityMoonPhaseElement =  <HTMLParagraphElement>document.querySelector("#city-moon-phase-paragraph");

const weatherDatesButtonArray: HTMLButtonElement[] = [
  document.querySelector("#button-1")!,
  document.querySelector("#button-2")!,
  document.querySelector("#button-3")!,
  document.querySelector("#button-4")!,
];

const weatherMap = {
  "storm" : "tempestade",
  "snow" : "neve",
  "hail" : "granizo",
  "rain" : "chuva",
  "fog" : "neblina",
  "clear_day" : "dia limpo",
  "clear_night" : "noite limpa",
  "cloud" : "nublado",
  "cloudly_day" : "nublado de dia",
  "cloudly_night" : "nublado de noite",
  "none_day" : "erro ao obter mas está de dia",
  "none_night" : "erro ao obter mas está de noite"
}

const moonPhaseMap = {
  "new" : "Lua nova",
  "waxing_crescent" : "Lua crescente",
  "first_quarter" : "Quarto crescente",
  "waxing_gibbous" : "Gibosa crescente",
  "full" : "Lua cheia",
  "waning_gibbous" : "Gibosa minguante",
  "last_quarter" : "Quarto minguante",
  "waning_crescent" : "Lua minguante"
}

let weatherByDateArray: any[] = [];

const callCityWeatherAPI = (city: string) => {
  const callCoordinate: string = baseUrl + city.split(" ").join("+");

  fetch(callCoordinate).then((response) => response.json()).then((res) => {
    if (res.status === "ZERO_RESULTS"){
      alert("Nenhum resultado encontrado.");
      const options = selectBox.options;

      for (let i = 0; i < options.length; i++) {
          if (options[i].value == city) {
              selectBox.remove(i);
              break;
          }
      }
      return;
    }

    const latitude: number = res.results[0].geometry.location.lat;
    const longitude: number = res.results[0].geometry.location.lng;
    view.setCenter([longitude, latitude]);
    view.setZoom(11.25);

    const callWeather: string = weatherUrl + `&lat=${latitude}&lon=${longitude}`;
    fetch(callWeather).then((response) => response.json()).then((res) => {
      const today = {
        "city": "Cidade: " + res.results.city,
        "date": "Data: " + res.results.date,
        "currentWeather": "Clima atual: " + res.results.description +
          `<img
            style="max-width: 32px; height: auto; display: block; margin: 0;"
            src="https://assets.hgbrasil.com/weather/icons/conditions/${res.results.condition_slug}.svg" 
            alt="${weatherMap[res.results.condition_slug]}"
          >`,
        "currentTemperature": "Temperatura atual: " + res.results.temp + "°C",
        "maxTemperature": "Temperatura máxima: " + res.results.forecast[0].max + "°C",
        "minTemperature": "Temperatura mínima: " + res.results.forecast[0].min + "°C",
        "rainProbability": "Probabilidade de chuva: " + res.results.forecast[0].rain_probability + "%",
        "moonPhase": "Fase da Lua: " + moonPhaseMap[res.results.moon_phase] + 
          `<img 
            style="max-width: 32px; height: auto; display: block; margin: 0;"
            src="https://assets.hgbrasil.com/weather/icons/moon/${res.results.moon_phase}.png"
            alt="${moonPhaseMap[res.results.moon_phase]}"
          >`     
      }

      weatherByDateArray = [];
      weatherDatesButtonArray[0].innerText = "Hoje";
      weatherByDateArray.push(today);

      for(let i = 1; i < 4; i++){
        weatherByDateArray.push({
          "city": "Cidade: " + res.results.city,
          "date": "Data: " + res.results.forecast[i].date,
          "maxTemperature": "Temperatura máxima: " + res.results.forecast[i].max + "°C",
          "minTemperature": "Temperatura mínima: " + res.results.forecast[i].min + "°C",
          "rainProbability": "Probabilidade de chuva: " + res.results.forecast[i].rain_probability + "%",
          "currentWeather": "Clima: " + res.results.forecast[i].description +
          `<img
            style="max-width: 32px; height: auto; display: block; margin: 0;"
            src="https://assets.hgbrasil.com/weather/icons/conditions/${res.results.forecast[i].condition}.svg" 
            alt="${weatherMap[res.results.forecast[i].condition]}"
          >`,
        });
        weatherDatesButtonArray[i].innerText = res.results.forecast[i].date;
      }

      cityNameParagraphElement.innerText = today.city;
      cityDateElement.innerText = today.date;
      cityWeatherDescriptionElement.innerHTML = today.currentWeather;
      cityCurrentTemperatureElement.innerText = today.currentTemperature;
      cityMaxTemperatureElement.innerText = today.maxTemperature;
      cityMinTemperatureElement.innerText = today.minTemperature;
      cityRainProbabilityElement.innerText = today.rainProbability;
      cityMoonPhaseElement.innerHTML = today.moonPhase;

      cityInfoContainerElement.style.visibility = "visible";
    })
    .catch((err) => {
      throw err;
    }); 
  })
  .catch((err) => {
    throw err;
  });
}

buttonConsult.addEventListener("click", () => {  
    const inputText: string = input.value;        
    if (!!inputText){
      if (!cityHistory.includes(inputText)){          
        cityHistory.push(inputText);
        var option = document.createElement(`option`);
        option.textContent = inputText;
        option.value = inputText;
        selectBox.add(option);   
        
        callCityWeatherAPI(inputText);
      }
    }
  } 
);

const changeDateInfo = (event: EventTarget) => {
  const buttonId: string = (event as HTMLElement).id;
  const buttonIdNumber: number = parseInt(buttonId.replace("button-", ""));
  const dateSelected =  weatherByDateArray[buttonIdNumber - 1];

  cityNameParagraphElement.innerText = dateSelected.city;
  cityDateElement.innerText = dateSelected.date;
  cityWeatherDescriptionElement.innerHTML = dateSelected.currentWeather;
  cityCurrentTemperatureElement.innerText = dateSelected.currentTemperature || "";
  cityMaxTemperatureElement.innerText = dateSelected.maxTemperature;
  cityMinTemperatureElement.innerText = dateSelected.minTemperature;
  cityRainProbabilityElement.innerText = dateSelected.rainProbability;
  cityMoonPhaseElement.innerHTML = dateSelected.moonPhase || "";
  
}

weatherDatesButtonArray.forEach((button) => {
  button.addEventListener("click", (e) => changeDateInfo(e.target!));
})

selectBox.addEventListener("change", (e) => {
    const selectedIndex: number =  (e.target as HTMLSelectElement).options.selectedIndex;
    const selectedCity = (e.target as HTMLSelectElement).options[selectedIndex].value;
    callCityWeatherAPI(selectedCity);
  }
);
