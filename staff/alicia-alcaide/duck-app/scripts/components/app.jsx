const { Component, /* Fragment */ } = React

class App extends Component {
    state = { lang: 'en', visible: logic.isUserLoggedIn ? 'home' : 'landing', error: null, name: null }

    handleLanguageChange = lang => this.setState({ lang })

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleLogin = (username, password) =>
        logic.loginUser(username, password, error => {
            if (error) return this.setState({ error: error.message })

            logic.retrieveUser((error, user) => {
                if (error) return this.setState({ error: error.message })

                this.setState({ visible: 'home', name: user.name })
            })
        })


    handleLogout = () => {
        logic.logoutUser(error => {
            if (error) return this.setState({ error: error.message })

            this.setState({visible : 'landing'})
        })

    }


    handleRegister = (name, surname, email, pasword) =>
        logic.registerUser(name, surname, email, pasword, error => {
            if (error) return this.setState({ error: error.message })

            this.setState({visible : 'registerOk'})
        })

    componentDidMount() {
        logic.isUserLoggedIn && logic.retrieveUser((error, user) => {
            if (error) return this.setState({ error: error.message })

            this.setState({ name: user.name })
        })
    }


    render() {
        const {
            state: { lang, visible, error, name },
            handleLanguageChange,
            handleRegisterNavigation,
            handleLoginNavigation,
            handleLogin,
            handleLogout,
            handleRegister
        } = this

        // return <Fragment>
        return <>
            <LanguageSelector onLanguageChange={handleLanguageChange} />

            {visible === 'landing' && <Landing lang={lang} onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />}

            {visible === 'login' && <Login lang={lang} onLogin={handleLogin} error={error} />}

            {visible === 'register' && <Register lang={lang} onRegister={handleRegister} error={error} />}

            {visible === 'home' && <Home lang={lang} name={name} onLogout={handleLogout}/>}

            {visible === 'registerOk' && <RegisterOk lang={lang} onLogin={handleLoginNavigation} />}


        </>
        // </Fragment>
    }
}