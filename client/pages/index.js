import Link from 'next/link'
const index = ({currentUser, tickets}) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>)
    })
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
                </thead>
                <tbody>
                {ticketList}
                </tbody>
            </table>
        </div>
    )
}

index.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/v1/tickets')
    return {tickets: data};
}

export default index
