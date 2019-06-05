import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
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

  handleNewCollection = (titleNewCollection) => {
    (async () => {
      try {
        debugger

        const collectionId = await logic.createCollection(this.state.pmap._id, titleNewCollection)
        const newCollections = [...this.state.pmap.collections, { id: collectionId, title: titleNewCollection, pins: [] }]
        this.setState({ pmap: { collections: newCollections } })
      } catch (error) {
        this.setState({ error })
      }
    })()
  }


  handleNewPin = (newPin) => {
    if (newPin !== null) {

      debugger
      (async () => {
        try {

          const pin = {
            title: newPin.title,
            description: newPin.description,
            urlImage: newPin.urlImage,
            bestTimeOfYear: newPin.bestTimeOfYear,
            bestTimeOfDay: newPin.bestTimeOfDay,
            photographyTips: newPin.photographyTips,
            travelInformation: newPin.travelInformation,
            coordinates: newPin.coordinates
          }

          window.alert('Aqui hacer modificación base de datos')

          //TODO: crear el newPlace a partir de la información que llega
          // en base de datos:
          //   - crear nuevo pin
          //   - añadir nuevo pin a la colección del mapa
          // añadir nuevo pin a la colección del pmap y setear su estado


          //await logic.createPin(this.state.pmap._id, pin.collectionSel, pin)

          // debugger
          // const colIndex = pmap.collections.indexOf(newPin.collectionSel)
          // const colWithNewPin = pmap.collections[colIndex].slice().splice(0, 0, newPin.collectionSel)
          // const newCollections = pmap.collections.slice().splice(colIndex, 0, colWithNewPin)

          // this.setState({ pmap: { collections: newCollections } })

        } catch (error) {
          this.setState({ error })
        }
      })()

    }
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

MapPage.propTypes = {
  lang: PropTypes.string
};

export default withRouter(MapPage);
