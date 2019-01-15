import React from 'react';
import {getDegreeById, getDegreeByName, allDegrees} from './degree';
import {getOfficerByDegreeId} from './officer';
import {PersonPicker} from './PersonPicker.jsx';
import {submitInitiationReport} from "./webservice";
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import {LocationPicker} from "./LocationPicker.jsx";




// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a

export class InitiationReportForm extends React.Component {

    constructor(props) {
        super(props);

        this.officerPickers = [];
        this.candidatePickers = [];

        this.state = {
            errors:[],
            message: "",

            degreeId: getDegreeByName('1').degreeId,
            locationId: null,

            candidates:[
                {
                    personId: null,
                    person: null,
                    notes: ""
                }
            ],

            //candidatePersonIds: [null],
            //candidateNotes: [""]
        };

    }

    handleChange (event) {
        const target = event.target;
        let value = (target.hasOwnProperty('type') && target.type === 'checkbox') ? target.checked : target.value;
        if (target.type === 'radio') value = value === 'true';
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleIndexedChange (event) {
        const target = event.target;
        let value = (target.hasOwnProperty('type') && target.type === 'checkbox') ? target.checked : target.value;
        if (target.type === 'radio') value = value === 'true';
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleLocationChange (event) {
        const target = event.target;
        const name = target.name;
        const nameNew = target.nameNew;
        const id = target.location.locationId;

        if (id === -1) {
            this.setState({
                [name]: id,
                [nameNew]: target.location.data
            });
        }
        else {
            this.setState({
                [name]: id,
                [nameNew]: null
            });
        }

    }
    handleIndexedPersonChange (event) {
        const target = event.target;
        const name = target.name;
        const nameNew = target.nameNew;
        const id = target.person.personId;
        const index = target.index;

        let o = this.state.candidates[index];


        if (id === -1) {
            o.personId = id;
            o.person = target.person.data;
            this.setState({ candidates : this.state.candidates });
        }
        else {
            o.personId = id;
            o.person = null;
            this.setState({ candidates : this.state.candidates });
        }

    }

    handlePersonChange (event) {
        const target = event.target;
        const name = target.name;
        const nameNew = target.nameNew;
        const id = target.personId;

        if (id === -1) {
            this.setState({
                [name]: id,
                [nameNew]: target.person.data
            });
        }
        else {
            this.setState({
                [name]: id,
                [nameNew]: null
            });
        }

    }
    handleDegreeChange(event) {
        this.setState({degreeId: +event.target.value});
    }

    handleSubmit (event) {

        let errors = [];

        //if (!this.state.hasOwnProperty('personId') || this.state.personId === null) {
        //    errors.push('Must select a person or indicate that a new person entry be created.');
        //}

        if (errors.length > 0) {
            this.setState({errors: errors});
        }
        else {
            submitInitiationReport(this.state).then(result => {
                this.setState({message: "save complete. (this should redirect to the initiation page?)"});
                //window.location = "index.html?initiationid=" + result.initiationId;
            });
            this.setState({errors: errors, message: "saving..."});
        }

    }

    createFormItem(title, indent, html) {
        let className = 'formItem';
        if (indent) className += ' indent';
        return <div className={className}>
            <div className="formItemTitle">{title}</div>
            <div>{html}</div>
        </div>;
    }

    addCandidate() {

        let candidates = this.state.candidates.slice(0);

        candidates.push({
            personId: null,
            person: null,
            notes: ""
        });

        this.setState({ candidates:candidates });
    }

    render() {

        let errors = "";
        if (this.state.errors.length > 0) {
            errors = this.state.errors.map(e => {
                return <div className="error">{e}</div>;
            });
        }

        let degrees = allDegrees.map((degree, i) => {
            return <option value={degree.degreeId} key={i}>{degree.name}</option>;
        });

        let officers = getOfficerByDegreeId(this.state.degreeId);
        let officerInput = officers.map((officer, i) => {
            this.officerPickers[i] = this.officerPickers[i] || React.createRef();
            let name = officer.name.toLowerCase() + "_personId";
            let nameNew = officer.name.toLowerCase() + "_person";
            return <div className="formLine" key={i}>
                <div className="formItem">
                    <div className="formItemTitle">{officer.name}</div>
                    <PersonPicker ref={this.officerPickers[i]} name={name} />
                </div>
            </div>;
        });

        let candidates = this.state.candidates.map((c, i) => {

            let name = "candidate" + i + "_personId";
            //let nameNew = "candidate" + i + "_person";
            //let notesName = "candidate" + i + "_notes";
            //let notes = this.state.candidateNotes[i];
            this.candidatePickers[i] = this.candidatePickers[i] || React.createRef();
            return <div className="formLine" key={i}>
                <div className="formItem">
                    <div className="formItemTitle">Candidate {i+1}</div>
                    <PersonPicker name={name} ref={this.candidatePickers[i]} />
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Notes</div>
                    <div><textarea type="text" cols="25" rows="1" name="notes" index={i} value={c.notes} onChange={this.handleIndexedChange.bind(this)} /></div>
                </div>
            </div>;
        });

        return <div>

            <div className="formItem">
                <div className="formItemTitle">L/O/C performed initiation</div>
                <div><LocationPicker name="performedAt_locationId" nameNew="performedAt_location" onChange={this.handleLocationChange.bind(this)} /></div>
            </div>
            <div className="formItem">
                <div className="formItemTitle">Submitted through Lodge / Oasis</div>
                <div><LocationPicker name="submittedThrough_locationId" nameNew="submittedThrough_location" onChange={this.handleLocationChange.bind(this)} /></div>
            </div>

            <div className="formLine indent" style={{marginTop:'1em'}}>
                {this.createFormItem('Date of Initiation', false, <DatePicker selected={moment(this.state.signedDate)} onChange={m => {this.handleChange({target:{type:'DatePicker', value:m.toDate(), name:'signedDate'}})}} />)}
                {this.createFormItem('Degree Initiated', false, <select value={this.state.degreeId} onChange={this.handleDegreeChange.bind(this)}>{degrees}</select>)}
            </div>

            <div>
                {officerInput}
            </div>

            {candidates}

            <div className="formLine indent">
                <input type="button" value="Add Candidate" onClick={this.addCandidate.bind(this)} />
            </div>

            <div className="formLine">
                <div className="formItem">
                    <input type="button" value="Submit" onClick={this.handleSubmit.bind(this)} />
                    {errors}
                    <div>{this.state.message}</div>
                </div>
            </div>

        </div>;
    }
}

