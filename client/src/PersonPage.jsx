import React from 'react';
import {postAjax} from './http';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {InitiationDisplay, InitiationDisplayHeader} from './InitiationDisplay.jsx';


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
            person: null,
            showRawData: false
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

        let rawHtml = {__html: putObjectInLines(this.state.person)};
        let raw = <input type="button" value="show raw data" onClick={() => {this.setState({showRawData: true})}}/>;
        if (this.state.showRawData) raw = <div dangerouslySetInnerHTML={rawHtml} />;

        return <div className="personPage">
            <PersonInformation person={this.state.person} />

            <h3>Initiations</h3>
            <InitiationDisplayHeader showPerson={false} />
            {inits}

            <h3>Candidates Sponsored</h3>
            <InitiationDisplayHeader showPerson={true} showOnlyOneSponsor={true}/>
            {sponsoredInits}

            <br/><br/><br/>

            {raw}

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
