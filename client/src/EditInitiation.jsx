import React from 'react';
import { getInitiation } from './data/initiations';
import { PersonLink } from './PersonLink.jsx';
import { LocationPicker } from './LocationPicker.jsx';
import { PersonPicker } from "./PersonPicker.jsx";
import { getOfficerByDegreeId } from "./officer";
import DatePicker from 'react-datepicker';
import moment from "moment";
import { postAjax } from "./http";
import axios from 'axios'

async function submitEditInitiation(initiation) {
    const result = await axios.post("http://localhost:2020/data/initiation/submit-edit-initiation", { initiation: initiation });
    return result.data;
}

export class EditInitiation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            live: null, // the data as it exists in client memory
            prev: null,  // the data as it exists in the database,
            saving: false
        };


        this.officers = {};
        this.officerPickers = {};
        this.sponsor1Picker = React.createRef();
        this.sponsor2Picker = React.createRef();
        this.locationPicker = React.createRef();
        this.locationPickerSubmitted = React.createRef();
        this.getInit();

    }

    async getInit() {
        // get the initiation, setup the pickers
        const initResult = await getInitiation(this.props.initiationId);
        this.officers = getOfficerByDegreeId(initResult.degree.degreeId);

        // fix the pickers
        this.officers.forEach(o => {
            let key = o.officerId.toString();
            this.officerPickers[key] = React.createRef();
        });

        let copy = JSON.parse(JSON.stringify(initResult));
        this.setState({ prev: initResult, live: copy });

    }

    handleChange(event) {
        const target = event.target;
        let value = (target.hasOwnProperty('type') && target.type === 'checkbox') ? target.checked : target.value;
        if (target.type === 'radio') value = value === 'true';
        const name = target.name;

        this.state.live.data[name] = value;

        this.setState({
            live: this.state.live
        });
    }

    handleDateChange(e) {
        let name = e.name;
        // get a pure UTC date
        let value = (e.value === null) ? null : new Date(`${e.value.year()}-${e.value.month() + 1}-${e.value.date()}Z`);

        this.state.live.data[name] = value;

        this.setState({
            live: this.state.live
        });
    }

    async onSave() {

        // load the IDs
        this.state.live.data.sponsor1_personId = await this.sponsor1Picker.current.save();
        this.state.live.data.sponsor2_personId = await this.sponsor2Picker.current.save();
        this.state.live.data.performedAt_locationId = await this.locationPicker.current.save();
        this.state.live.data.submittedThrough_locationId = await this.locationPickerSubmitted.current.save();

        //this.officerPickers = {};
        this.state.live.data.officers = [];
        await Promise.all(Object.keys(this.officerPickers).map(async officerId => {
            let picker = this.officerPickers[officerId];

            let personId = await picker.current.save();

            this.state.live.data.officers.push({ officerId: +officerId, personId: personId });
        }));

        // create the saving record
        let record = {
            initiationId: this.state.live.initiationId,
            data: JSON.parse(JSON.stringify(this.state.live.data))
        };

        // send save request
        submitEditInitiation(record).then(() => {

            // redirect to initiation page
            //setTimeout(() => {}, 1000);
            window.location = "index.html?initiationid=" + this.props.initiationId;
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
            {this.renderEditSection()}
            {buttons}
        </div>;
    }

    renderEditSection() {

        if (this.state.live === null) return <div></div>;

        let init = this.state.live;

        // create the officer rows
        let officerInput = this.officers.map((officer, i) => {
            let key = officer.officerId.toString();

            // get the personId if available
            let officerEntry = init.data.officers.find(o => {
                return o.officerId === officer.officerId;
            });

            let savedPerson = (officerEntry) ? officerEntry.person : null;

            return <div className="formLine" key={i}>
                <div className="formItem">
                    <div className="formItemTitle">{officer.name}</div>
                    <PersonPicker ref={this.officerPickers[key]} name={"officer" + key} index={i} savedPerson={savedPerson} />
                </div>
            </div>;
        });

        let editLink = "index.html?page=edit-initiation&initiationid=" + this.props.initiationId;

        return <div className="initiationPage">

            <div className="pageTitleDiv">
                <span className="pageTitle">Edit Initiation</span>
            </div>

            <div><div className="title">Person:</div><div><PersonLink person={init.person} /></div></div>
            <div style={{ marginBottom: "1em" }}><div className="title">Degree:</div><div>{init.degree.name}</div></div>

            <div className="formLine" style={{ marginBottom: "1em" }}>
                <div className="formItem" style={{ marginBottom: "1em" }}>
                    <div className="formItemTitle">Sponsor 1:</div>
                    <PersonPicker ref={this.sponsor1Picker} name={"sponsor1_person"} savedPerson={init.sponsor1_person} />
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Sponsor 2:</div>
                    <div><PersonPicker ref={this.sponsor2Picker} name={"sponsor2_person"} savedPerson={init.sponsor2_person} /></div>
                </div>
            </div>

            <div className="formLine" style={{ marginTop: "1em" }}>
                <div className="formItem">
                    <div className="formItemTitle">Location:</div>
                    <div><LocationPicker ref={this.locationPicker} name={"locationPicker"} savedLocation={init.location} ></LocationPicker></div>
                </div>
            </div>
            <div className="formLine" style={{ marginTop: "1em" }}>
                <div className="formItem">
                    <div className="formItemTitle">Submitted Through Body:</div>
                    <div><LocationPicker ref={this.locationPickerSubmitted} name={"locationPickerSubmitted"} savedLocation={init.submittedThroughLocation} ></LocationPicker></div>
                </div>
            </div>

            <div>
                {officerInput}
            </div>

            <div style={{ marginTop: "1em", fontWeight: "bold" }}><div>Application:</div></div>
            <div>
                <div className="title">localBodyDate:</div>
                <div><DatePicker utcOffset={0} selected={init.data.localBodyDate === null ? null : moment.utc(init.data.localBodyDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'localBodyDate' }) }} /></div>
            </div>
            <div>
                <div className="title">signedDate:</div>
                <div><DatePicker utcOffset={0} selected={init.data.signedDate === null ? null : moment.utc(init.data.signedDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'signedDate' }) }} /></div>
            </div>
            <div>
                <div className="title">approvedDate:</div>
                <div><DatePicker utcOffset={0} selected={init.data.approvedDate === null ? null : moment.utc(init.data.approvedDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'approvedDate' }) }} /></div>
            </div>

            <div style={{ marginTop: "1em", fontWeight: "bold" }}><div>Initiation:</div></div>
            <div>
                <div className="title">proposedDate:</div>
                <div><DatePicker utcOffset={0} selected={init.data.proposedDate === null ? null : moment.utc(init.data.proposedDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'proposedDate' }) }} /></div>
            </div>
            <div>
                <div className="title">actualDate:</div>
                <div><DatePicker utcOffset={0} selected={init.data.actualDate === null ? null : moment.utc(init.data.actualDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'actualDate' }) }} /></div>
            </div>
            <div>
                <div className="title">reportedDate:</div>
                <div><DatePicker utcOffset={0} selected={init.data.reportedDate === null ? null : moment.utc(init.data.reportedDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'reportedDate' }) }} /></div>
            </div>

            <div style={{ marginTop: "1em", fontWeight: "bold" }}><div>Certificate:</div></div>
            <div>
                <div className="title">Received from body:</div>
                <div><DatePicker utcOffset={0} selected={init.data.certReceivedDate === null ? null : moment.utc(init.data.certReceivedDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'certReceivedDate' }) }} /></div>
            </div>
            <div>
                <div className="title">Sent Out For Signature:</div>
                <div><DatePicker utcOffset={0} selected={init.data.certSentOutForSignatureDate === null ? null : moment.utc(init.data.certSentOutForSignatureDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'certSentOutForSignatureDate' }) }} /></div>
            </div>
            <div>
                <div className="title">Sent Out To Body:</div>
                <div><DatePicker utcOffset={0} selected={init.data.certSentOutToBodyDate === null ? null : moment.utc(init.data.certSentOutToBodyDate)} onChange={m => { this.handleDateChange({ type: 'DatePicker', value: m, name: 'certSentOutToBodyDate' }) }} /></div>
            </div>

        </div>;
    }

}
