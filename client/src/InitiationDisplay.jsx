import React from 'react';
import {getDegreeById} from './degree';
import {getOfficerById} from "./officer";
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {LocationLink} from './LocationLink.jsx';


export class InitiationDisplay extends React.Component {
    render() {
        let o = this.props.initiation;

        // degree info
        let degree = getDegreeById(+o.data.degreeId);

        let date = o.data.actualDate || null;
        let noActualDate = date === null;
        date = date || o.data.proposedDate || o.data.signedDate || o.data.localBodyDate || o.data.reportedDate;

        let actualDate = formatDate(date);
        if (noActualDate && actualDate.length > 0) actualDate = "[" + actualDate + "]";

        let personLink = this.props.showPerson ? <div className="field person"><PersonLink person={o.person} /></div> : "";

        // sponsors
        let sponsor1 = <div className="field person"><PersonLink person={o.sponsor1_person} altNameFirst={o.data.sponsor1First} altNameLast={o.data.sponsor1Last} /></div>;
        let sponsor2 = <div className="field person"><PersonLink person={o.sponsor2_person} altNameFirst={o.data.sponsor2First} altNameLast={o.data.sponsor2Last} /></div>;
        if (this.props.dontShowIf) {
            if (this.props.dontShowIf.personId === o.data.sponsor1_personId) sponsor1 = "";
            if (this.props.dontShowIf.personId === o.data.sponsor2_personId) sponsor2 = "";
        }

        if (this.props.dontShowSponsors) {
            sponsor1 = "";
            sponsor2 = "";
        }

        let officerTitle = "";
        if (this.props.showOfficerPersonId) {
            o.data.officers.forEach(officer => {
                if (officer.personId === this.props.showOfficerPersonId)
                    officerTitle = <div className="field person">{getOfficerById(officer.officerId).name}</div>;
            });
        }

        // location
        let location = this.props.hasOwnProperty('showLocation') && !this.props.showLocation ? "" : <div className="field locationName"><LocationLink location={o.location} altName={o.data.location}></LocationLink></div>;

        let link = "index.html?initiationid=" + o.initiationId;

        return <div className="initiation">
            <div className="field view"><a href={link}>view</a></div>
            {personLink}
            <div className="field degree">{degree.name}</div>
            {location}
            <div className="field actualDate">{actualDate}</div>
            {sponsor1}
            {sponsor2}
            {officerTitle}
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

        if (this.props.dontShowSponsors) {
            sponsor1 = "";
            sponsor2 = "";
        }

        let officerHead = "";
        if (this.props.showOfficerHeader) officerHead = <div className="field person">Officer</div>;

        return <div className="initiation">
            <div className="field view"></div>
            {personLink}
            <div className="field degree">°</div>
            <div className="field locationName">Location</div>
            <div className="field actualDate">Actual Date</div>
            {sponsor1}
            {sponsor2}
            {officerHead}
        </div>;
    }
}

