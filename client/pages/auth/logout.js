import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const logout = () => {
    const { doRequest } = useRequest({
        url: '/api/v1/users/logout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        doRequest();
    }, []);

    return <div>Signing you out...</div>;
};

export default logout;
