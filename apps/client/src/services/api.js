import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://18.141.202.63/api/v1/',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

export default instance;