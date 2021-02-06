import {useState} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const {doRequest, errors} = useRequest({
        url:'/api/v1/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: () => Router.push('/')
    })

    const onBlur = () => {
        const value = parseFloat(price)
        if(isNaN(value)){
            return
        }
        setPrice(value.toFixed(2))
    }


    const onSubmit = (event) => {
        event.preventDefault()
        doRequest()
    }



    return (
        <div>
            <h1> Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           className="form-control"
                           type="text"/>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input className="form-control"
                           type="text"
                           value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           onBlur={onBlur}
                    />
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>

        </div>
    );
};

export default NewTicket;
