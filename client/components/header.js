import Link from 'next/link'

const fn = ({currentUser}) => {

    const links = [
        !currentUser && {label: 'Sign up', href: '/auth/signup'},
        !currentUser && {label: 'Login', href: '/auth/login'},
        currentUser && {label: 'Sell Ticket', href: '/tickets/new'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && {label: 'Logout', href: '/auth/logout'},
    ]
        .filter(link => link)
        .map(({href, label}) => {
            return <li key={href}>
                <Link href={href}>
                    <a className="nav-link">{label}</a>
                </Link>
            </li>
        })
    return <nav className="navbar navbar-light bg-light">
        <Link href='/'>
            <a className="navbar-brand">micro.io 🥰</a>
        </Link>
        <div className="div-flex justify-content-end">
            <ul className="nav d-flex align-items-center">
                {links}
            </ul>
        </div>
    </nav>
}

export default fn;
