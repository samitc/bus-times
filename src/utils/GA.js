import ReactGA from 'react-ga'

const GA_ID = 'UA-000000000-0';

function initializeGA() {
    ReactGA.initialize(GA_ID);
    ReactGA.pageview(window.location.pathname + window.location.search);
}

function dataToString(data) {
    let strData;
    if (Array.isArray(data)) {
        const l = data.length;
        strData = data[0].id.toString();
        for (let i = 1; i < l; i++) {
            strData += "," + data[i].id.toString();
        }
    } else {
        strData = data
    }
    return strData
}

function chooseStation(station) {
    ReactGA.event({category: 'Data', action: 'choose station', label: 'stationId' + dataToString(station)})
}

function chooseBusStation(station, bus) {
    ReactGA.event({
        category: 'Data',
        action: 'choose station and bus',
        label: 'stationId:' + station + ' busId:' + dataToString(bus)
    })
}

export {initializeGA, chooseStation, chooseBusStation};