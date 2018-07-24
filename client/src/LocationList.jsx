import React from 'react';
import {postAjax} from './http';

function getLocations() {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/locations", {}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class LocationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: null
        };
    }
    getData() {
        getLocations().then(result => {
            this.setState({
                locations: result.locations
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        if (this.state.locations === null || this.state.locations.length === 0) return <div>loading...</div>;

        let a = [];

        this.state.locations.forEach((location, i) => {

            a.push(<tr key={i}>
                <td><a href={"?locationid=" + location.locationId}>view</a></td>
                <td>{location.data.name}</td>
                <td>{location.data.type}</td>
                <td>{location.data.city}</td>
                <td>{location.data.state}</td>
            </tr>);

        });

        return <table><tbody>{a}</tbody></table>;
    }
}
