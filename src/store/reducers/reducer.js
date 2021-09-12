import { GET_ALL_CARS, GET_ALL_STATIONS } from "../actions/types";
const initialState = {
  cars: [],
  stations: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_CARS:
      return {
        ...state,
        cars:
          action.payload &&
          action.payload.cars &&
          action.payload.cars.length > 0
            ? action.payload.cars
            : [],
      };
    case GET_ALL_STATIONS:
      return {
        ...state,
        stations:
          action.payload &&
          action.payload.stations &&
          action.payload.stations.length > 0
            ? action.payload.stations
            : [],
      };
    default:
      return state;
  }
}
