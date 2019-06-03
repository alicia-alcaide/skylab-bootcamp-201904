import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import logic from "../../logic"
import MapSection from "./MapSection"
import CollectionSection from "./CollectionSection"
import './index.sass'

class MapPage extends Component {
  state = { pmap: null, mapId: this.props.match.params.id };

  componentDidMount() {
    logic.isUserLoggedIn &&
      logic
        .retrieveUserMap(this.state.mapId)
        .then(pmap => this.setState({ pmap }))
        .catch(error => this.setState({ error: error.message }));
  }

  handleNewCollection = (valueNewCollection) => {
    (async() => {
      try {
        const newCollections = [...this.state.pmap.collections, {title: valueNewCollection, pins:[]}]

        await logic.createMapCollection(this.state.pmap._id, newCollections)    
        this.setState ({ pmap : {collections: newCollections}})
      } catch (error) {
        this.setState({error})
      }
    })()
  }

/*
componentDidMount() {
        const { pmap } = this.props
        let places = []

        pmap && pmap.collections && pmap.collctions.map(collection => {
            collection.pins && collection.pins.map(pin => {
            places.push({title: pin.title, lat : pin.coordinates.latitude, lng: pin.coordinates.longitude})
            })
        })
        this.setState(places)
    }
*/

  render() {
    const {
      state: { pmap, mapId },
      props: { lang },
      handleNewCollection
    } = this;

    return (< main>
      {pmap && <h2>{pmap.title}</h2>}
      <section className="mapPage">
        <section className="mapPage__Collections">
          <CollectionSection pmap={pmap} lang={lang} onNewCollection={handleNewCollection} />
        </section>
          <section className="mapPage__Map">
            <MapSection pmap={pmap}/>
          </section>
      </section>
      </main>
    )
  }
}

export default withRouter(MapPage);
