import {useState} from 'react';
import Router from 'next/router'
import useRequest from '../../hooks/use-request'


const signupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/v1/users/login',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () => Router.push('/')
    })
    const onSubmit = async event => {
        event.preventDefault();
        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Login</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    type="password"
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Login</button>
        </form>
    )
}
export default signupForm
