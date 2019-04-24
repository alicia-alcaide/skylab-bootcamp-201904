const Home = (()=> {
    const literals = {
        en: {
            hello: 'Hello',
            logout: 'Logout',
            search: 'Search'
        },
        es: {
            hello: 'Hola',
            logout: 'Cerrar sesión',
            search: 'Buscar'
        },
        ca: {
            hello: 'Hola',
            logout: 'Tanca sessió',
            search: 'Buscar'
        },
        ga: {
            hello: 'Hola',
            logout: 'Finalizar sesión',
            search: 'Atopar'
        }
    }


    return function ({ lang, name, onLogout, onSearch, error }) {

        const {hello, logout, search} = literals[lang]

        function handleSubmit(e) {
            e.preventDefault()
            const query = e.target.query.value
            onSearch(query)
        }

        return <main>
            <button onClick={onLogout}>{logout}</button>
            <h1>{hello}, {name}!</h1>
        
          
            <form onSubmit={handleSubmit}>
                <input type="text" name="query"/>
                <button>{search}</button>
            </form>
           
            <span>{error}</span>

        </main>
    }
})()