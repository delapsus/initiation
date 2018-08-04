import React from 'react';
import {getDegreeById} from './degree';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {PersonPicker} from './PersonPicker.jsx';


// https://blog.logrocket.com/an-imperative-guide-to-forms-in-react-927d9670170a

// O.T.O. U.S.A. Form 1/1, Rev. 3.0 Spring IVxv
export class ApplicationFirst extends React.Component {

    constructor(props) {
        super(props);

        //        {name:'initiationId', type:'number', isPrimary:true},
        //        {name:'degreeId', type:'number'},
        this.state = {
            signedDate: '',

            personId: '-1',
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
        const value = target.type === 'checkbox' ? target.checked : target.value;
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
        console.log('Form value: ' + this.state.inputvalue);
        event.preventDefault();
    }

    render() {

        let html = {__html: putObjectInLines(this.state)};
        //let html = {__html:  "<div></div>"};

        return <div>
            <form onSubmit={this.handleSubmit.bind(this)}>

                <PersonPicker name="personId" nameNew="person" onChange={this.handlePersonChange.bind(this)} />

                <table>
                    <thead>
                    <tr>
                        <th>Birth Country</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><input type="text" name="birthCountry" value={this.state.birthCountry} onChange={this.handleChange.bind(this)} /></td>
                    </tr>
                    </tbody>
                </table>


            </form>

            <div dangerouslySetInnerHTML={html} />
        </div>;
    }
}


