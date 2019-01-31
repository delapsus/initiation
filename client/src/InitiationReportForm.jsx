import React from 'react';
import {postAjax} from './http';
import {getDegreeById, getDegreeByName, allDegrees} from './degree';
import {getOfficerByDegreeId} from './officer';
import {PersonPicker} from './PersonPicker.jsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import {LocationPicker} from "./LocationPicker.jsx";



export function submitInitiationReport(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-initiation-report", {data:state}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a

export class InitiationReportForm extends React.Component {

    constructor(props) {
        super(props);

        this.officerPickers = {};
        this.candidatePickers = [React.createRef()];

        this.state = {
            errors:[],
            message: "",

            degreeId: getDegreeByName('0').degreeId,

            initiationDate: null,
            reportedDate: new Date(),

            candidateCount: 1
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

    handleDateChange(e) {
        let name = e.name;
        // get a pure UTC date
        let value = (e.value === null) ? null : new Date(`${e.value.year()}-${e.value.month()+1}-${e.value.date()}Z`);

        this.setState({
            [name]: value
        });
    }

    handleDegreeChange(event) {
        this.setState({degreeId: +event.target.value});
    }

    async handleSubmit (event) {

        let errors = [];

        //if (!this.state.hasOwnProperty('personId') || this.state.personId === null) {
        //    errors.push('Must select a person or indicate that a new person entry be created.');
        //}

        let data = JSON.parse(JSON.stringify(this.state));
        delete data.candidateCount;

        data.candidates = [];
        for (let i = 0; i < this.state.candidateCount; i++) {
            let personId = await this.candidatePickers[i].current.save();
            data.candidates[i] = {
                personId: personId
            }
        }

        data.officers = [];
        for (let i = 0; i < this.officers.length; i++) {
            let officerId = this.officers[i].officerId;
            let key = officerId.toString();
            let personId = await this.officerPickers[key].current.save();
            data.officers.push({
                personId: personId,
                officerId: officerId
            });
        }

        if (errors.length > 0) {
            this.setState({errors: errors});
        }
        else {
            submitInitiationReport(data).then(result => {
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
        this.candidatePickers.push(React.createRef());
        this.setState({ candidateCount: this.state.candidateCount + 1});
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

        // manage officers
        let officers = getOfficerByDegreeId(this.state.degreeId);
        this.officers = officers;

        // fix the pickers
        let target = officers.map(o => { return o.officerId.toString(); });
        let existing = Object.keys(this.officerPickers);
        // remove
        existing.forEach(key => {
            if (target.indexOf(key) === -1) delete this.officerPickers[key];
        });
        // add
        target.forEach(key => {
            if (existing.indexOf(key) === -1) this.officerPickers[key] = React.createRef();
        });

        // create the officer rows
        let officerInput = officers.map((officer, i) => {
            let key = officer.officerId.toString();

            return <div className="formLine" key={i}>
                <div className="formItem">
                    <div className="formItemTitle">{officer.name}</div>
                    <PersonPicker ref={this.officerPickers[key]} name={"officer" + key} index={i} />
                </div>
            </div>;
        });

        // create the candidate rows
        let candidates = [];
        for (let i = 0; i < this.state.candidateCount; i++) {
            let o = <div className="formLine" key={i}>
                <div className="formItem">
                    <div className="formItemTitle">Candidate {i+1}</div>
                    <PersonPicker ref={this.candidatePickers[i]} name={"candidate" + i.toString()} index={i} />
                </div>
            </div>;

            candidates.push(o);
        }

        return <div>

            <div className="formItem">
                <div className="formItemTitle">L/O/C performed initiation</div>
                <div><LocationPicker name="performedAt_locationId" /></div>
            </div>
            <div className="formItem">
                <div className="formItemTitle">Submitted through Lodge / Oasis</div>
                <div><LocationPicker name="submittedThrough_locationId" /></div>
            </div>

            <div className="formLine indent" style={{marginTop:'1em'}}>

                {this.createFormItem('Degree Initiated', false, <select value={this.state.degreeId} onChange={this.handleDegreeChange.bind(this)}>{degrees}</select>)}
                {this.createFormItem('Date of Initiation', false, <DatePicker utcOffset={0} selected={this.state.initiationDate === null ? null : moment.utc(this.state.initiationDate)} onChange={m => {this.handleDateChange({type:'DatePicker', value:m, name:'initiationDate'})}} />)}
                {this.createFormItem('Reported Date', false, <DatePicker utcOffset={0} selected={this.state.reportedDate === null ? null : moment.utc(this.state.reportedDate)} onChange={m => {this.handleDateChange({type:'DatePicker', value:m, name:'reportedDate'})}} />)}

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

