import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getAllCar } from "../../store/actions/apiAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
const Homepage = (props) => {
  const [car, setCar] = useState([]);
  const [cartype, setCartype] = useState("");
  const [list, setList] = useState({});
  const [carModel, setCarModel] = useState("");

  useEffect(() => {
    props.getAllCar();
  }, []);

  useEffect(() => {
    setCar(props.car.cars);
    const list1 = car.reduce((r, a) => {
      r[a.Brand] = r[a.Brand] || [];
      r[a.Brand].push(a);
      return r;
    }, Object.create(null));
    console.log(list1);
    setList(list1);
  }, [props.car.cars != car]);

  const changeCarType = (e) => {
    e.preventDefault();
    setCartype(e.target.value);
    setCarModel("");
    {
      list &&
        list[cartype]?.length &&
        list[cartype].map((item, key) => (
          <option value={item.ID}>
            Model: {item.Model} Year: {item.reveal}
          </option>
        ));
    }
  };

  const changeCarModel = (e) => {
    e.preventDefault();
    setCarModel(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (carModel !== "") {
      props.history.push("/main-map?id=" + carModel);
    } else {
      alert("Please Select Car Information First.");
    }
  };
  return (
    <div className="main-div">
      <div className="overlay">
        <Container className="main-page">
          <div className="main-section text-center p-4">
            <h2>Sarjet</h2>
            <p>Expolore world with us, we make your journey easy</p>
            <br />
            <form className="text-left" onSubmit={submitHandler}>
              <label>Select Your Vehicles</label>
              <select
                id=""
                className="dropdown-style"
                value={cartype}
                onChange={(e) => changeCarType(e)}
              >
                <option value="">Select Car</option>
                {Object.keys(list).map((key) => (
                  <option value={key}>{key}</option>
                ))}
              </select>
              <br />
              <div>
                <label>Select Your Vehicles Model</label>
                <select
                  id=""
                  className="dropdown-style"
                  value={carModel}
                  onChange={(e) => changeCarModel(e)}
                >
                  <option value="">Select Car Model</option>
                  {list &&
                    list[cartype]?.length &&
                    list[cartype].map((item, key) => (
                      <option value={item.ID}>
                        Model: {item.Model} Year: {item.reveal}
                      </option>
                    ))}
                </select>
              </div>
              <br />
              <div className="text-center">
                <button className="btn btn-1 mx-auto" type="submit">
                  Start Your Journey
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  car: state.car,
});
export default connect(mapStateToProps, { getAllCar })(withRouter(Homepage));
