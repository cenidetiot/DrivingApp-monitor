import React from 'react';
import SideBar from "./Views/SideBar"
import Nav from "./Views/Nav"

import Alerts from "./Views/Alerts"
import Awards from "./Views/Awards"

//import Map from './Views/Components/Map'
//import MapMutant from './Views/Components/MapMuntant'
//import Map from './Views/Components/ReactLeafletMap'
import Map from './Views/Components/GoogleMap'

import { BrowserRouter as Router, Route} from "react-router-dom";

import { loadCategoryAlerts , loadSeverityAlerts, loadZoneAlerts} from './Redux/Actions/index';
import store from './Redux/Reducers/index'

import io from 'socket.io-client';


export default class App extends React.Component {
    constructor (props){
      super(props);
      this.getAlertsCategory = this.getAlertsCategory.bind(this);
      this.getAlertsSeverity = this.getAlertsSeverity.bind(this);
      this.getAlertsZone = this.getAlertsZone.bind(this);
      this.socket = io.connect(`https://drivingapp-monitor-back.herokuapp.com/`)//, { transports: ['websocket'] });
      this.state = {
          chanel : "",
          interval : null
      }
      
  }

  getAlertsCategory () {
      fetch("https://drivingapp-monitor-back.herokuapp.com/alerts/count/category")
      .then((result) => {
          return result.json()
      })
      .then(data => {
          store.dispatch(loadCategoryAlerts(data))
      })
      .catch(console.log)
  }

  getAlertsSeverity () {
      fetch("https://drivingapp-monitor-back.herokuapp.com/alerts/count/severity")
      .then((result) => {
          return result.json()
      })
      .then(data => {
          store.dispatch(loadSeverityAlerts(data))         
      })
      .catch(console.log)
  }

  getAlertsZone () {
      fetch("https://drivingapp-monitor-back.herokuapp.com/alerts/count/zone")
      .then((result) => {
          return result.json();
      })
      .then(data =>{
          store.dispatch(loadZoneAlerts(data))      
      })
      .catch(console.log)
      var interval = setInterval(() => {
          fetch("https://drivingapp-monitor-back.herokuapp.com/alerts/count/zone")
          .then((result) => {
              return result.json();
          })
          .then(data =>{
              store.dispatch(loadZoneAlerts(data))      
          })
          .catch(console.log)
      }, 60000)

      this.setState({
          interval
      })
      
  }

  componentDidMount(){
      this.socket.on('severityalerts', (data) =>store.dispatch(loadSeverityAlerts(data)));
      this.socket.on('categoryalerts', (data) =>store.dispatch(loadCategoryAlerts(data)));
      this.socket.on('zonealerts' , (data) =>store.dispatch(loadZoneAlerts(data)));
      this.getAlertsCategory();
      this.getAlertsSeverity();
      this.getAlertsZone();
  }

  componentWillUnmount () {
      clearInterval(this.state.interval);
  }

  
  
  render() {
    return (
      <Router>
        <div>
          <Route path="/:active?" component={Nav} />
          <Route path="/:active?" component={SideBar} />
          <Route exact path="/" basename="/alerts" component={Alerts} />
          <Route exact path="/awards" component={Awards} />
          <Route exact path="/map" component={Map} />
        </div>
      </Router>
    );
  }
}
