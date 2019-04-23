const i18nRegisterOk = {
    en: {
        message: 'User successfully registered, you can proceed to login',
        button: 'Login'
    },
    es: {
        message: 'Usuario registrado correctamente, puede iniciar sesión',
        button: 'Iniciar Sesión'
    },
    ca: {
        message: "L'usuari s'ha registrat correctament i podeu iniciar la sessió",
        button: 'Inici de sessió'
    },
    ga: {
        message: 'O usuario rexistrouse con éxito, podes continuar co inicio da sesión',
        button: 'Inicio da sesión'
    }
}


function RegisterOk(props) {
    const { lang } = props

    const literals = i18nRegisterOk[lang]


    return <section onClick={e => e.preventDefault()}>
        <h3>{literals.message}</h3>
        <a href="" onClick={() => props.onLogin()}>{literals.button}</a>
    </section>
}