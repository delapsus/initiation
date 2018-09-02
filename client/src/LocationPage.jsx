import React from 'react';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {InitiationDisplay} from './InitiationDisplay.jsx';
import {getLocationWithData} from "./webservice";

export class LocationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null
        };
    }

    getLocationData() {
        getLocationWithData(this.props.locationId).then(result => {
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

        let editLink = "index.html?page=edit-location&locationid=" + data.locationId;

        return <div>

            <div className="pageTitleDiv">
                <span className="pageTitle">Location</span> | <a href={editLink}>Edit Location Data</a>
            </div>

            <table className="locationInfo" style={{marginBottom:"1em"}}><tbody>
            <tr>
                <td className="label">Name</td>
                <td className="label">Type</td>
                <td className="label">City</td>
                <td className="label">State</td>
            </tr>
            <tr>
                <td>{data.data.name}</td>
                <td>{data.data.type}</td>
                <td>{data.data.city}</td>
                <td>{data.data.state}</td>
            </tr>
            </tbody></table>

        </div>;
    }
}
