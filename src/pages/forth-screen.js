import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { getAllStation } from "../store/actions/apiAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { findNearest } from "geolib";
// import { FaChargingStation } from "react-icons/fa";
import {
  FaLongArrowAltLeft,
  FaMapMarkerAlt,
  FaChargingStation,
} from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
const {
  MarkerClusterer,
} = require("react-google-maps/lib/components/addons/MarkerClusterer");
const Map = (props) => {
  const [stations, setStations] = useState([]);
  const [sourceLongitude, setSourceLongitude] = useState(null);
  const [sourceLatitude, setSourceLatitude] = useState(null);

  const [listCoordinate, setListCoordinate] = useState([]);
  const [nearest5Stations, setNearest5Stations] = useState([]);
  useEffect(() => {
    props.getAllStation();
    setSourceLongitude(
      parseFloat(new URLSearchParams(props.location.search).get("source_lng"))
    );
    setSourceLatitude(
      parseFloat(new URLSearchParams(props.location.search).get("source_lat"))
    );
  }, []);
  useEffect(() => {
    setStations(props.car.stations);
    findNearestStation();
  }, [props.car.stations !== stations]);
  const backButton = () => {
    props.history.goBack();
  };

  const refreshButton = () => {
    window.location.reload();
  };
  const findNearestStation = async () => {
    let allLocations = stations; //want to copy all stataion in new array
    for (let i = 0; i < allLocations.length; i++) {
      allLocations[i].latitude = parseFloat(allLocations[i]["Latitude"]);
      allLocations[i].longitude = parseFloat(allLocations[i]["Longitude"]);
      delete allLocations[i].Longitude;
      delete allLocations[i].Latitude;
    }
    let nearest5Stations = [];
    let station = [];
    for (let i = 0; i < 5; i++) {
      station = findNearest(
        {
          latitude: parseFloat(
            new URLSearchParams(props.location.search).get("source_lng")
          ),
          longitude: parseFloat(
            new URLSearchParams(props.location.search).get("source_lat")
          ),
        },
        allLocations
      );
      console.log("station", station);
      nearest5Stations.push({
        lat: station?.latitude,
        lng: station?.longitude,
      });

      allLocations = allLocations.filter((data) => data.id != station.id);
    }
    setNearest5Stations(nearest5Stations);
    console.log("nearest5Stations", nearest5Stations, nearest5Stations.length);
  };
  const iconMarker = new window.google.maps.MarkerImage(
    FaChargingStation,
    null /* size is determined at runtime */,
    null /* origin is 0,0 */,
    null /* anchor is bottom center of the scaled image */,
    new window.google.maps.Size(32, 32)
  );
  return (
    <div>
      <GoogleMap
        center={{
          lat: parseFloat(
            new URLSearchParams(props.location.search).get("source_lat")
          ),
          lng: parseFloat(
            new URLSearchParams(props.location.search).get("source_lng")
          ),
        }}
        zoom={5}
        //onLoad={(map) => onMapLoad(map)}
        mapContainerStyle={{ height: "100vh", width: "100wh" }}
      >
        <Marker
          position={{
            lat: sourceLatitude,
            lng: sourceLongitude,
          }}
          animation={window.google.maps.Animation.BOUNCE}
        />
        <MarkerClusterer averageCenter enableRetinaIcons gridSize={2}>
          {nearest5Stations?.length &&
            nearest5Stations.map((park) => (
              <Marker
                icon={{
                  url: "https://img.icons8.com/material-rounded/24/000000/gas-station.png",
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
                position={{
                  lat: parseFloat(park.lat),
                  lng: parseFloat(park.lng),
                }}
              />
            ))}
        </MarkerClusterer>
      </GoogleMap>
      <div className="map-button-bottom">
        <div className="map-button-2">
          <button className="btn" onClick={backButton}>
            <FaLongArrowAltLeft />
            <br />
            <span>Back</span>
          </button>

          <button className="btn" onClick={refreshButton}>
            <BsArrowRepeat /> <br /> <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  car: state.car,
});
export default connect(mapStateToProps, { getAllStation })(withRouter(Map));
