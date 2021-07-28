import Link from 'next/link'
const index = ({currentUser, jobs}) => {
    const jobsList = jobs.map(job => {
        return (
            <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.price}</td>
                <td>
                    <Link href="/jobs/[jobId]" as={`/jobs/${job.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>)
    })
    return (
        <div>
            <h2>Jobs</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Hire ---</th>
                </tr>
                </thead>
                <tbody>
                {jobsList}
                </tbody>
            </table>
        </div>
    )
}

index.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/v1/jobs')
    return {jobs: data};
}

export default index
