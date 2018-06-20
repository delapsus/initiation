import React from 'react';
import {getDegreeById} from './degree';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';


export class ApplicationFirst extends React.Component {

    constructor(props) {
        super(props);

        //        {name:'initiationId', type:'number', isPrimary:true},
        //        {name:'degreeId', type:'number'},
        this.state = {
            signedDate: '',

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
            unableToDrinkAlcohol: '', // yes/no
            medications: '',
            allergies: '',
            convictedOfFelony: '',

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

    handleChange(event) {
        const key = "firstName";
        const o = {};
        o[key] = event.target.value;
        
        this.setState(o);
    }

    render() {

        return <div>

            <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange.bind(this)} />

        </div>;
    }
}
