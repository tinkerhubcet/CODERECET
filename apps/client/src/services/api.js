import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://18.141.144.168/api/v1/',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export default instance;