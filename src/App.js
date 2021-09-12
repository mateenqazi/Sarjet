import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Homepage from "./pages/homePage/first-screen";
import MainMap from "./pages/second-screen";
import MainScreen from "./pages/third-screen";
import ForthStation from "./pages/forth-screen";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/main-map" component={MainMap} />
          <Route exact path="/main-screen" component={MainScreen} />
          <Route exact path="/NearStations" component={ForthStation} />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
