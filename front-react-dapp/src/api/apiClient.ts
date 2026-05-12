import axios from 'axios';
import WebApp from '@twa-dev/sdk';


const apiClient = axios.create({

    baseURL: '/',
    headers: {
        'X-TG-Data': WebApp.initData,
        "ngrok-skip-browser-warning": true
    }

})




export default apiClient;