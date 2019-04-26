import React from 'react'
import logic from '../../logic'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Results({ items, onItem }) {
    return <ul>
        {items.map(({ id, title, image, price }) =>
            <li key={id} onClick={() => onItem(id)}>
                <h2>{title}</h2>
                <img src={image} />
                <button onClick={(e) => {
                    e.stopPropagation()
                    //return console.log(id)
                    return logic.toggleFavDuck(id)
                    .then (() => console.log('cambio corazón'))
                    .catch(() => console.log('ERROOOOOR!'))
                }
                }>FAVORITE</button>
                <span>{price}</span>
            </li>)}
    </ul>
}

export default Results