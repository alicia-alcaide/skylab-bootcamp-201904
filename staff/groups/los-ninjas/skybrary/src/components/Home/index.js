import React, { Component } from 'react'
import logic from '../../logic'
import Search from '../Search'
import Results from '../Results'
import Header from '../Header'
import Footer from '../Footer'

import { booleanLiteral } from '@babel/types';
// import Detail from '../Detail'
import './index.scss'

class Home extends Component {
    state = {error: null, books: [], }

    handleSearch = query => 
    
        logic.searchBooks(query)
            .then((books) =>
                this.setState({books: books.docs})
        ).catch(error =>
            this.setState({ error: error.message })
        )
        
    

    render() {

        const {
            handleSearch,
            state: {books}
        } = this

        return <main className="home">
            <Header/>
            <button>Logout</button>
            <Search onSearch={handleSearch}/>
            <Results items={books}/>
            <Footer/>
        </main>
    }
}

export default Home