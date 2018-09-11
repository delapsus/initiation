import React from 'react';
import {getDegreeById, getDegreeByName, allDegrees} from './degree';
import {formatDate, formatTime} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {PersonPicker} from './PersonPicker.jsx';
import {submitApplication} from "./webservice";
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';



// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a

// O.T.O. U.S.A. Form 1/1, Rev. 3.0 Spring IVxv
export class ApplicationForm extends React.Component {

    constructor(props) {
        super(props);

        //        {name:'initiationId', type:'number', isPrimary:true},
        //        {name:'degreeId', type:'number'},

        this.state = {
            errors:[],
            message: "",

            signedDate: new Date(),

            degreeId: getDegreeByName('1').degreeId,
            personId: null,
            firstName: '',
            middleName: '',
            lastName: '',

            birthCountry: '',
            birthPlace:'',
            birthTime:'',
            profession:'',

            previousName: '', // TODO there should be a checkbox "find by previous name", this forces the find by name to be "find by previous name" and three new boxes for the new name appear
            magicalName: '',

            address: '',
            city: '',
            state: '',
            zipCode: '',

            phone: '',
            email: '',

            bodyMembership: '', // lodge/oasis/camp membership

            healthConcerns: '',
            unableToDrinkAlcohol: false, // yes/no
            medications: '',
            allergies: '',

            convictedOfFelony: false,
            deniedInitiation:false,

            proposedDate: new Date(),
            proposedLocation: '', // TODO make this a selector like name


            contactName: '',
            contactPhone: '',
            contactEmail: '',

            initiatorName: '',
            initiatorPhone: '',
            initiatorEmail: '',

            sponsor1Name: '',
            sponsor2Name: ''
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

    handlePersonChange (event) {
        const target = event.target;
        const name = target.name;
        const nameNew = target.nameNew;
        const id = target.person.personId;

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

        if (!this.state.hasOwnProperty('personId') || this.state.personId === null) {
            errors.push('Must select a person or indicate that a new person entry be created.');
        }

        if (errors.length > 0) {
            this.setState({errors: errors});
        }
        else {
            submitApplication(this.state).then(result => {
                this.setState({message: "save complete. (this should redirect to the initiation page?)"});
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

        // address
        let optionalAddress = <div className="formLine indent">
            {this.createFormItem('Permanent Address', false, <input type="text" name="address" value={this.state.address} onChange={this.handleChange.bind(this)} />)}
            {this.createFormItem('City', false, <input type="text" name="city" value={this.state.city} onChange={this.handleChange.bind(this)} />)}
            {this.createFormItem('State', false, <input type="text" name="state" value={this.state.state} onChange={this.handleChange.bind(this)} />)}
            {this.createFormItem('Zipcode', false, <input type="text" name="zipCode" value={this.state.zipCode} onChange={this.handleChange.bind(this)} />)}
        </div>;
        let addressTitle = "Address";
        if (this.state.degreeId !== 1) optionalAddress = '';
        else addressTitle = "Present Address";

        // minerval specific
        let minervalSpecific1 = "", minervalSpecific2 = "", deniedInitiation="";
        if (this.state.degreeId === 1) {
            minervalSpecific1 = <div className="formLine indent">
                {this.createFormItem('Profession', false, <input type="text" name="profession" value={this.state.profession} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Birthdate', false, <DatePicker selected={moment(this.state.birthDate)} onChange={m => {this.handleChange({target:{type:'DatePicker', value:m.toDate(), name:'birthDate'}})}} />)}
                {this.createFormItem('Birthtime', false, <input type="text" name="birthTime" value={this.state.birthTime} onChange={this.handleChange.bind(this)} />)}
                </div>;

            minervalSpecific2 = <div><div className="formLine indent">
                {this.createFormItem('Schools/Degrees', false, <input type="text" name="education" value={this.state.education} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Qualified to Teach', false, <input type="text" name="teach" value={this.state.teach} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Object in Seeking Admission', false, <input type="text" name="reasonForAdmission" value={this.state.reasonForAdmission} onChange={this.handleChange.bind(this)} />)}
            </div></div>;

            deniedInitiation = <div className="formItem">
                <div className="formItemTitle">Denied Initiation?</div>
                <div>
                    <input type="radio" name="convictedOfFelony" value={true} checked={!!this.state.deniedInitiation} onChange={this.handleChange.bind(this)} /> No
                    <input type="radio" name="convictedOfFelony" value={false} checked={!this.state.deniedInitiation} onChange={this.handleChange.bind(this)} /> Yes
                </div>
            </div>;
        }

        // 1st degree specific
        let birthCountry = <div className="formLine">
            {this.createFormItem('Country of Birth', true, <input type="text" name="birthCountry" value={this.state.birthCountry} onChange={this.handleChange.bind(this)} />)}
        </div>;
        if (this.state.degreeId !== 2) birthCountry = '';

        // not asked for in minerval
        let magicalName = <div className="formLine">
            {this.createFormItem('Magical Name', true, <input type="text" name="magicalName" value={this.state.magicalName} onChange={this.handleChange.bind(this)} />)}
        </div>;

        let bodyMembership = <div className="formLine indent">
            <div className="formItem">
                <div className="formItemTitle">Lodge / Oasis / Camp membership</div>
                <div><input type="text" name="bodyMembership" value={this.state.bodyMembership} onChange={this.handleChange.bind(this)} /></div>
            </div>
        </div>;
                let bodyMembershipMinerval= "";

        if (this.state.degreeId === 1) {
            bodyMembershipMinerval = bodyMembership;
            magicalName = '';
            bodyMembership = '';


        }

        // health info
        let healthAlcohol = this.createFormItem('Are you able to drink alcohol?', false, <div>
            <input type="radio" name="unableToDrinkAlcohol" value={false} checked={!this.state.unableToDrinkAlcohol} onChange={this.handleChange.bind(this)} /> Yes
            <input type="radio" name="unableToDrinkAlcohol" value={true} checked={!!this.state.unableToDrinkAlcohol} onChange={this.handleChange.bind(this)} /> No
        </div>);
        let healthMeds = this.createFormItem('Medications currently being taken', false, <input type="text" name="medications" value={this.state.medications} onChange={this.handleChange.bind(this)} />);
        let healthAllergies = this.createFormItem('Allergies', false, <input type="text" name="allergies" value={this.state.allergies} onChange={this.handleChange.bind(this)} />);

        let healthInfo = <div className="formLine indent">
            {healthAlcohol}
            {healthMeds}
            {healthAllergies}
        </div>;
        let healthInfoMinerval = "";

        if (this.state.degreeId === 1) {
            healthInfo = "";
            healthInfoMinerval = <div className="formLine indent">
                {healthAllergies}
                {healthMeds}
                {healthAlcohol}
            </div>;
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
                {this.createFormItem('Date Signed', false, <DatePicker selected={moment(this.state.signedDate)} onChange={m => {this.handleChange({target:{type:'DatePicker', value:m.toDate(), name:'signedDate'}})}} />)}
            </div>

            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Candidate</div>
                    <PersonPicker name="personId" nameNew="person" onChange={this.handlePersonChange.bind(this)} lookupDegreeId={prevDegreeId} />
                </div>
            </div>

            {birthCountry}

            {magicalName}

            <div className="formLine indent">
                {this.createFormItem(addressTitle, false, <input type="text" name="address" value={this.state.address} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('City', false, <input type="text" name="city" value={this.state.city} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('State', false, <input type="text" name="state" value={this.state.state} onChange={this.handleChange.bind(this)} />)}
                {this.createFormItem('Zipcode', false, <input type="text" name="zipCode" value={this.state.zipCode} onChange={this.handleChange.bind(this)} />)}
            </div>
            {optionalAddress}

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

            {minervalSpecific1}

            {bodyMembership}


            {healthInfoMinerval}
            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Health Conditions/Concerns</div>
                    <div><textarea type="text" cols="70" rows="2" name="healthConcerns" value={this.state.healthConcerns} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>
            {healthInfo}

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

            {bodyMembershipMinerval}

            {minervalSpecific2}

            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Initiating Body Section</div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Proposed date of initiation</div>
                    <div>
                        <DatePicker selected={moment(this.state.proposedDate)} onChange={m => {this.handleChange({target:{type:'DatePicker', value:m.toDate(), name:'proposedDate'}})}} />
                    </div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Lodge / Oasis / Camp to perform initiation</div>
                    <div><input type="text" name="proposedLocation" value={this.state.proposedLocation} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Submitted through Lodge / Oasis</div>
                    <div><input type="text" name="proposedLocation" value={this.state.proposedLocation} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItemTitle">Local body contact person</div>
                <div className="formItem">
                    <div className="formItemTitle">Name</div>
                    <div><input type="text" name="contactName" value={this.state.contactName} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Phone</div>
                    <div><input type="text" name="contactPhone" value={this.state.contactPhone} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Email</div>
                    <div><input type="text" name="contactEmail" value={this.state.contactEmail} onChange={this.handleChange.bind(this)} /></div>
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
                    <PersonPicker name="sponsor1_personId" nameNew="sponsor1" onChange={this.handlePersonChange.bind(this)} />
                </div>
            </div>

            <div className="formLine">
                <div className="formItem">
                    <div className="formItemTitle">Sponsor 2</div>
                    <PersonPicker name="sponsor2_personId" nameNew="sponsor2" onChange={this.handlePersonChange.bind(this)} />
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

