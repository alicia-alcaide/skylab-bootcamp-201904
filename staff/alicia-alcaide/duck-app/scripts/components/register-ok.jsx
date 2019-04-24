const RegisterOk = (() => {
    const literals = {
        en: {
            message: 'User successfully registered, you can proceed to ',
            login: 'login'
        },
        es: {
            message: 'Usuario registrado correctamente, puede ',
            login: 'iniciar sesión'
        },
        ca: {
            message: "L'usuari s'ha registrat correctament, podeu ",
            login: 'iniciar la sessió'
        },
        ga: {
            message: 'O usuario rexistrouse con éxito, podes continuar co ',
            login: 'inicio da sesión'
        }
    }


    return function (props) {

        const { lang,  onLogin } = props
        const {message, login} = literals[lang]

        return <>
            <h3>{message} <a href="" onClick={e => {
                    e.preventDefault()
                    onLogin()
                }}>{login}</a>.
            </h3>
        </>
    }
})()
