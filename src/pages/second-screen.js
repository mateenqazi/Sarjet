import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaLongArrowAltLeft, FaMapMarkerAlt } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from "react-google-maps";

import { getAllStation } from "../store/actions/apiAction";
const {
  MarkerClusterer,
} = require("react-google-maps/lib/components/addons/MarkerClusterer");
const Map = (props) => {
  const [selectedPark, setSelectedPark] = useState(null);
  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{
        lat: props.stations?.length
          ? parseFloat(props.stations[0].Latitude)
          : 0,
        lng: props.stations?.length
          ? parseFloat(props.stations[0].Longitude)
          : 0,
      }}
    >
      <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
        {props.stations?.length &&
          props.stations.map((park) => (
            <Marker
              key={park.id}
              position={{
                lat: parseFloat(park.Latitude),
                lng: parseFloat(park.Longitude),
              }}
              onClick={() => {
                setSelectedPark(park);
              }}
            />
          ))}
      </MarkerClusterer>
      {/* MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  }); */}
    </GoogleMap>
  );
};

const MapWrapped = withScriptjs(withGoogleMap(Map));
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MainMap = (props) => {
  const [addressSource, setAddressSource] = useState("");
  const [addressDistension, setAddressDistension] = useState("");
  const [coordinatesSource, setCoordinatesSource] = useState({
    lat: null,
    lng: null,
  });

  const [coordinatesDistension, setCoordinatesDistension] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    props.getAllStation();
    setTimeout(() => {
      if (window.confirm("Live Location?") == true) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(getCoordinates);
        } else {
          alert("Brower not supported Google map");
        }
      }
    }, 2000);
  }, []);

  const getCoordinates = (position) => {
    setCoordinatesSource({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    reverseGeocode(position.coords.latitude, position.coords.longitude);
  };

  const reverseGeocode = (lat, lng) => {
    console.log("lat", lat, "lng", lng);
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        lng +
        "&key=AIzaSyAuyzqHemXF4mlhbl2TENChSJgcsy2u5y0"
    )
      .then((data) => data.json())
      .then((response) => {
        if (response.results?.length) {
          setAddressSource(response.results[0].formatted_address);
        } else {
          setCoordinatesSource({
            lat: null,
            lng: null,
          });
        }
      })
      .catch((err) => {
        alert("Result Not Found");
      });
  };

  const handleSource = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddressSource(value);
    setCoordinatesSource(latLng);
  };

  const handleDistension = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddressDistension(value);
    setCoordinatesDistension(latLng);
  };

  const nextPage = () => {
    const id = new URLSearchParams(props.location.search).get("id");

    if (
      coordinatesSource.lat !== null &&
      coordinatesSource.lng !== null &&
      coordinatesDistension.lat !== null &&
      coordinatesDistension.lng !== null
    )
      props.history.push(
        "/main-screen?id=" +
          id +
          "&source_lng=" +
          coordinatesSource.lng +
          "&source_lat=" +
          coordinatesSource.lat +
          "&distension_lng=" +
          coordinatesDistension.lng +
          "&distension_lat=" +
          coordinatesDistension.lat
      );
    else {
      alert("Please Select Source and Distension First.");
    }
  };

  const backButton = () => {
    props.history.goBack();
  };

  const refreshButton = () => {
    window.location.reload();
  };
  return (
    <div>
      <div className="main-div">
        <div className="overlay">
          <div
            style={{ width: "100vw", height: "100vh", position: "absolute" }}
          >
            {props.car.stations?.length ? (
              <MapWrapped
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAuyzqHemXF4mlhbl2TENChSJgcsy2u5y0`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                stations={props.car.stations}
              />
            ) : null}
          </div>
          <Container className="main-page-2">
            <div className="main-section-2 text-center p-4">
              <div className="main-map p-4 rounded">
                <PlacesAutocomplete
                  value={addressSource}
                  onChange={setAddressSource}
                  onSelect={handleSource}
                  debounce={200}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>
                      <input
                        className="input-style-map"
                        {...getInputProps({
                          placeholder: "Please Type Source Address",
                        })}
                      />

                      <div>
                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#41b6e6"
                              : "#fff",
                          };

                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, { style })}
                            >
                              <div
                                style={{
                                  textAlign: "left",
                                  paddingLeft: "10px",
                                }}
                              >
                                {suggestion.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                <br />
                <PlacesAutocomplete
                  value={addressDistension}
                  onChange={setAddressDistension}
                  onSelect={handleDistension}
                  debounce={200}
                >
                  {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>
                      <input
                        className="input-style-map"
                        {...getInputProps({
                          placeholder: "Please Type distension Address",
                        })}
                      />

                      <div style={{ borderRadius: "10px" }}>
                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#41b6e6"
                              : "#fff",
                          };

                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                style,
                              })}
                            >
                              <div
                                style={{
                                  textAlign: "left",
                                  paddingLeft: "10px",
                                }}
                              >
                                {suggestion.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
            </div>
          </Container>
          <div className="map-button-bottom">
            <div className="map-button-2">
              <button className="btn" onClick={backButton}>
                <FaLongArrowAltLeft />
                <br />
                <span>Back</span>
              </button>
              <button className="btn btn-2" onClick={nextPage}>
                <FaMapMarkerAlt />
              </button>
              <button className="btn" onClick={refreshButton}>
                <BsArrowRepeat /> <br /> <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  car: state.car,
});
export default connect(mapStateToProps, { getAllStation })(withRouter(MainMap));
