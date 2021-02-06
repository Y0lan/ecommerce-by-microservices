import axios from "axios";

const fn = ({req}) => {
    // in browser
    let axiosOptions = {
        baseURL: '/'
    }
    // on the server
    if (typeof window === 'undefined') {
        axiosOptions = {
            baseURL: 'http://www.missylaboss.dev',
            headers: req.headers
        }
    }
    return axios.create(axiosOptions)
}

export default fn;
