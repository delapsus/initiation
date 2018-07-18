import React from 'react';
import {getDegreeById} from './degree';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';


export class InitiationDisplay extends React.Component {
    render() {
        let o = this.props.initiation;

        let degree = getDegreeById(+o.degreeId);
        let actualDate = formatDate(o.actualDate);

        let personLink = this.props.showPerson ? <div className="field person"><PersonLink person={o.person} /></div> : "";

        // sponsors
        let sponsor1 = <div className="field person"><PersonLink person={o.sponsor1_person} altNameFirst={o.sponsor1First} altNameLast={o.sponsor1Last} /></div>;
        let sponsor2 = <div className="field person"><PersonLink person={o.sponsor2_person} altNameFirst={o.sponsor2First} altNameLast={o.sponsor2Last} /></div>;
        if (this.props.dontShowIf) {
            if (o.sponsor1_person && this.props.dontShowIf.personId === o.sponsor1_person.personId) sponsor1 = "";
            if (o.sponsor2_person && this.props.dontShowIf.personId === o.sponsor2_person.personId) sponsor2 = "";
        }

        // location
        let locationUrl = 'index.html?locationid=' + o.locationId;
        let location = <div className="field locationName"><a href={locationUrl}>{o.location}</a></div>;

        return <div className="initiation">
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