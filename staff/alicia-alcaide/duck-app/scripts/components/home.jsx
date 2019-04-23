const i18nHome = {
    en: {
        logout: 'Logout'
    },
    es: {
        logout: 'Cerrar sesión'
    },
    ca: {
        logout: 'Tancar sessió'
    },
    ga: {
        logout: 'Pechar sesión'
    }
}


function Home(props) {

    const { lang } = props

    const literals = i18nHome[lang]

   
    return <main>
        <button onClick={() => props.onLogout()}>{literals.logout}</button>
        
        <h1>Hello, {props.name}!</h1>
    </main>
}