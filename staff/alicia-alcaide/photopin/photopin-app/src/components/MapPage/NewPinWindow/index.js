import React from "react"
import PropTypes from "prop-types"
import literals from './literals'


const NewPinWindow = props => {
  const { place, mapCollections, lang } = props;

  const infoWindowStyle = {
    position: "relative",
    bottom: 150,
    left: "-45px",
    width: 220,
    backgroundColor: "white",
    boxShadow: "0 2px 7px 1px rgba(0, 0, 0, 0.3)",
    padding: 10,
    fontSize: 14,
    zIndex: 1000
  };

  const { title, description, urlImage, bestTimeYear, bestTimeDay, photoTips, travelInfo, collection, add } = literals[lang]

  const handleSubmit = (e) => {
    e.preventDefault()

    //TODO: validar los campos del formulario

    const newPin = {
      title: e.target.title.value,
      description: e.target.description.value,
      urlImage: e.target.urlImage.value,
      bestTimeOfYear: e.target.bestTimeYear.value,
      bestTimeOfDay: e.target.bestTimeDay.value,
      photographyTips: e.target.photoTips.value,
      travelInformation: e.target.travelInfo.value,
      coordinates: {
        latitude: props.newPlace.lat,
        longitude: props.newPlace.lng
      },
      collectionSel: e.target.collectionSel
    }

    props.onNewPin(newPin)
  }


  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 16 }}>{place.title}</div>
      <div style={{ fontSize: 14, color: "grey" }}>{place.collection}</div>

      <form onSubmit={handleSubmit} >
        <span>{title}</span>
        <input type="text" name="title" autofocus />
        <br /><span>{description}</span>
        <input type="text" name="description" />
        <br /><span>{urlImage}</span>
        <input type="text" name="urlImage" />
        <br /><span>{bestTimeYear}</span>
        <input type="text" name="bestTimeYear" />
        <br /><span>{bestTimeDay}</span>
        <input type="text" name="bestTimeDay" />
        <br /><span>{photoTips}</span>
        <textarea type="text" name="photoTips" rows="2" cols="25" />
        <br /><span>{travelInfo}</span>
        <textarea type="text" name="travelInfo" rows="2" cols="25" />
        <br /><span>{collection}</span>
        <select name="collectionSel">
          {
            mapCollections.map(collection => <option value={collection} key={collection} >{collection}</option>)
          }
        </select>
        <br />
        <button type="submit">{add}</button>
        {/* {error && <span>{error}</span>} */}
      </form>

    </div>
  );
};

NewPinWindow.propTypes = {
  place: PropTypes.object.isRequired
};

export default NewPinWindow;
