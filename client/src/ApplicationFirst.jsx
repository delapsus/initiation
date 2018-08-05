import React from 'react';
import {getDegreeById, getDegreeByName} from './degree';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {PersonPicker} from './PersonPicker.jsx';
import {postAjax} from "./http";


function submitApplication(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-application", {data:state}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a

// O.T.O. U.S.A. Form 1/1, Rev. 3.0 Spring IVxv
export class ApplicationFirst extends React.Component {

    constructor(props) {
        super(props);

        //        {name:'initiationId', type:'number', isPrimary:true},
        //        {name:'degreeId', type:'number'},
        this.state = {
            errors:[],
            message: "",

            signedDate: '',

            degreeId: getDegreeByName('1').degreeId,
            personId: null,
            firstName: '',
            middleName: '',
            lastName: '',
            birthCountry: '',

            previousName: '',
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

            minervalDate: '',
            minervalLocation: '',

            proposedDate: '',
            proposedLocation: '',

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
        let value = target.type === 'checkbox' ? target.checked : target.value;
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

    handleSubmit (event) {

        let errors = [];

        if (!this.state.hasOwnProperty('personId') || this.state.personId === null) {
            errors.push('Must select a person or indicate that a new person entry be created.');
        }

        if (errors.length > 0) {
            this.setState({errors: errors});
        }
        else {
            submitApplication(this.state).then(() => {
                this.setState({message: "save complete. (this should redirect to the initiation page?)"});
            });
            this.setState({errors: errors, message: "saving..."});
        }

    }

    render() {

        let html = {__html: putObjectInLines(this.state)};
        //let html = {__html:  "<div></div>"};

        let errors = "";
        if (this.state.errors.length > 0) {
            errors = this.state.errors.map(e => {
                return <div className="error">{e}</div>;
            });
        }

        return <div>

            <div className="formLine">

                <div className="formItem">
                    <div className="formItemTitle">Candidate</div>
                    <PersonPicker name="personId" nameNew="person" onChange={this.handlePersonChange.bind(this)} />
                </div>

                <div className="formItem">
                    <div className="formItemTitle">&nbsp;</div>
                    <div className="formItemTitle">Country of Birth</div>
                    <div><input type="text" name="birthCountry" value={this.state.birthCountry} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Address</div>
                    <div><input type="text" name="address" value={this.state.address} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">City</div>
                    <div><input type="text" name="city" value={this.state.city} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">State</div>
                    <div><input type="text" name="state" value={this.state.state} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Zipcode</div>
                    <div><input type="text" name="zipCode" value={this.state.zipCode} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

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

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Lodge / Oasis / Camp membership</div>
                    <div><input type="text" name="bodyMembership" value={this.state.bodyMembership} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Health Conditions/Concerns</div>
                    <div><input type="text" name="healthConcerns" value={this.state.healthConcerns} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Are you able to drink alcohol?</div>
                    <div>
                        <input type="radio" name="unableToDrinkAlcohol" value={false} checked={!this.state.unableToDrinkAlcohol} onChange={this.handleChange.bind(this)} /> Yes
                        <input type="radio" name="unableToDrinkAlcohol" value={true} checked={!!this.state.unableToDrinkAlcohol} onChange={this.handleChange.bind(this)} /> No
                    </div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Medications currently being taken</div>
                    <div><input type="text" name="medications" value={this.state.medications} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Allergies</div>
                    <div><input type="text" name="allergies" value={this.state.allergies} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine indent">
                <div className="formItem">
                    <div className="formItemTitle">Proposed date of initiation</div>
                    <div><input type="text" name="proposedDate" value={this.state.proposedDate} onChange={this.handleChange.bind(this)} /></div>
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Lodge / Oasis / Camp to perform initiation</div>
                    <div><input type="text" name="proposedLocation" value={this.state.proposedLocation} onChange={this.handleChange.bind(this)} /></div>
                </div>
            </div>

            <div className="formLine">
                <div className="formItemTitle">Local body contact person</div>
                <div className="formItem indent">
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

            <div className="formLine">
                <div className="formItemTitle">Initiator</div>
                <div className="formItem indent">
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


            <div dangerouslySetInnerHTML={html} />
        </div>;
    }
}

/*

    convictedOfFelony: false,

    sponsor1Name: '',
    sponsor2Name: ''
 */
