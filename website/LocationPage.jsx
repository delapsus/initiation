import React from 'react';
import {postAjax} from './http';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {InitiationDisplay} from './InitiationDisplay.jsx';

function getLocation(locationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/location", {locationId: locationId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class LocationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null
        };
    }

    getLocationData() {
        getLocation(this.props.locationId).then(result => {
            this.setState({
                location: result
            });
        });
    }

    componentDidMount() {
        this.getLocationData();
    }

    render() {

        if (this.state.location === null) return <div></div>;

        let inits = [];
        if (this.state.location.initiations) {
            this.state.location.initiations.forEach((o, i) => {
                inits.push(<InitiationDisplay initiation={o} key={i} />);
            });
        }
        // <LocationInformation location={this.state.location} />
        let html = {__html: putObjectInLines(this.state.location)};
        return <div className="locationPage">

            {inits}
            <br/><br/><br/>
            <div dangerouslySetInnerHTML={html} />
        </div>;
    }

}

export class LocationInformation extends React.Component {
    render() {
        let data = this.props.location;
        return <div>

            { /* name/motto */ }
            <table><tbody>
            <tr>
                <td className="label">First Name</td>
                <td className="label">Middle</td>
                <td className="label">Last</td>
                <td className="label">Motto</td>
            </tr>
            <tr>
                <td><input type="text" value={data.firstName} /></td>
                <td><input type="text" value={data.middleName} /></td>
                <td><input type="text" value={data.lastName} /></td>
                <td><input type="text" value={data.motto} /></td>
            </tr>
            </tbody></table>


        </div>;
    }
}
