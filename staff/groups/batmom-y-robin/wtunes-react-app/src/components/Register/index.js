import React from 'react'

function Register({onRegister, error}){
let city
    function onCityChange(e){
        city=e
    }
    function handleSubmit(e) {
        e.preventDefault()
        
        const {
            name: { value: name },
            surname: { value: surname },
            username: { value: username },
            password: { value: password },
        } = e.target

        onRegister(name, surname, username, password, city)
    }
    return <main className="mainregister">
        <section>
            <h2 className="title is-2">Weatunes</h2>
            <p className="subtitle"> Sign up with your email address</p>
            <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="name" />
            <input type="text" name="surname" placeholder="surname" />
            <input type="text" name="username" placeholder="email" />
            <input type="password" name="password" placeholder="password" />
            <select name="city" onChange={event => onCityChange(event.target.value)}>
                <option value="">City</option>
                <option value="Alaska">Alaska</option>
                <option value="Auckland">Auckland</option>
                <option value="Barcelona">Barcelona</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Cape Town">Cape Town</option>
                <option value="Cuba">Cuba</option>
                <option value="Helsinki">Helsinki</option>
                <option value="London">London</option>
                <option value="New York">New York</option>
                <option value="Paris">Paris</option>
                <option value="Toronto">Toronto</option>
                <option value="Warsaw">Warsaw</option>
            </select>
            <button>register</button>
            <span>{error}</span>
            </form>
        </section>
    </main>

}
export default Register