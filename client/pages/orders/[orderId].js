import {useEffect, useState} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState('');

    const {doRequest, errors} = useRequest({
        url: '/api/v1/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const secLeft = (new Date(order.expiresAt) - new Date()) / 1000
            setTimeLeft(secLeft)
        }
        findTimeLeft()
        const timerId = setInterval(findTimeLeft, 1000)
        return () => clearInterval(timerId)
    }, [])
    if (timeLeft < 0) return <div>Order expired</div>
    return <div>
        time left to pay: {Math.round(timeLeft)} seconds
        <StripeCheckout
            token={({id}) => doRequest({token: id})}
            stripeKey="pk_test_51HLCw8Clba6dgGKLJWySkLZZR93dJAdLQMIKRx4JhOoXJHN8DQN2XqPzDSgEZYMcm7XFo7thbLpjY2zsBhtd7zJc00snikGMPs"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>
}

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query
    const {data} = await client.get(`/api/v1/orders/${orderId}`)
    return {order: data}
}

export default OrderShow
