import React from 'react';
import {getLocation, submitEditLocation} from "./webservice";

export class EditLocation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            live: null, // the data as it exists in client memory
            prev: null,  // the data as it exists in the database,
            saving: false
        };

        getLocation(this.props.locationId).then(result => {
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
        submitEditLocation(this.state.live).then(() => {

            // redirect to person page
            //setTimeout(() => {}, 1000);
            window.location = "index.html?locationid=" + this.props.locationId;
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

        return <div className="locationPage">
            <EditLocationInformation person={this.state.live} live={this.state.live} prev={this.state.prev} disabled={this.state.saving} handleChange={this.handleChange.bind(this)} />
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

function createSelect(key, options) {
    let live = noNull(this.props.live.data[key]);
    let prev = noNull(this.props.prev.data[key]);

    let style = {};
    if (live !== prev) {
        style.backgroundColor = '#ccffcc';
    }

    let optionHtml = options.map((o,i) => {
        let value = o.value || o.name;
        return <option value={value} key={i}>{o.name}</option>;
    });

    return <select name={key} value={live} style={style} disabled={this.props.disabled} onChange={this.props.handleChange} >
        <option value="" key={-1}></option>
        {optionHtml}
    </select>;
}


let locationTypes = [
    {name: 'moe body'},
    {name: 'chapter'},
    {name: 'temple'},
    {name: 'consistory'},
    {name: 'senate'}
];

class EditLocationInformation extends React.Component {

    render() {

        let getTextField = createTextField.bind(this);
        let getTextArea = createTextArea.bind(this);
        let getSelect = createSelect.bind(this);

        let info = <table><tbody>
        <tr><td className="label">Name</td><td>{getTextField('name')}</td></tr>
        <tr><td className="label">Type</td><td>{getSelect('type', locationTypes)}</td></tr>
        <tr><td className="label">City</td><td>{getTextField('city')}</td></tr>
        <tr><td className="label">State</td><td>{getSelect('state', stateList)}</td></tr>
        </tbody></table>;

        return <div>

            <table><tbody>
            <tr>

                <td>
                    {info}
                </td>

            </tr>
            </tbody></table>

            <div>Comments:<br/>{getTextArea('comments')}</div>

        </div>;
    }
}


let stateList = [
    {name:'ALABAMA', value:'AL'},
    {name:'ALASKA', value:'AK'},
    {name:'ARIZONA', value:'AZ'},
    {name:'ARKANSAS', value:'AR'},
    {name:'CALIFORNIA', value:'CA'},
    {name:'COLORADO', value:'CO'},
    {name:'CONNECTICUT', value:'CT'},
    {name:'DELAWARE', value:'DE'},
    {name:'FLORIDA', value:'FL'},
    {name:'GEORGIA', value:'GA'},
    {name:'HAWAII', value:'HI'},
    {name:'IDAHO', value:'ID'},
    {name:'ILLINOIS', value:'IL'},
    {name:'INDIANA', value:'IN'},
    {name:'IOWA', value:'IA'},
    {name:'KANSAS', value:'KS'},
    {name:'KENTUCKY', value:'KY'},
    {name:'LOUISIANA', value:'LA'},
    {name:'MAINE', value:'ME'},
    {name:'MARYLAND', value:'MD'},
    {name:'MASSACHUSETTS', value:'MA'},
    {name:'MICHIGAN', value:'MI'},
    {name:'MINNESOTA', value:'MN'},
    {name:'MISSISSIPPI', value:'MS'},
    {name:'MISSOURI', value:'MO'},
    {name:'MONTANA', value:'MT'},
    {name:'NEBRASKA', value:'NE'},
    {name:'NEVADA', value:'NV'},
    {name:'NEW HAMPSHIRE', value:'NH'},
    {name:'NEW JERSEY', value:'NJ'},
    {name:'NEW MEXICO', value:'NM'},
    {name:'NEW YORK', value:'NY'},
    {name:'NORTH CAROLINA', value:'NC'},
    {name:'NORTH DAKOTA', value:'ND'},
    {name:'OHIO', value:'OH'},
    {name:'OKLAHOMA', value:'OK'},
    {name:'OREGON', value:'OR'},
    {name:'PENNSYLVANIA', value:'PA'},
    {name:'RHODE ISLAND', value:'RI'},
    {name:'SOUTH CAROLINA', value:'SC'},
    {name:'SOUTH DAKOTA', value:'SD'},
    {name:'TENNESSEE', value:'TN'},
    {name:'TEXAS', value:'TX'},
    {name:'UTAH', value:'UT'},
    {name:'VERMONT', value:'VT'},
    {name:'VIRGINIA', value:'VA'},
    {name:'WASHINGTON', value:'WA'},
    {name:'WEST VIRGINIA', value:'WV'},
    {name:'WISCONSIN', value:'WI'},
    {name:'WYOMING', value:'WY'}
];
