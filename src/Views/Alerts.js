
import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import CategoryAlerts from './Components/Alerts/Category/CategoryAlerts';
import SubcategoryAlerts from './Components/Alerts/Subcategory/SubcategoryAlerts';
import SeverityAlerts from './Components/Alerts/Severity/SeverityAlerts';
import ZoneAlerts from './Components/Alerts/Zones/ZoneAlerts';

import { loadCategoryAlerts , loadSeverityAlerts, loadZoneAlerts} from '../Redux/Actions/index';
import store from '../Redux/Reducers/index'

import io from 'socket.io-client';


export default class Alerts extends React.Component {

    constructor (props){
        super(props);
        this.getAlertsCategory = this.getAlertsCategory.bind(this);
        this.getAlertsSeverity = this.getAlertsSeverity.bind(this);
        this.getAlertsZone = this.getAlertsZone.bind(this);
        this.socket = io.connect(`https://drivingapp-monitor.herokuapp.com`)//, { transports: ['websocket'] });
        this.state = {
            chanel : "",
            interval : null
        }
        
    }

    getAlertsCategory () {
        fetch("https://drivingapp-monitor.herokuapp.com/alerts/count/category")
        .then((result) => {
            return result.json()
        })
        .then(data => {
            store.dispatch(loadCategoryAlerts(data))
        })
        .catch(console.log)
    }

    getAlertsSeverity () {
        fetch("https://drivingapp-monitor.herokuapp.com/alerts/count/severity")
        .then((result) => {
            return result.json()
        })
        .then(data => {
            store.dispatch(loadSeverityAlerts(data))         
        })
        .catch(console.log)
    }

    getAlertsZone () {
        fetch("https://drivingapp-monitor.herokuapp.com/alerts/count/zone")
        .then((result) => {
            return result.json();
        })
        .then(data =>{
            store.dispatch(loadZoneAlerts(data))      
        })
        .catch(console.log)
        var interval = setInterval(() => {
            fetch("https://drivingapp-monitor.herokuapp.com/alerts/count/zone")
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
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <li>
                            <NavLink exact className="nav-item nav-link" activeClassName='active'  to="/">Category</NavLink>
                        </li>
                        <li>
                            <NavLink className="nav-item nav-link" activeClassName='active' to="/sub">Subcategory</NavLink>
                        </li>
                        <li>
                            <NavLink className="nav-item nav-link" activeClassName='active' to="/severity">Severity</NavLink>
                        </li>
                        <li>
                            <NavLink className="nav-item nav-link" activeClassName='active' to="/zones">Zones</NavLink>
                        </li>
                    </div>
                </nav>

                <div style={{marginTop : 10}}>

                </div>

                <Route exact path="/" component={CategoryAlerts} />
                <Route path="/sub" component={SubcategoryAlerts} />
                <Route path="/severity" component={SeverityAlerts} />
                <Route path="/zones" component={ZoneAlerts} />

            </div>
        </Router>
        )
    }
}
