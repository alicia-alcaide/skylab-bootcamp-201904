import React from 'react'
import literals from './literals'
//import './index.sass'

function Login({ lang, onLogin, error }) {
    const { title, email, password } = literals[lang]

    function handleSubmit(e) {
        e.preventDefault()

        const username = e.target.username.value
        const password = e.target.password.value

        onLogin(username, password)
    }

    return <section className="login">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit} className="field">
            <div className="field">
                <p className="control has-icons-left has-icons-right">
                    <input className="input" type="email" name="username" placeholder={email} autoFocus value="ali@mail.com" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                    </span>
                    <span className="icon is-small is-right">
                        <i className="fas fa-check"></i>
                    </span>
                </p>
            </div>
            <div className="field">
                <p className="control has-icons-left">
                    <input className="input" type="password" name="password" placeholder={password} value="123" />
                    <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                    </span>
                </p>
            </div>
            <div className="field">
                <p className="control">
                    <button className="button is-success">
                        {title}
                    </button>
                </p>
            </div>
        </form>
    </section>
}

export default Login






{/* <section className="login">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
            <input type="email" name="username" placeholder={email} />
            <input type="password" name="password" placeholder={password} />
            <button>{title}</button>
            <span>{error}</span>
        </form>
    </section> */}