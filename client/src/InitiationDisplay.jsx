import React from 'react';
import {getDegreeById} from './degree';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {LocationLink} from './LocationLink.jsx';


export class InitiationDisplay extends React.Component {
    render() {
        let o = this.props.initiation;

        // degree info
        let degree = getDegreeById(+o.data.degreeId);

        let actualDate = formatDate(o.data.actualDate);

        let personLink = this.props.showPerson ? <div className="field person"><PersonLink person={o.person} /></div> : "";

        // sponsors
        let sponsor1 = <div className="field person"><PersonLink person={o.sponsor1_person} altNameFirst={o.data.sponsor1First} altNameLast={o.data.sponsor1Last} /></div>;
        let sponsor2 = <div className="field person"><PersonLink person={o.sponsor2_person} altNameFirst={o.data.sponsor2First} altNameLast={o.data.sponsor2Last} /></div>;
        if (this.props.dontShowIf) {
            if (this.props.dontShowIf.personId === o.data.sponsor1_personId) sponsor1 = "";
            if (this.props.dontShowIf.personId === o.data.sponsor2_personId) sponsor2 = "";
        }

        // location
        let location = this.props.hasOwnProperty('showLocation') && !this.props.showLocation ? "" : <div className="field locationName"><LocationLink location={o.location} altName={o.data.location}></LocationLink></div>;

        let link = "index.html?initiationid=" + o.initiationId;

        return <div className="initiation">
            <a href={link}>view</a>
            {personLink}
            <div className="field degree">{degree.name}</div>
            {location}
            <div className="field actualDate">{actualDate}</div>
            {sponsor1}
            {sponsor2}
        </div>;
    }
}

export class InitiationDisplayHeader extends React.Component {
    render() {

        let personLink = this.props.showPerson ? <div className="field person">Initiate</div> : "";
        let sponsor1 = <div className="field person">Sponsor 1</div>;
        let sponsor2 = <div className="field person">Sponsor 2</div>;

        if (this.props.showOnlyOneSponsor) {
            sponsor1 = <div className="field person">Other Sponsor</div>;
            sponsor2 = "";
        }

        return <div className="initiation">
            {personLink}
            <div className="field degree">°</div>
            <div className="field locationName">Location</div>
            <div className="field actualDate">Actual Date</div>
            {sponsor1}
            {sponsor2}
        </div>;
    }
}

