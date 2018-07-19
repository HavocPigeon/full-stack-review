import React from 'react';
import logo from '../lunar.jpg';
import './Header.css';

export default function Header(){
    return (
        <div className='header'>
     <h1>Word Bank</h1>
     <img src={logo} alt="lunar scene"/>
     </div>
    )
}