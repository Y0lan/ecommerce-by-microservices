import buildClient from '../api/build-client'
const index = ({currentUser}) => {
    return currentUser ? <h1>You are logged in</h1> : <h1>You are not logged in</h1>
}

index.getInitialProps = async (context) => {
    const client = buildClient(context)
    const {data} = await client.get('/api/v1/users/current')
    return data
}

export default index
