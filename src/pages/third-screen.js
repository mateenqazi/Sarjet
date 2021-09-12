import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  Polyline,
  useLoadScript,
} from "@react-google-maps/api";
import { getAllCar } from "../store/actions/apiAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  FaLongArrowAltLeft,
  FaMapMarkerAlt,
  FaChargingStation,
  FaLocationArrow,
} from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import AllStation from "../data/allStation.json";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
let directionsService;
const Map = (props) => {
  const [defaultLocation, setDefaultLocation] = useState({
    lat: parseFloat(
      new URLSearchParams(props.location.search).get("source_lat")
    ),
    lng: parseFloat(
      new URLSearchParams(props.location.search).get("source_lng")
    ),
  });
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [directions, setDirections] = useState(null);
  const [car, setCar] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [coordinatesSource, setCoordinatesSource] = useState({
    lat: null,
    lng: null,
  });

  const [listCoordinate, setListCoordinate] = useState([]);
  const [wayPoint, setWayPoint] = useState([]);
  const [wayPoint2, setWayPoint2] = useState([]);
  const [coordinatesDistension, setCoordinatesDistension] = useState({
    lat: null,
    lng: null,
  });
  useEffect(() => {
    props.getAllCar();
    setCoordinatesSource({
      lat: parseFloat(
        new URLSearchParams(props.location.search).get("source_lat")
      ),
      lng: parseFloat(
        new URLSearchParams(props.location.search).get("source_lng")
      ),
    });
    setCoordinatesDistension({
      lat: parseFloat(
        new URLSearchParams(props.location.search).get("distension_lat")
      ),
      lng: parseFloat(
        new URLSearchParams(props.location.search).get("distension_lng")
      ),
    });
    console.log("AllStation", AllStation);
    const WayPoint = AllStation.stations.slice(0, 10);
    console.log("WayPoint", WayPoint, WayPoint.length);
    setListCoordinate((prevItems) => [...prevItems]);
    setWayPoint(WayPoint);
    console.log("wayPOINT 0000", wayPoint);

    setListCoordinate([
      {
        lat: parseFloat(
          new URLSearchParams(props.location.search).get("source_lat")
        ),
        lng: parseFloat(
          new URLSearchParams(props.location.search).get("source_lng")
        ),
      },
      {
        lat: parseFloat(
          new URLSearchParams(props.location.search).get("distension_lat")
        ),
        lng: parseFloat(
          new URLSearchParams(props.location.search).get("distension_lng")
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    const getOneCar = props.car.cars.find(
      (x) => x.ID === new URLSearchParams(props.location.search).get("id")
    );
    setCar(props.car.cars);
    setSelectedCar(getOneCar);
    console.log("selectedCar", selectedCar);
  }, [props.car.cars !== car]);
  const nextPage = () => {
    if (coordinatesSource.lat !== null && coordinatesSource.lng !== null)
      props.history.push(
        "/NearStations?source_lng=" +
          coordinatesSource.lng +
          "&source_lat=" +
          coordinatesSource.lat
      );
    else {
      alert("Please Select Source and Distension First.");
    }
  };
  const getStationsWayPoints = () => {
    let distanceMayCovered =
      parseInt(selectedCar?.Real_Consumption_kWh100_km) * 1000; ///in meters

    let distanceHasCoverd = 0;
    let statusfound = true;
    let totaldistance = 0;
    let waypointStations = [];
    //let currentPoint = polylineCoords[0];
    console.log("distanceMayCovered", distanceMayCovered);
  };
  const onMapLoad = (map) => {
    directionsService = new window.google.maps.DirectionsService();
    changeDirection(coordinatesSource, coordinatesDistension);
    getStationsWayPoints();
  };
  const backButton = () => {
    props.history.goBack();
  };

  const refreshButton = () => {
    window.location.reload();
  };
  //function that is calling the directions service
  const changeDirection = (origin, destination) => {
    directionsService.route(
      {
        origin: {
          lat: parseFloat(
            new URLSearchParams(props.location.search).get("source_lat")
          ),
          lng: parseFloat(
            new URLSearchParams(props.location.search).get("source_lng")
          ),
        },
        destination: {
          lat: parseFloat(
            new URLSearchParams(props.location.search).get("distension_lat")
          ),
          lng: parseFloat(
            new URLSearchParams(props.location.search).get("distension_lng")
          ),
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("result", result);
          console.log("routesssssss", result.routes[0].legs[0].steps);
          setWayPoint2(result.routes[0].legs[0].steps);
          console.log("routes", result.routes[0].overview_path);
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  const onLoad1 = () => {
    console.log("onload", listCoordinate);
    setDirections(true);
  };
  console.log("listCoordinate", listCoordinate);
  console.log("pakakskkakaskkd", wayPoint2);
  return (
    <div>
      <GoogleMap
        center={defaultLocation}
        zoom={10}
        onLoad={(map) => onMapLoad(map)}
        mapContainerStyle={{ height: "100vh", width: "100wh" }}
      >
        {directions !== null && <DirectionsRenderer directions={directions} />}
        {/* {directions !== null && (
          <Polyline
            onLoad={onLoad1}
            path={listCoordinate}
            options={{
              strokeColor: "#669DF6",
              strokeWeight: 2,
              strokeOpacity: 1.0,
            }}
          />
        )} */}
        {listCoordinate?.length &&
          listCoordinate.map((park) => (
            <Marker
              position={{
                lat: parseFloat(park.lat),
                lng: parseFloat(park.lng),
              }}
            />
          ))}
        <Marker />
      </GoogleMap>
      <div>
        <Modal open={open} onClose={onCloseModal} center>
          <h1 style={{ textAlign: "center" }}>Nearest Stations</h1>
          {wayPoint?.length &&
            wayPoint.map((item, key) => {
              return (
                <div
                  key={key}
                  style={{
                    borderBottom: "1px solid #ccc",
                    marginBottom: "10px",
                  }}
                >
                  <h6 style={{ marginBottom: "0px" }}> {item?.StationFlag}</h6>
                  <div>{item?.adress}</div>
                </div>
              );
            })}
        </Modal>
      </div>
      <div className="map-button-bottom">
        <div className="map-button-2">
          <button className="btn" onClick={backButton}>
            <FaLongArrowAltLeft />
            <br />
            <span>Back</span>
          </button>
          <button className="btn btn-2" onClick={nextPage}>
            <FaChargingStation />
          </button>

          <button className="btn btn-2" onClick={onOpenModal}>
            <FaLocationArrow />
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
export default connect(mapStateToProps, { getAllCar })(withRouter(Map));
