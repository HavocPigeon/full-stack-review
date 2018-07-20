import React from 'react';
import {Link} from 'react-router-dom';
import './Navigation.css'

export default function Navigation(){
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const auth0LoginUrl = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`
    return (
        <div className='navigation'>
        <Link to='/'>Home</Link>
        <a href={auth0LoginUrl}>Login</a>
        <Link to='/profile'>Profile</Link>
        <Link to='/words'>Words</Link>
        </div>
    )
}
