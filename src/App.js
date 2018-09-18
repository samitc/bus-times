import React, {Component} from 'react';
import './App.css';
import Stations from "./ui/Stations";
import Buses from "./ui/Buses";
import BusesTimes from "./ui/BusesTimes";

class App extends Component {

    constructor() {
        super();
        this.state = {stationId: null, busId: null};
    }

    render() {
        const stationChange = (stationId) => {
            this.setState({stationId: stationId, busId: null})
        };
        const busChange = (busId) => {
            this.setState({busId: busId.value});
        };
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">זמני אוטובוס</h1>
                </header>
                <p className="App-intro">
                    בחר תחנה ומספר קו והזמנים יופיעו למטה
                </p>
                <Stations
                    selectedChanged={stationChange}
                />
                <Buses
                    stationId={this.state.stationId}
                    selectedChange={busChange}
                />
                {this.state.busId !== null &&
                <BusesTimes stationId={this.state.stationId} busId={this.state.busId}/>
                }
            </div>
        );
    }
}

export default App;
