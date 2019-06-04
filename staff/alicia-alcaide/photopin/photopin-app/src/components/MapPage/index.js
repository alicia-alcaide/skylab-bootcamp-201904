import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import logic from "../../logic"
import MapSection from "./MapSection"
import CollectionSection from "./CollectionSection"
import './index.sass'

class MapPage extends Component {
  state = { pmap: null, mapId: this.props.match.params.id, newPlace: null };

  componentDidMount() {
    logic.isUserLoggedIn &&
      logic
        .retrieveUserMap(this.state.mapId)
        .then(pmap => this.setState({ pmap }))
        .catch(error => this.setState({ error: error.message }));
  }


  handleNewCollection = (valueNewCollection) => {
    (async () => {
      try {
        const newCollections = [...this.state.pmap.collections, { title: valueNewCollection, pins: [] }]

        await logic.createMapCollection(this.state.pmap._id, newCollections)
        this.setState({ pmap: { collections: newCollections } })
      } catch (error) {
        this.setState({ error })
      }
    })()
  }


  handleNewPin = (newPin) => {
    //TODO: crear el newPlace a partir de la información que llega
    // en base de datos:
    //   - crear nuevo pin
    //   - añadir nuevo pin a la colección del mapa
    // añadir nuevo pin a la colección del pmap y setear su estado

    window.alert('ahora guardar el pin')
  }


  render() {
    const {
      state: { pmap, mapId, newPlace },
      props: { lang },
      handleNewCollection,
      handleNewPin
    } = this;

    return (< main>
      {pmap && <h2>{pmap.title}</h2>}
      <section className="mapPage">
        <section className="mapPage__Collections">
          <CollectionSection pmap={pmap} lang={lang} onNewCollection={handleNewCollection} />
        </section>
        <section className="mapPage__Map">
          <MapSection pmap={pmap} lang={lang} onNewPin={handleNewPin} />
        </section>
      </section>
    </main>
    )
  }
}

export default withRouter(MapPage);
