import React from 'react';
import {getDegreeById, getDegreeByName, allDegrees} from './degree';
import {PersonPicker} from './PersonPicker.jsx';
import {submitApplication} from "./webservice";
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import {LocationPicker} from "./LocationPicker.jsx";
import {formatTime, parseTime} from "./common";



// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a

// O.T.O. U.S.A. Form 1/1, Rev. 3.0 Spring IVxv
export class ApplicationForm extends React.Component {

    constructor(props) {
        super(props);

        //        {name:'initiationId', type:'number', isPrimary:true},
        //        {name:'degreeId', type:'number'},

        // person pickers
        this.personId = React.createRef();
        this.sponsor1_personId = React.createRef();
        this.sponsor2_personId = React.createRef();

        // location pickers
        this.performedAt_locationId = React.createRef();
        this.submittedThrough_locationId = React.createRef();

        this.state = {
            errors:[],
            message: "",

            signedDate: null,

            degreeId: getDegreeByName('0').degreeId,
            personId: null,
            sponsor1_personId: null,
            sponsor2_personId: null,

            // first things
            birthCountryFirst: '',

            // minerval things
            birthDate: null,
            birthTime: null,
            birthCity: '',
            birthPrincipality: '',
            birthCountryMinerval: '',

            // minerval helpers
            birthTimeText:'',

            previousName: '', // TODO there should be a checkbox "find by previous name", this forces the find by name to be "find by previous name" and three new boxes for the new name appear
            magicalName: '',

            phone: '',
            email: '',

            convictedOfFelony: false,
            deniedInitiation: false,

            proposedDate: null,

            contactName: '',

            initiatorName: '',
            initiatorPhone: '',
            initiatorEmail: ''
        };

    }

    handleChange (event) {
        const target = event.target;
        let value = (target.hasOwnProperty('type') && target.type === 'checkbox') ? target.checked : target.value;
        if (target.type === 'radio') value = value === 'true';
        const name = target.name;

        // create the new state
        let newState = {
            [name]: value
        };

        // try to parse the time
        if (name === 'birthTimeText') {
            try {
                let time = parseTime(value);
                newState.birthTime = time;
            }
            catch (e) {
                newState.birthTime = null;
            }
        }

        this.setState(newState);
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

        let data = JSON.parse(JSON.stringify(this.state));

        // make sure to save all of the person pickers
        data.personId = await this.personId.current.save();
        data.sponsor1_personId = await this.sponsor1_personId.current.save();
        data.sponsor2_personId = await this.sponsor2_personId.current.save();

        // and location pickers
        data.performedAt_locationId = await this.performedAt_locationId.current.save();
        data.submittedThrough_locationId = await this.submittedThrough_locationId.current.save();


        if (data.personId === null) {
            errors.push('Must select a person or indicate that a new person entry be created.');
        }

        if (errors.length > 0) {
            this.setState({errors: errors});
        }
        else {
            submitApplication(data).then(result => {
                this.setState({message: "save complete, redirecting to initiation page..."});
                window.location = "index.html?initiationid=" + result.initiationId;
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

        // minerval specific
        let deniedInitiation="", minervalSpecific1_2="",minervalSpecific1_3="";
        if (this.state.degreeId === 1) {

            minervalSpecific1_2 = <div className="formLine indent">
                {this.createFormItem('Birth Date', false, <DatePicker utcOffset={0} selected={this.state.birthDate === null ? null : moment.utc(this.state.birthDate)} onChange={m => {this.handleDateChange({type:'DatePicker', value:m, name:'birthDate'})}} />)}
                {this.createFormItem('Birth Time (hh:mm)', false, <input type="text" name="birthTimeText" value={this.state.birthTimeText} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Parsed Time', false, <span>{(this.state.birthTime !== null ? formatTime(this.state.birthTime) : "Invalid Time")}</span>)}

            </div>;
            minervalSpecific1_3 = <div className="formLine indent">
                {this.createFormItem('Birth City', false, <input type="text" name="birthCity" value={this.state.birthCity} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Birth State/Prov', false, <input type="text" name="birthPrincipality" value={this.state.birthPrincipality} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Birth Country', false, <input type="text" name="birthCountryMinerval" value={this.state.birthCountryMinerval} onChange={this.handleChange.bind(this)} />)}
            </div>;

            deniedInitiation = <div className="formItem">
                <div className="formItemTitle">Denied Initiation?</div>
                <div>
                    <input type="radio" name="convictedOfFelony" value={true} checked={!!this.state.deniedInitiation} onChange={this.handleChange.bind(this)} /> No
                    <input type="radio" name="convictedOfFelony" value={false} checked={!this.state.deniedInitiation} onChange={this.handleChange.bind(this)} /> Yes
                </div>
            </div>;
        }

        // 1st degree specific
        let birthCountryFirst = <div className="formLine">
            {this.createFormItem('Country of Birth', true, <input type="text" name="birthCountryFirst" value={this.state.birthCountryFirst} onChange={this.handleChange.bind(this)} />)}
        </div>;
        if (this.state.degreeId !== 2) birthCountryFirst = '';

        // not asked for in minerval
        let magicalName = <div className="formLine">
            {this.createFormItem('Magical Name', true, <input type="text" name="magicalName" value={this.state.magicalName} onChange={this.handleChange.bind(this)} />)}
        </div>;

        if (this.state.degreeId === 1) {
            magicalName = '';
        }

        // TODO add change name checkbox
        // TODO add 2nd/3rd degree tasks - Have you posted? / two names of minerval

        let prevDegreeId = null;
        if (this.state.degreeId > 1) {
            prevDegreeId = this.state.degreeId - 1;
        }

        return <div>

            <div className="formLine">
                {this.createFormItem('Degree', false, <select value={this.state.degreeId} onChange={this.handleDegreeChange.bind(this)}>{degrees}</select>)}
                {this.createFormItem('Date Signed', false, <DatePicker utcOffset={0} selected={this.state.signedDate === null ? null : moment.utc(this.state.signedDate)} onChange={m => {this.handleDateChange({type:'DatePicker', value:m, name:'signedDate'})}} />)}
                <div className="formItem">
                    <div className="formItemTitle">Notes</div>
                    <div><textarea type="text" cols="70" rows="2" name="notes" value={this.state.notes} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Candidate</div>
                    <PersonPicker name="personId" ref={this.personId} lookupDegreeId={prevDegreeId} />
                </div>
            </div>

            {birthCountryFirst}

            {magicalName}

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Phone</div>
                    <div><input type="text" name="phone" value={this.state.phone} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Email</div>
                    <div><input type="text" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            {minervalSpecific1_2}
            {minervalSpecific1_3}

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Convicted of a felony?</div>
                    <div>
                        <input type="radio" name="convictedOfFelony" value={true} checked={!!this.state.convictedOfFelony} onChange={this.handleChange.bind(this)} /> No
                        <input type="radio" name="convictedOfFelony" value={false} checked={!this.state.convictedOfFelony} onChange={this.handleChange.bind(this)} /> Yes
                    </div>
                </div>
                {deniedInitiation}
            </div>

            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Initiating Body Section</div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Proposed date of initiation</div>
                    <div>
                        <DatePicker utcOffset={0} selected={this.state.proposedDate === null ? null : moment.utc(this.state.proposedDate)} onChange={m => {this.handleDateChange({type:'DatePicker', value:m, name:'proposedDate'})}} />
                    </div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">L/O/C to perform initiation</div>
                    <div><LocationPicker ref={this.performedAt_locationId} name="performedAt_locationId" /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Submitted through Lodge / Oasis</div>
                    <div><LocationPicker ref={this.submittedThrough_locationId} name="submittedThrough_locationId" /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItemTitle">Local body contact person</div>
                <div className="formItem">
                    <div className="formItemTitle">Name</div>
                    <div><input type="text" name="contactName" value={this.state.contactName} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItemTitle">Initiator</div>
                <div className="formItem">
                    <div className="formItemTitle">Name</div>
                    <div><input type="text" name="initiatorName" value={this.state.initiatorName} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Phone</div>
                    <div><input type="text" name="initiatorPhone" value={this.state.initiatorPhone} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Email</div>
                    <div><input type="text" name="initiatorEmail" value={this.state.initiatorEmail} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>


            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Sponsor 1</div>
                    <PersonPicker name="sponsor1_personId" ref={this.sponsor1_personId} />
                </div>
            </div>

            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Sponsor 2</div>
                    <PersonPicker name="sponsor2_personId" ref={this.sponsor2_personId} />
                </div>
            </div>

            <div className="formLine">
                <div className="formItem">
                    <input type="button" value="Save Application" onClick={this.handleSubmit.bind(this)} />
                    {errors}
                    <div>{this.state.message}</div>
                </div>
            </div>

        </div>;
    }
}

