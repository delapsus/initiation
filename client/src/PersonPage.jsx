import React from 'react';
import {getPersonWithData} from "./webservice";
import {formatDate, formatTime} from './common.js';
import {InitiationDisplay, InitiationDisplayHeader} from './InitiationDisplay.jsx';


export class PersonPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            person: null,
            showRawData: false
        };
    }

    getPersonData() {
        getPersonWithData(this.props.personId).then(result => {
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

        // officeredInitiations
        let officeredInits = [];
        if (this.state.person.officeredInitiations) {
            this.state.person.officeredInitiations.forEach((o, i) => {
                officeredInits.push(<InitiationDisplay initiation={o} key={i} showPerson={true} dontShowSponsors={true} showOfficerPersonId={this.state.person.personId} />);
            });
        }

        return <div className="personPage">
            <PersonInformation person={this.state.person} />

            <h3>Initiations</h3>
            <InitiationDisplayHeader showPerson={false} />
            {inits}

            <h3>Candidates Sponsored: {sponsoredInits.length.toString()}</h3>
            <InitiationDisplayHeader showPerson={true} showOnlyOneSponsor={true}/>
            {sponsoredInits}

            <h3>Initiations Officered: {officeredInits.length.toString()}</h3>
            <InitiationDisplayHeader showPerson={true} dontShowSponsors={true} showOfficerHeader={true}/>
            {officeredInits}
        </div>;
    }

}

function areAllEmpty(o, keys) {
    return keys.reduce((val, key) => {
        if (o.hasOwnProperty(key) && o[key] !== null && o[key].length > 0) return false;
        return val;
    }, true);
}

export class PersonInformation extends React.Component {
    render() {
        let data = this.props.person.data;

        let info = <table><tbody>
        <tr><td className="label">First Name</td><td>{data.firstName}</td></tr>
        <tr><td className="label">Middle</td><td>{data.middleName}</td></tr>
        <tr><td className="label">Last</td><td>{data.lastName}</td></tr>
        <tr><td className="label">Motto</td><td>{data.motto}</td></tr>
        <tr><td className="label">Motto Old</td><td>{data.mottoOld}</td></tr>
        <tr><td className="label">Motto Comment</td><td>{data.mottoComment}</td></tr>
        <tr><td className="label">Aliases</td><td>{data.aliases}</td></tr>
        </tbody></table>;

        let contactInfo = <table><tbody>
        <tr><td className="label">Email</td><td>{data.email}</td></tr>
        <tr><td className="label">Phone Main</td><td>{data.phoneMain}</td></tr>
        <tr><td className="label">Phone Main 2</td><td>{data.phoneMain2}</td></tr>
        <tr><td className="label">Phone Work</td><td>{data.phoneWork}</td></tr>
        <tr><td className="label">Phone Emergency</td><td>{data.phoneEmergency}</td></tr>
        <tr><td className="label">Phone Comments</td><td>{data.phoneComments}</td></tr>
        <tr><td className="label">Created</td><td>{formatDate(data.createdDate)}</td></tr>
        <tr><td className="label">Tracking Number</td><td>{data.trackingNumber}</td></tr>
        </tbody></table>;

        let addressPrimary = <div>
            <div>Primary Address:</div>
            <table><tbody>
            <tr><td className="label">Address 1</td><td>{data.primaryAddress}</td></tr>
            <tr><td className="label">Address 2</td><td>{data.primaryAddress2}</td></tr>
            <tr><td className="label">City</td><td>{data.primaryCity}</td></tr>
            <tr><td className="label">State</td><td>{data.primaryPrincipality}</td></tr>
            <tr><td className="label">Zip</td><td>{data.primaryZip}</td></tr>
            <tr><td className="label">Country</td><td>{data.primaryCountry}</td></tr>
            </tbody></table>
        </div>;

        let addressMail = <div>
            <div>Mailing Address:</div>
            <table><tbody>
            <tr><td className="label">Address 1</td><td>{data.mailAddress}</td></tr>
            <tr><td className="label">Address 2</td><td>{data.mailAddress2}</td></tr>
            <tr><td className="label">City</td><td>{data.mailCity}</td></tr>
            <tr><td className="label">State</td><td>{data.mailPrincipality}</td></tr>
            <tr><td className="label">Zip</td><td>{data.mailZip}</td></tr>
            <tr><td className="label">Country</td><td>{data.mailCountry}</td></tr>
            </tbody></table>
        </div>;

        let a1 = ['mailAddress', 'mailAddress2', 'mailCity', 'mailPrincipality', 'mailZip', 'mailCountry'];
        if (areAllEmpty(data, a1)) addressMail = "";


        let addressOther = <div>
            <div>Other Address:</div>
            <table><tbody>
            <tr><td className="label">Address 1</td><td>{data.otherAddress}</td></tr>
            <tr><td className="label">Address 2</td><td>{data.otherAddress2}</td></tr>
            <tr><td className="label">City</td><td>{data.otherCity}</td></tr>
            <tr><td className="label">Zip</td><td>{data.otherPrincipality}</td></tr>
            <tr><td className="label">State</td><td>{data.otherZip}</td></tr>
            <tr><td className="label">Country</td><td>{data.otherCountry}</td></tr>
            </tbody></table>
        </div>;

        let a2 = ['otherAddress', 'otherAddress2', 'otherCity', 'otherPrincipality', 'otherZip', 'otherCountry'];
        if (areAllEmpty(data, a2)) addressOther = "";


        let birthInfo = <table><tbody>
        <tr><td className="label">Birth Date</td><td>{formatDate(data.birthDate)}</td></tr>
        <tr><td className="label">Birth Time</td><td>{formatTime(data.birthTime)}</td></tr>
        <tr><td className="label">Birth City</td><td>{data.birthCity}</td></tr>
        <tr><td className="label">Birth State</td><td>{data.birthPrincipality}</td></tr>
        <tr><td className="label">Birth Country 0°</td><td>{data.birthCountryMinerval}</td></tr>
        <tr><td className="label">Birth Country 1°</td><td>{data.birthCountryFirst}</td></tr>
        </tbody></table>;

        let comments = <div><span className="label">Comments:</span><br/>{data.comments}</div>;
        if (data.comments === null) comments = '';

        let editLink = "index.html?page=edit-person&personid=" + this.props.person.personId;

        return <div>
            <div><a href={editLink}>Edit Person Data</a></div>

            <table><tbody>
            <tr>

            <td>
                {info}
                {contactInfo}
            </td>

            <td>
                {addressPrimary}
                {addressMail}
                {addressOther}
            </td>

            <td>
            {birthInfo}
            </td>
            </tr>
            </tbody></table>

            {comments}
        </div>;
    }
}

/*

{name:'addressComments'},

{name:'fax'},

{name:'bodyOfResponsibility'},

{name:'difficultiesComments'},
{name:'difficulty', type:'boolean'},
{name:'isMaster', type:'boolean'},
{name:'masterOfBody'},
{name:'reportComment'},
{name:'isFelon', type:'boolean'},
{name:'isDuesInactive', type:'boolean'},
{name:'isInternationalBadReport', type:'boolean'},
{name:'isResigned', type:'boolean'},

{name:'importSource'},
*/