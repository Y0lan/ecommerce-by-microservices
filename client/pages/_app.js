import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from '../components/header'

const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className="container">
                <Component currentUser={currentUser}{...pageProps}/>
            </div>
        </div>);
}

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx)
    const {data} = await client.get("/api/v1/users/current")
    const pageProps = appContext.Component.getInitialProps ? await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        data.currentUser) : {}
    return {
        pageProps,
        ...data
    }
}

export default AppComponent
