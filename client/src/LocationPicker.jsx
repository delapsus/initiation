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

export function submitLocationPicker(data) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-location-picker", {location:data}, result => {
            result = JSON.parse(result);
            resolve(result.locationId);
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

    // handle name change
    handleTextChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    handleSelectChange (event) {
        const target = event.target;
        let value = (target.type === 'checkbox' ? target.checked : target.value).trim();
        value = +value;
        this.setState({ locationId: value });
    }

    async save() {

        // if the ID is -1, we'll need to create the location record
        if (this.state.locationId === -1) {
            let locationId = await submitLocationPicker({
                name: name
            });
            return locationId;
        }

        // otherwise just use the selected value
        return this.state.locationId;
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
            <td><input type="text" name="name" value={this.state.name} onChange={this.handleTextChange.bind(this)} autoComplete="new-password" /></td>
        </tr>);

        if (this.state.suggestions !== null) {

            picks.push(<tr key={-1}>
                <td><input type="radio" name={this.props.name + "Radio"} value={-1} onChange={this.handleSelectChange.bind(this)} /></td>
                <td colSpan="3">Create a Location Entry</td>
            </tr>);

            this.state.suggestions.locations.forEach((location, i) => {
                picks.push(<tr key={i}>
                    <td><input type="radio" name={this.props.name + "Radio"} value={location.locationId} onChange={this.handleSelectChange.bind(this)} checked={location.locationId === this.state.locationId} /></td>
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