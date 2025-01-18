// const BASE_URL = 'https://challenge-back-end.onrender.com/';
const BASE_URL = 'http://localhost:8081/';

const API_METRICS="https://my-json-server.typicode.com/405516GONZALEZFEDERICO/fake-api-metrics/environmentalData";
export const environment = {
  production: false,
  services: {
    login: `${BASE_URL}auth/login`,
    register: `${BASE_URL}auth/register`,
    refresh:`${BASE_URL}auth/refresh`,
    getPlants:`${BASE_URL}plant/getPlants2`,
    getMetrics:`${API_METRICS}`,
    postPlant:`${BASE_URL}plant/newPlant`,
    putPlant:`${BASE_URL}plant/updatePlant`,
    deletePlant:`${BASE_URL}plant/logicDown/`,
  }
};