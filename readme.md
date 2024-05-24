API utilizada para o clima: https://hgbrasil.com/ (Pode apresentar alguma estabilidade no tempo de resposta)  
API utilizada para obter as coordenadas pelo nome da pesquisa: https://developers.google.com/maps/documentation/geocoding/requests-geocoding?hl=pt-br  

Testar a aplicação em produção: https://geopixel-private.vercel.app/  

Para rodar a aplicação localmente, siga estes passos:  

1. Clone o repositório:

git clone https://github.com/seu-usuario/geopixel.git  

2. Instale as dependências:

cd geopixel  
npm install  

3. Rode o servidor  
npm run start  


No entanto, é necessário criar uma chave api para utilizar a API do google.  
Crie um arquivo chamado config.ts  
(window as any).API_KEY = "GOOGLE_API_KEY";  
(window as any).WEATHER_KEY = "HGBRASIL_API_KEY";  

Crie um arquivo chamado cypress.config.ts  
import { defineConfig } from "cypress";  

export default defineConfig({  
  e2e: {  
    setupNodeEvents(on, config) {  
    },  
  },  
  env: {  
    API_KEY: "GOOGLE_API_KEY",  
  }  
});


