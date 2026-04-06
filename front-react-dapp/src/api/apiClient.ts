import axios from 'axios';
import WebApp from '@twa-dev/sdk';


const apiClient = axios.create({

    baseURL: '/',
    headers: {
        'X-TG-Data': WebApp.initData
    }
})



export default apiClient;