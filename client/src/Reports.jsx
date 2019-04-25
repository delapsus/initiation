import React from 'react';

export class Reports extends React.Component {
    render() {

        return <div>
            Reports
            <a href={"/report/annual?year=2016"}>2016</a>
        </div>;
    }
}
