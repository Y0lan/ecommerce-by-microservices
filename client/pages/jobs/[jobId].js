import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const JobShow = ({job}) => {
    const {doRequest, errors} = useRequest({
        url: '/api/v1/orders',
        method: 'post',
        body: {
            jobId: job.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    })
    return <div>
        <h1>{job.title}</h1>
        <h4>Price: {job.price}</h4>
        {errors}
        <button onClick={() => doRequest()} className="btn btn-primary">Hire</button>
    </div>
}

JobShow.getInitialProps = async (context, client) => {
    const {jobId} = context.query;
    const {data} = await client.get(`/api/v1/jobs/${jobId}`)
    return {job: data}
}

export default JobShow
