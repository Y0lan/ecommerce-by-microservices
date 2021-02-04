import axios from "axios";

const fn =  ({req}) => {
    // in browser
    let axiosOptions = {
        baseURL: '/'
    }
    // on the server
    if (typeof window === 'undefined') {
        axiosOptions = {
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        }
    }
    return axios.create(axiosOptions)
}

export default fn;
