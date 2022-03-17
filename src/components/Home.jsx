// imports
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import './Home.css'

const Home = () => {
  // hooks
  const [routeBtnActive, setRouteBtnActive] = useState(true)
  const [routes, setRoutes] = useState([])
  const [directions, setDirections] = useState([])
  const [stops, setStops] = useState([])

  // get all avaiable routes
  useEffect(() => {
    fetch('https://svc.metrotransit.org/nextripv2/routes')
      .then((res) => res.json())
      .then((data) => setRoutes(data))
  }, [])

  // on routes input change
  const onRoutesChange = async (e) => {
    const route_id = e.target.value
    const response = await fetch(
      `https://svc.metrotransit.org/nextripv2/directions/${route_id}`
    )

    const directions = await response.json()

    const addRouteId = directions.map((direction) => ({
      ...direction,
      route_id,
    }))

    setDirections(addRouteId)
  }

  // on direction input change
  const onDirectionChange = async (e) => {
    const data = e.target.value
    const { direction_id, route_id } = JSON.parse(data)

    // get the avaiable stops
    const response = await fetch(
      `https://svc.metrotransit.org/nextripv2/stops/${route_id}/${direction_id}`
    )

    const stops = await response.json()
    console.log(stops)
    setStops(stops)
  }

  // on stop input change
  const onStopChange = (e) => {}

  return (
    <main className="main">
      <div className="container d-flex flex-column mt-5 align-items-center">
        {/* heading */}
        <h1 className="real_time_depart_heading pt-4 pb-5">
          Real-time Departures
        </h1>

        {/* route buttons */}
        <div className="route_btns_container mb-4">
          <button
            className={routeBtnActive ? 'active' : ''}
            onClick={() => setRouteBtnActive(true)}
            id="by_route"
          >
            By route
          </button>
          <button
            className={routeBtnActive ? '' : 'active'}
            onClick={() => setRouteBtnActive(false)}
            id="by_stop"
          >
            By stop #
          </button>
        </div>

        {/* main input section */}
        <div className="route_main_section_container w-50">
          {/* select route */}
          <div className="select_route mt-3 mb-3">
            <select
              className="form-select  form-select-lg mb-3 full-width"
              aria-label="Default select example"
              onChange={onRoutesChange}
            >
              <option value="select route">Select route</option>

              {routes.map((route) => (
                <option key={route.route_id} value={route.route_id}>
                  {route.route_label}
                </option>
              ))}
            </select>
          </div>
          {/* select direction */}
          {directions.length > 0 && (
            <div className="select_direction mt-3 mb-3">
              <select
                className="form-select  form-select-lg mb-3 full-width"
                aria-label="Default select example"
                onChange={onDirectionChange}
              >
                <option value="select direction">Select direction</option>
                {directions.map((direction) => (
                  <option
                    key={direction.direction_id}
                    value={`{"direction_id":"${direction.direction_id}","route_id": ${direction.route_id}}`}
                  >
                    {direction.direction_name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* select available stops */}
          {stops.length > 0 && (
            <div className="select_stops mt-3 mb-3">
              <select
                className="form-select  form-select-lg mb-3 full-width"
                aria-label="Default select example"
                onChange={onStopChange}
              >
                <option value="select stop">Select stop</option>
                {stops.map((stop) => (
                  <option key={stop.place_code} value="hello">
                    {stop.description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* departure table */}
        <div className="departure_table_container my-5 w-75">
          {/* head part */}
          <div className="stop-description">
            <h3 className="stop-name">Terminal 1 Lindbergh Station</h3>
            <span className="stop-number">
              <strong>Stop #: </strong>51419
            </span>
          </div>

          {/* main table part */}
          <div className="stop-departures">
            <Table striped bordered hover size="lg">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Destination</th>
                  <th>Depart</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
