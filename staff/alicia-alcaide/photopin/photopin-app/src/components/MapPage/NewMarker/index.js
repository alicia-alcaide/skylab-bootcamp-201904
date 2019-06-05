import React from "react";
import PropTypes from "prop-types";
import NewPinWindow from "../NewPinWindow";
//import './index.sass';


const NewMarker = props => {
  const markerStyle = {
    border: "1px solid white",
    borderRadius: "50%",
    height: 10,
    width: 10,
    backgroundColor: "yellow",
    cursor: "pointer",
    zIndex: 10
  };

  return (
    <>
      <div
        style={markerStyle}
        alt={props.place.text}
        {...(props.onClick ? { onClick: props.onClick } : {})}
      />
      <NewPinWindow place={props.place} newPlace={props.newPlace} onNewPin={props.onNewPin} lang={props.lang} mapCollections={props.mapCollections} />
    </>
  );
};

NewMarker.defaultProps = {
  onClick: null
};

NewMarker.propTypes = {
  place: PropTypes.object.isRequired,
  newPlace: PropTypes.object,
  onNewPin: PropTypes.func,
  lang: PropTypes.string,
  mapCollections: PropTypes.array
};

export default NewMarker;
