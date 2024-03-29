const OrderIndex = ({orders}) => {
    return <ul>
        {console.log(orders)}
        {
            orders.map(order => {
                return <li key={order.id}> Order for: {order.job.title} : {order.status}</li>
            })
        }
    </ul>
}
OrderIndex.getInitialProps = async (context, client) => {
    const {data} = await client.get('/api/v1/orders')
    return {orders: data}
}
export default OrderIndex
