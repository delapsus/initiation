import React from 'react';
import {postAjax} from './http';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {InitiationDisplay} from './InitiationDisplay.jsx';

function getLocation(locationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/location", {locationId: locationId}, result => {
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
        if (this.state.location.initiationsPerformed) {
            this.state.location.initiationsPerformed.forEach((o, i) => {
                inits.push(<InitiationDisplay initiation={o} key={i} showPerson={true} showLocation={false} />);
            });
        }



        //let html = {__html: putObjectInLines(this.state.location)};
        let html = {__html: "<div></div>"};
        return <div className="locationPage">
            <LocationInformation location={this.state.location} />
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
                <td className="label">Name</td>
                <td className="label">Type</td>
                <td className="label">City</td>
                <td className="label">State</td>
            </tr>
            <tr>
                <td><input type="text" value={data.data.name} /></td>
                <td><input type="text" value={data.data.type} /></td>
                <td><input type="text" value={data.data.city} /></td>
                <td><input type="text" value={data.data.state} /></td>
            </tr>
            </tbody></table>


        </div>;
    }
}
