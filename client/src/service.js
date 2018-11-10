import axios from 'axios'


const BACKENDURL = 'http://localhost:3001'

export default class Service {
    constructor() {

    }

    get(userId){

    }

    post(endpoint = "", data = {}, options = {headers:{"Content-Type": "application/json"}}) {
        const url = `${BACKENDURL}/${endpoint}`
        return axios.post(url, data, options)
    }
}
