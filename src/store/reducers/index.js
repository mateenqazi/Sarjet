import { combineReducers } from "redux";
import Car from "./reducer";
export default combineReducers({
  car: Car,
});
