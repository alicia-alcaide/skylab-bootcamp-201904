const Login = (() => { 

    const literals = {
        en: {
            title: 'Login',
            email: 'E-mail',
            password: 'Password'
        },
        es: {
            title: 'Iniciar sesión',
            email: 'E-milio',
            password: 'Contraseña'
        },
        ca: {
            title: 'Inici de sessió',
            email: 'E-mil·li',
            password: 'Contrasenya'
        },
        ga: {
            title: 'Inicio da sesión',
            email: 'E-miliño',
            password: 'Contrasinal'
        }
    }

    return function (props) {

        const { lang, error, onLogin } = props

        const {title, email, password} = literals[lang]

        function handleSubmit(e) {
            e.preventDefault()

            const username = e.target.username.value
            const password = e.target.password.value

            onLogin(username, password)
        }

        return <>
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder={email} />
                <input type="password" name="password" placeholder={password} />
                <button>{title}</button>
                <span>{error}</span>
            </form>
        </>
    }
})()