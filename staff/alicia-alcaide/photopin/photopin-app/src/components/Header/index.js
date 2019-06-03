import React, { useContext } from 'react'
import { AppContext } from '../AppContext'
import literals from './literals.js'
import logo from './logo/icono_v2.png'

function Header({ lang }) {

    const { title } = literals[lang]

    return <header className="header" onClick={e => e.preventDefault()}>
        <img src={logo} className='header__logo' alt="logo-PhotoPin" 
             width="90" height="90" />

        <h1 className='header__title'>{title}</h1>

        {/* TODO: Navegación - Profile (si signIn)
                               Logout  (si signIn)
                               Quick start
                               Contact
        */}
    </header>
}

export default Header