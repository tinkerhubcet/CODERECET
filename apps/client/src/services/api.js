import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://18.141.202.63/api/v1/',
    withCredentials: true
})

export default instance;