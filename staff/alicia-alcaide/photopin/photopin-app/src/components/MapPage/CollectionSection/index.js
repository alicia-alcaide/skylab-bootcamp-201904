import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import logic from "../../../logic"
import literals from './literals'
//import './index.sass'


class CollectionSection extends Component {

    state = { error: null, addingCollection: false }


    handleNewCollection = () => {
        this.setState({ addingCollection: true })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        debugger
        const newCollection = e.target.collection.value
        this.setState({ addingCollection: false })
        this.props.onNewCollection(newCollection)
    }

    render() {
        const {
            state: { error, addingCollection },
            props: { lang, pmap },
            handleNewCollection,
            handleSubmit
        } = this

        const { addCollection, add, placeholderNewCol } = literals[lang]


        return <>
            <section className="collections__addCollection">
                <button className="button--addCollection" onClick={() => handleNewCollection()}>{addCollection}</button>
                {addingCollection &&
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="collection" placeholder={placeholderNewCol} autoFocus />
                        <button type="submit">{add}</button>
                        {error && <span>{error}</span>}
                    </form>
                }
            </section>
            <section className="collections">
                {pmap && pmap.collections &&
                    <ul>
                        {pmap.collections.map(collection => {
                            return (
                                <li key={collection.title}>
                                    <h4>{collection.title}</h4>
                                    {collection.pins &&
                                        <ul>
                                            {collection.pins.map(pin => {
                                                return (
                                                    <li key={pin._id}>
                                                        <h4>{pin.title}</h4>
                                                    </li>
                                                )
                                            }
                                            )}
                                        </ul>
                                    }
                                </li>)
                        })
                        }
                    </ul>
                }
            </section>
        </>
    }
}

export default withRouter(CollectionSection);

