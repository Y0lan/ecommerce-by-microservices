import axios from "axios";

const fn = ({req}) => {
    // in browser
    let axiosOptions = {
        baseURL: '/'
    }
    // on the server
    if (typeof window === 'undefined') {
        axiosOptions = {
            // Google Cloud
            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            // Digital Ocean
            //baseURL: 'http://www.missylaboss.dev',
            baseURL: process.env.BASE_URL,
            headers: req.headers
        }
        console.log("axios base url = ", process.env.BASE_URL)
    }
    return axios.create(axiosOptions)
}

export default fn;
