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

const baseUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?language=pt-br&key=${(window as any).API_KEY}&address=`

buttonConsult.addEventListener("click", () => {  
    const inputText: string = input.value;        
    if (!!inputText){
      if (!cityHistory.includes(inputText)){
        cityHistory.push(inputText);
        var option = document.createElement(`option`);
        option.textContent = inputText;
        option.value = inputText;
        selectBox.add(option);       
      }
      const call: string = baseUrl + inputText.split(" ").join("+");
  
      fetch(call).then((response) => response.json()).then((res) => {
        const latitude: number = res.results[0].geometry.location.lat;
        const longitude: number = res.results[0].geometry.location.lng;
        view.setCenter([longitude, latitude]);
        view.setZoom(11.25);
      })
      .catch((err) => {
        throw err;
      })  
    }
  }    
);