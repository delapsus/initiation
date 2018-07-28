import React from 'react';

export class PersonLink extends React.Component {
    render() {
        if (this.props.person) {
            let link = "index.html?personid=" + this.props.person.personId;
            return <a href={link}>{this.props.person.data.firstName} {this.props.person.data.lastName}</a>;
        }
        else if (this.props.altName) {
            return <span>{this.props.altName}</span>;
        }
        else if (this.props.altNameFirst || this.props.altNameLast) {
            return <span>{this.props.altNameFirst} {this.props.altNameLast}</span>;
        }
        return <span></span>;
    }
}
