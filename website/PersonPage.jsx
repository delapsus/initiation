import React from 'react';
import {postAjax} from './http';
import {getDegreeById} from './degree';


function getPerson(personId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/person", {personId: personId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class PersonPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            person: null
        };
    }

    getPersonData() {
        getPerson(this.props.personId).then(result => {
            this.setState({
                person: result
            });

        });
    }

    componentDidMount() {
        this.getPersonData();
    }

    render() {

        if (this.state.person === null) return <div></div>;

        let inits = [];
        if (this.state.person.initiations) {
            this.state.person.initiations.forEach((o, i) => {
                inits.push(<InitiationDisplay initiation={o} key={i} />);
            });
        }

        // sponsoredInitiations
        let sponsoredInits = [];
        if (this.state.person.sponsoredInitiations) {
            this.state.person.sponsoredInitiations.forEach((o, i) => {
                sponsoredInits.push(<InitiationDisplay initiation={o} key={i} showPerson={true} dontShowIf={this.state.person} />);
            });
        }

        let html = {__html: putObjectInLines(this.state.person)};
        return <div className="personPage">
            <PersonInformation person={this.state.person} />
            {inits}
            {sponsoredInits}
            <br/><br/><br/>
            <div dangerouslySetInnerHTML={html} />
        </div>;
    }

}

export class PersonInformation extends React.Component {
    render() {
        let data = this.props.person;
        return <div>

            { /* name/motto */ }
            <table><tbody>
            <tr>
                <td className="label">First Name</td>
                <td className="label">Middle</td>
                <td className="label">Last</td>
                <td className="label">Motto</td>
            </tr>
            <tr>
                <td><input type="text" value={data.firstName} /></td>
                <td><input type="text" value={data.middleName} /></td>
                <td><input type="text" value={data.lastName} /></td>
                <td><input type="text" value={data.motto} /></td>
            </tr>
            </tbody></table>

            { /* contact / misc info */ }
            <table><tbody>
            <tr>
                <td className="label">Email</td>
                <td className="label">Phone Main</td>
                <td className="label">Created</td>
                <td className="label">Tracking Number</td>
            </tr>
            <tr>
                <td><input type="text" value={data.email} /></td>
                <td><input type="text" value={data.phoneMain} /></td>
                <td><input type="text" value={formatDate(data.createdDate)} /></td>
                <td><input type="text" value={data.trackingNumber} /></td>
            </tr>
            </tbody></table>

             { /* BIRTH INFO */ }
            <table><tbody>
            <tr>
                <td className="label">Birth Date</td>
                <td className="label">Birth Time</td>
                <td className="label">Birth City</td>
                <td className="label">Birth State</td>
                <td className="label">Birth Country</td>
            </tr>
            <tr>
                <td><input type="text" value={formatDate(data.birthDate)} /></td>
                <td><input type="text" value={formatTime(data.birthTime)} /></td>
                <td><input type="text" value={data.birthCity} /></td>
                <td><input type="text" value={data.birthPrincipality} /></td>
                <td><input type="text" value={data.birthCountryMinerval} /></td>
            </tr>
            </tbody></table>

             { /* Primary Address */ }
            <table><tbody>
            <tr>
                <td className="label">Address 1</td>
                <td className="label">Address 2</td>
                <td className="label">City</td>
                <td className="label">State</td>
                <td className="label">Zip</td>
            </tr>
            <tr>
                <td><input type="text" value={data.primaryAddress} /></td>
                <td><input type="text" value={data.primaryAddress2} /></td>
                <td><input type="text" value={data.primaryCity} /></td>
                <td><input type="text" value={data.primaryPrincipality} /></td>
                <td><input type="text" value={data.primaryZip} /></td>
            </tr>
            </tbody></table>

            <div>Comments:<br/><textarea value={data.comments} cols="80" rows="4" /></div>

        </div>;
    }
}

function formatDate(d) {

    if (typeof d === 'undefined' || d === null) return;

    if (typeof d === 'string') d = new Date(d);

    let year = d.getUTCFullYear().toString();
    let month = (d.getUTCMonth() + 1).toString();
    let day = d.getUTCDate().toString();

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    return `${year}-${month}-${day}`;
}

function formatTime(time) {

    if (time === null) return;

    let d = new Date(time * 24*60*60*1000);

    let hour = d.getUTCHours().toString();
    let minute = d.getMinutes().toString();

    if (hour.length === 1) hour = "0" + hour;
    if (minute.length === 1) minute = "0" + minute;

    return `${hour}:${minute}`;
}

class InitiationDisplay extends React.Component {
    render() {
        let o = this.props.initiation;

        let degree = getDegreeById(+o.degreeId);
        let actualDate = formatDate(new Date(o.actualDate));

        let personLink = this.props.showPerson ? <div className="field person"><PersonLink person={o.person} /></div> : "";
        let sponsor1 = <div className="field person"><PersonLink person={o.sponsor1_person} altNameFirst={o.sponsor1First} altNameLast={o.sponsor1Last} /></div>;
        let sponsor2 = <div className="field person"><PersonLink person={o.sponsor2_person} altNameFirst={o.sponsor2First} altNameLast={o.sponsor2Last} /></div>;

        if (this.props.dontShowIf) {
            if (o.sponsor1_person && this.props.dontShowIf.personId === o.sponsor1_person.personId) sponsor1 = "";
            if (o.sponsor2_person && this.props.dontShowIf.personId === o.sponsor2_person.personId) sponsor2 = "";
        }

        return <div className="initiation">
            {personLink}
            <div className="field degree">{degree.name}</div>
            <div className="field locationName">{o.location}</div>
            <div className="field actualDate">{actualDate}</div>
            {sponsor1}
            {sponsor2}
        </div>;
    }
}

/*
 if (o.sponsor1_person) {
 let link = "index.html?personid=" + o.sponsor1_person.personId;
 sponsor1 = <a href={link}>{o.sponsor1_person.firstName} {o.sponsor1_person.lastName}</a>;
 }
 else if (o.sponsor1First !== null || o.sponsor1Last !== null) {
 sponsor1 = o.sponsor1First + " " + o.sponsor1Last;
 }
 */

class PersonLink extends React.Component {
    render() {
        if (this.props.person) {
            let link = "index.html?personid=" + this.props.person.personId;
            return <a href={link}>{this.props.person.firstName} {this.props.person.lastName}</a>;
        }
        else if (this.props.altNameFirst || this.props.altNameLast) {
            return <span>{this.props.altNameFirst} {this.props.altNameLast}</span>;
        }
        return <span></span>;
    }
}

function putObjectInLines(o) {
    let lines = [];

    //lines.push('<div>{</div>');
    for (let key in o) {
        if (o[key] === null) {

        }
        else if (typeof o[key] === 'object' && Array.isArray(o[key])) {
            lines.push(`<div class="indent">${key}: [</div>`);
            lines.push(`<div class="indent">${putObjectInLines(o[key])}</div>`);
            lines.push(`<div class="indent">}]</div>`);
        }
        else if (typeof o[key] === 'object') {
            lines.push(`<div class="indent">${key}: {</div>`);
            lines.push(`<div class="indent">${putObjectInLines(o[key])}</div>`);
            lines.push(`<div class="indent">}</div>`);
        }
        else {
            lines.push(`<div class="indent">${key}: ${o[key]}</div>`);
        }

    }
    //lines.push('<div>}</div>');
    return lines.join('\n');
}
