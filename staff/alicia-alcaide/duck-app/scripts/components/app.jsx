const { Component, /* Fragment */ } = React

class App extends Component {

    state = { lang: i18n.language, visible: logic.isUserLoggedIn ? 'home' : 'landing', error: null, name: null }

    handleLanguageChange = lang => this.setState({ lang: i18n.language = lang }) // NOTE setter runs first, getter runs after (i18n)

    handleRegisterNavigation = () => this.setState({ visible: 'register' })

    handleLoginNavigation = () => this.setState({ visible: 'login' })

    handleLogin = (username, password) => {
        try {
            logic.loginUser(username, password, error => {
                if (error) return this.setState({ error: error.message })

                logic.retrieveUser((error, user) => {
                    if (error) return this.setState({ error: error.message })

                    this.setState({ visible: 'home', name: user.name, error: null })
                })
            })
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }


    handleSearch = (query) => {
        try {
            logic.searchDucks(query, (ducks) => {
                /* home.results = ducks.map(function (duck) {
                    return {
                        id: duck.id,
                        title: duck.title,
                        image: duck.imageUrl,
                        price: duck.price
                    }
                }) */

                
                if (ducks.error) this.setState({ error: ducks.error})
                                 
                console.log('ducks', ducks) 
                console.log(`Hay ${ducks.length} patitos. FALTA pintarlos | Si no hay información que hacer`)
    
            })
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }


    handleLogout = () => {
        logic.logoutUser()

        this.setState({ visible: 'landing' })
    }


    handleRegister = (name, surname, username, password) => {
        try {
            logic.registerUser(name, surname, username, password, error => {
                if (error) return this.setState({ error: error.message })

                this.setState({ visible: 'register-ok', error: null })
            })
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }

    
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
            handleRegister,
            handleLogin,
            handleLogout,
            handleSearch
        } = this

    
        return <>
            <LanguageSelector lang={lang} onLanguageChange={handleLanguageChange} />

            {visible === 'landing' && <Landing lang={lang} onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />}

            {visible === 'login' && <Login lang={lang} onLogin={handleLogin} error={error} />}

            {visible === 'register' && <Register lang={lang} onRegister={handleRegister} error={error} />}

            {visible === 'register-ok' && <RegisterOk lang={lang} onLogin={handleLoginNavigation} />}

            {visible === 'home' && <Home lang={lang} name={name} onLogout={handleLogout} onSearch={handleSearch} error={error}/>}


        </>
  
    }
}