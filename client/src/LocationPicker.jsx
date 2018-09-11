import React from "react";
import {postAjax} from "./http";

function getLocations(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/locations", {pageSize:10, index: 0, textSearch: state.textSearch}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class LocationPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            locationId: null,
            suggestions: null
        };

    }

    handleChange (event) {
        const target = event.target;
        let value = (target.type === 'checkbox' ? target.checked : target.value);
        let name = target.name;
        const key = this.props.name + "Radio";

        if (name === key) name = 'locationId';

        if (name === 'locationId') value = +value;

        this.setState({
            [name]: value
        });

        // pass up an on change
        if (name === 'locationId' && this.props.hasOwnProperty('onChange')) {

            this.sendChange(value, {
                name: this.state.name
            });

        }
        else {
            let data = {
                name: this.state.name
            };

            data[name] = value;

            this.sendChange(this.state.locationId, data);
        }
    }

    sendChange(locationId, data) {

        // pass up an on change
        if (this.props.hasOwnProperty('onChange')) {

            let location = {
                locationId: locationId
            };

            // indicates that this is a new location, pass the data
            if (location.locationId === -1) {
                location.locationId = -1;
                location.data = data;
            }

            this.props.onChange({
                target:{
                    type: 'LocationPicker',
                    name: this.props.name,
                    nameNew: this.props.nameNew,
                    location: location
                }
            });
        }
    }


    getData() {

        if (this.state.name.length === 0) {
            this.setState({suggestions: null});
            return;
        }


        let combined = this.state.name;
        getLocations({textSearch:combined.trim()}).then(result => {

            let locationId = this.state.locationId;

            if (locationId !== null && locationId !== -1) {
                // if locationId is not in the new result set, reset it
                let found = false;
                result.locations.forEach(location => {
                    if (location.locationId === locationId) found = true;
                });

                this.setState({suggestions: result, locationId: found ? locationId : null});

                if (!found) this.sendChange(null, null);
            }
            else {
                this.setState({suggestions: result});
            }

        });
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.name === this.state.name) return;
        this.getData();
    }

    render() {

        let picks = [];

        picks.push(<tr key={-2}>
            <td className="indentBlock"></td>
            <td><input type="text" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} autoComplete="new-password" /></td>
        </tr>);

        if (this.state.suggestions !== null) {

            picks.push(<tr key={-1}>
                <td><input type="radio" name={this.props.name + "Radio"} value={-1} onChange={this.handleChange.bind(this)} /></td>
                <td colSpan="3">Create a Location Entry</td>
            </tr>);

            this.state.suggestions.locations.forEach((location, i) => {
                picks.push(<tr key={i}>
                    <td><input type="radio" name={this.props.name + "Radio"} value={location.locationId} onChange={this.handleChange.bind(this)} checked={location.locationId === this.state.locationId} /></td>
                    <td>{location.data.name}</td>
                </tr>);
            });

        }

        return <div className="personPicker">
            <input type="hidden" value="something"/>

            <table className="noPad">
                <thead>
                <tr>
                    <th></th>
                    <th className="formItemTitle">Name</th>
                </tr>
                </thead>
                <tbody>{picks}</tbody>
            </table>

        </div>;
    }

}