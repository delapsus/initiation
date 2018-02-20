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

        this.state.person.initiations.forEach((o, i) => {
            inits.push(<InitiationDisplay initiation={o} key={i} />);
        });

        let html = {__html: putObjectInLines(this.state.person)};
        return <div className="personPage">
            <PersonInformation person={this.state.person} />
            {inits}
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
                <td>First Name</td>
                <td>Middle</td>
                <td>Last</td>
                <td>Motto</td>
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
                <td>Email</td>
                <td>Phone Main</td>
                <td>Created</td>
                <td>Tracking Number</td>
            </tr>
            <tr>
                <td><input type="text" value={data.email} /></td>
                <td><input type="text" value={data.phoneMain} /></td>
                <td><input type="text" value={data.createdDate} /></td>
                <td><input type="text" value={data.trackingNumber} /></td>
            </tr>
            </tbody></table>

             { /* BIRTH INFO */ }
            <table><tbody>
            <tr>
                <td>Birth Date</td>
                <td>Birth City</td>
                <td>Birth State</td>
                <td>Birth Country</td>
            </tr>
            <tr>
                <td><input type="text" value={data.birthDate} /></td>
                <td><input type="text" value={data.birthCity} /></td>
                <td><input type="text" value={data.birthPrincipality} /></td>
                <td><input type="text" value={data.birthCountryMinerval} /></td>
            </tr>
            </tbody></table>

             { /* Primary Address */ }
            <table><tbody>
            <tr>
                <td>Address 1</td>
                <td>Address 2</td>
                <td>City</td>
                <td>State</td>
                <td>Zip</td>
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
    let year = d.getUTCFullYear().toString();
    let month = (d.getUTCMonth() + 1).toString();
    let day = d.getUTCDate().toString();

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    return `${year}-${month}-${day}`;
}

class InitiationDisplay extends React.Component {
    render() {
        let o = this.props.initiation;

        let degree = getDegreeById(+o.degreeId);
        let actualDate = formatDate(new Date(o.actualDate));

        return <div className="initiation">
            <div className="field degree">{degree.name}</div>
            <div className="field locationName">{o.location}</div>
            <div className="field actualDate">{actualDate}</div>
        </div>;
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
