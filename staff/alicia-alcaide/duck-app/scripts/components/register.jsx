const Register = (() => {

    const literals = {
        en: {
            title: 'Register',
            name: 'Name',
            surname: 'Surname',
            email: 'E-mail',
            password: 'Password'
        },
        es: {
            title: 'Registro',
            name: 'Nombre',
            surname: 'Apellido',
            email: 'E-milio',
            password: 'Contraseña'
        },
        ca: {
            title: 'Registre',
            name: 'Nom',
            surname: 'Cognom',
            email: 'E-mil·li',
            password: 'Contrasenya'
        },
        ga: {
            title: 'Rexistro',
            name: 'Nome',
            surname: 'Apelido',
            email: 'E-miliño',
            password: 'Contrasinal'
        }
    }


    return function (props) {
        const { lang , error, onRegister } = props

        const {title, name, surname, email, password } = literals[lang]

        function handleSubmit(e) {
            e.preventDefault()

            const {
                name: { value: name },
                surname: { value: surname },
                username: { value: username },
                password: { value: password }
            } = e.target

            onRegister(name, surname, username, password)
        }

        return <>
            <h2>{literals.title}</h2>
            <form onSubmit={handleSubmit}>
                <ul>
                    <li><input type="text" name="name" placeholder={name}/></li>
                    <li><input type="text" name="surname" placeholder={surname}/></li>
                    <li><input type="text" name="username" placeholder={email}/></li>
                    <li><input type="password" name="password" placeholder={password}/></li>
                </ul>
                <button>{title}</button>
                <span>{error}</span>
            </form>
        </>
    }
})()