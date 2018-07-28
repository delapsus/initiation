import React from 'react';
import {postAjax} from './http';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {LocationLink} from './LocationLink.jsx';

function getInitiation(initiationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/initiation", {initiationId: initiationId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class InitiationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initiation: null
        };
    }

    getData() {
        getInitiation(this.props.initiationId).then(result => {
            this.setState({
                initiation: result
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    /*

        addLocation(initiation);
        addOfficers(initiation);

        // also the people initiated at the same time?
     */

    render() {

        if (this.state.initiation === null) return <div></div>;

        //let html = {__html: putObjectInLines(this.state.initiation)};
        let html = {__html:  "<div></div>"};

        let init = this.state.initiation;

        let officers = init.data.officers.map(o => {
            return <div>{o.officer.name}: <PersonLink person={o.person} altName={o.name} /></div>
        });

        let otherPeople = init.otherPeople.map(p => {
            return <div><PersonLink person={p} /></div>
        });


        return <div className="initiationPage">

            <div>Degree: {init.degree.name}</div>
            <div>Person: <PersonLink person={init.person} /></div>
            <div>Location: <LocationLink location={init.location} altName={init.data.location}></LocationLink></div>
            <div>Sponsor 1: <PersonLink person={init.sponsor1_person} altNameFirst={init.data.sponsor1First} altNameLast={init.data.sponsor1Last} /></div>
            <div>Sponsor 2: <PersonLink person={init.sponsor2_person} altNameFirst={init.data.sponsor2First} altNameLast={init.data.sponsor2Last} /></div>
            {officers}
            <div>Other People:</div>
            {otherPeople}
            <div dangerouslySetInnerHTML={html} />
        </div>;
    }

}
