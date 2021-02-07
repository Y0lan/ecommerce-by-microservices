import axios from "axios";

const fn = ({req}) => {
    // in browser
    let axiosOptions = {
        baseURL: '/'
    }
    // on the server
    if (typeof window === 'undefined') {
        axiosOptions = {
            baseURL: process.env.BASE_URL,
            headers: req.headers
        }
    }
    return axios.create(axiosOptions)
}

export default fn;
