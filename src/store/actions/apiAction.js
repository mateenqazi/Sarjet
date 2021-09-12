import axios from "axios";
import { GET_ALL_CARS, GET_ALL_STATIONS } from "./types";

const backendServerURL = process.env.REACT_APP_API_URL;

export const getAllCar = () => (dispatch) => {
  axios
    .post(backendServerURL + "getAllCars", {})
    .then((res) => {
      dispatch({ type: GET_ALL_CARS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: GET_ALL_CARS, payload: [] });
    });
};

export const getAllStation = () => (dispatch) => {
  axios
    .post(backendServerURL + "getAllStations", {})
    .then((res) => {
      console.log("res", res.data);
      dispatch({ type: GET_ALL_STATIONS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: GET_ALL_STATIONS, payload: [] });
    });
};
