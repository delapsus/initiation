import React from 'react';

export class Home extends React.Component {
    render() {

        return <div>
            <div><a href="index.html?page=people">People Search</a></div>
            <div><a href="index.html?page=locations">Locations</a></div>
            <div><a href="index.html?page=application">Enter a new application</a></div>
            <div><a href="index.html?page=person-select">Person Select Widget Test</a></div>
        </div>;
    }
}
