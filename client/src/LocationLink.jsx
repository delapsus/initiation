import React from 'react';

export class LocationLink extends React.Component {
    render() {
        if (this.props.location) {
            let link = "index.html?locationid=" + this.props.location.locationId;
            return <a href={link}>{this.props.location.data.name}</a>;
        }
        else if (this.props.altName) {
            return <span>{this.props.altName}</span>;
        }
        return <span></span>;
    }
}
