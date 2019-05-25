import React from 'react';
import {getPerson, submitEditPerson} from "./webservice";
import {formatDate, formatTime} from './common.js';

export class EditPerson extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            live: null, // the data as it exists in client memory
            prev: null,  // the data as it exists in the database,
            saving: false
        };

        getPerson(this.props.personId).then(result => {
            let copy = JSON.parse(JSON.stringify(result));
            this.setState({ prev: result, live: copy });
        });
    }

    handleChange (event) {
        const target = event.target;
        let value = (target.hasOwnProperty('type') && target.type === 'checkbox') ? target.checked : target.value;
        if (target.type === 'radio') value = value === 'true';
        const name = target.name;

        this.state.live.data[name] = value;

        this.setState({
            live: this.state.live
        });
    }

    onSave() {
        // send save request
        submitEditPerson(this.state.live).then(() => {

            // redirect to person page
            //setTimeout(() => {}, 1000);
            window.location = "index.html?personid=" + this.props.personId;
        });

        // set page to saving state
        this.setState({
            saving: true
        });

    }

    render() {
        if (this.state.live === null) return <div>loading...</div>;

        let buttons = <div>
            <button onClick={this.onSave.bind(this)}>Save</button>
            <button>Cancel</button>
        </div>;

        if (this.state.saving) buttons = <div>Saving, please wait...</div>;

        return <div className="personPage">
            <EditPersonInformation person={this.state.live} live={this.state.live} prev={this.state.prev} disabled={this.state.saving} handleChange={this.handleChange.bind(this)} />
            {buttons}
        </div>;
    }

}

function areAllEmpty(o, keys) {
    return keys.reduce((val, key) => {
        if (o.hasOwnProperty(key) && o[key] !== null && o[key].length > 0) return false;
        return val;
    }, true);
}

function noNull(s) {
    return (typeof s === 'undefined' || s === null) ? '' : s.toString();
}

function noNullBoolean(s) {
    return (typeof s === 'undefined' || s === null || s === 'false' || s === false) ? false : true;
}

function createTextField(key) {
    let live = noNull(this.props.live.data[key]);
    let prev = noNull(this.props.prev.data[key]);

    let style = {};
    if (live !== prev) {
        style.backgroundColor = '#ccffcc';
    }

    return <input type="text" name={key} value={live} style={style} disabled={this.props.disabled} onChange={this.props.handleChange} />;
}

function createTextArea(key) {
    let live = noNull(this.props.live.data[key]);
    let prev = noNull(this.props.prev.data[key]);

    let style = {};
    if (live !== prev) {
        style.backgroundColor = '#ccffcc';
    }
    return <textarea name={key} value={live} style={style} disabled={this.props.disabled} onChange={this.props.handleChange} cols="80" rows="4" />
}

function createRadioYesNo(key) {
    let live = noNullBoolean(this.props.live.data[key]);
    let prev = noNullBoolean(this.props.prev.data[key]);

    return <div>
        <input type="radio" name={key} value={false} checked={!live} onChange={this.props.handleChange} /> No
        <input type="radio" name={key} value={true} checked={live} onChange={this.props.handleChange} /> Yes
    </div>;
}

class EditPersonInformation extends React.Component {

    render() {

        let getTextField = createTextField.bind(this);
        let getTextArea = createTextArea.bind(this);
        let getRadioYesNo = createRadioYesNo.bind(this);

        let data = this.props.person.data;

        let info = <table><tbody>
        <tr><td className="label">First Name</td><td>{getTextField('firstName')}</td></tr>
        <tr><td className="label">Middle</td><td>{getTextField('middleName')}</td></tr>
        <tr><td className="label">Last</td><td>{getTextField('lastName')}</td></tr>
        <tr><td className="label">Motto</td><td>{getTextField('motto')}</td></tr>
        <tr><td className="label">Motto Old</td><td>{getTextField('mottoOld')}</td></tr>
        <tr><td className="label">Motto Comment</td><td>{getTextField('mottoComment')}</td></tr>
        <tr><td className="label">Aliases</td><td>{getTextField('aliases')}</td></tr>
        </tbody></table>;

        let contactInfo = <table><tbody>
        <tr><td className="label">Email</td><td>{getTextField('email')}</td></tr>
        <tr><td className="label">Phone Main</td><td>{getTextField('phoneMain')}</td></tr>
        <tr><td className="label">Phone Main 2</td><td>{getTextField('phoneMain2')}</td></tr>
        <tr><td className="label">Phone Work</td><td>{getTextField('phoneWork')}</td></tr>
        <tr><td className="label">Phone Emergency</td><td>{getTextField('phoneEmergency')}</td></tr>
        <tr><td className="label">Phone Comments</td><td>{getTextField('phoneComments')}</td></tr>
        <tr><td className="label">Tracking Number</td><td>{getTextField('trackingNumber')}</td></tr>
        </tbody></table>;

        let birthInfo = <table><tbody>
        <tr><td className="label">Birth Date</td><td>{formatDate(data.birthDate)}</td></tr>
        <tr><td className="label">Birth Time</td><td>{formatTime(data.birthTime)}</td></tr>
        <tr><td className="label">Birth City</td><td>{getTextField('birthCity')}</td></tr>
        <tr><td className="label">Birth State</td><td>{getTextField('birthPrincipality')}</td></tr>
        <tr><td className="label">Birth Country 0°</td><td>{getTextField('birthCountryMinerval')}</td></tr>
        <tr><td className="label">Birth Country 1°</td><td>{getTextField('birthCountryFirst')}</td></tr>
        </tbody></table>;

        return <div>

            <table><tbody>
            <tr>
                <td>
                    {info}
                </td>
                <td>
                    {contactInfo}
                </td>
                <td>
                    {birthInfo}
                </td>
            </tr>
            </tbody></table>

            <div>
                <div>Convicted of Felony?</div>
                <div>{getRadioYesNo('convictedOfFelony')}</div>
            </div>

            <div>
                <div>Denied initiation before?</div>
                <div>{getRadioYesNo('deniedInitiation')}</div>
            </div>

            <div>Comments:<br/>{getTextArea('comments')}</div>

        </div>;
    }
}

/*



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