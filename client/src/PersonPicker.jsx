import React from "react";
import {postAjax} from "./http";
import {getDegreeById} from "./degree";
import {getInitiationDate} from './common.js';
import axios from 'axios'


function getPeople(state) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:2020/data/people?pageSize=10&index=0&textSearch=${state.textSearch}`)
        .then((e) =>{
            resolve( e.data);
        })
        .catch((e)=>{
            reject(e)
        }) 
    });
}

export function submitPersonPicker(data) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/submit-person-picker", {person:data}, result => {
            result = JSON.parse(result);
            resolve(result.personId);
        });
    });
}

export class PersonPicker extends React.Component {

    constructor(props) {
        super(props);

        let savedPerson = props.hasOwnProperty('savedPerson') ? props.savedPerson : null;
        let savedPersonId = savedPerson === null ? null : savedPerson.personId;

        this.state = {
            // this should show ABOVE the selector as the selected option
            savedPersonId: savedPersonId,
            savedPerson: savedPerson,

            personId: savedPersonId,

            firstName: '',
            middleName: '',
            lastName: '',

            suggestions: null,

            lookupDegreeId: props.hasOwnProperty('lookupDegreeId') ? props.lookupDegreeId : null
        };

    }

    // first/middle/last text change
    handleTextChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        this.setState({ [name]: value });
    }

    handleSelectChange (event) {
        const target = event.target;
        let value = (target.type === 'checkbox' ? target.checked : target.value).trim();
        value = +value;

        this.setState({ personId: value });
    }


    async save() {

        // if the ID is -1, we'll need to create the person record
        if (this.state.personId === -1) {
            let personId = await submitPersonPicker({
                firstName: this.state.firstName,
                middleName: this.state.middleName,
                lastName: this.state.lastName
            });
            return personId;
        }

        // otherwise just use the selected value
        return this.state.personId;
    }

    getData() {

        if (this.state.firstName.length === 0 && this.state.lastName.length === 0) {
            this.setState({suggestions: null});
            return;
        }

        let combined = this.state.firstName + " " + this.state.lastName; // + " " + this.state.middleName
        getPeople({textSearch:combined.trim()}).then(result => {

            let personId = this.state.personId;

            if (personId !== null && personId !== -1) {

                // if personId is not in the new result set, reset it
                let found = false;
                result.people.forEach(person => {
                    if (person.personId === personId) found = true;
                });

                let newPersonId = this.state.savedPersonId;

                this.setState({suggestions: result, personId: found ? personId : newPersonId});
            }
            else {
                this.setState({suggestions: result});
            }

        });
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps, prevState) {

        // sometimes parent will change the lookupDegreeId
        if (prevProps.lookupDegreeId !== this.props.lookupDegreeId) {
            this.setState({lookupDegreeId: this.props.lookupDegreeId});
        }

        // don't do an update if nothing changed
        if (prevState.firstName === this.state.firstName
            && prevState.middleName === this.state.middleName
            && prevState.lastName === this.state.lastName
            && prevState.lookupDegreeId === this.state.lookupDegreeId
        ) return;

        this.getData();
    }

    render() {

        let picks = [];

        // saved person entry
        if (this.state.savedPerson !== null) {
            let initDateCol = this.state.lookupDegreeId === null ? null : null;//<td>{getInitiationDate(initiation)}</td>;
            let person = this.state.savedPerson;

            picks.push(<tr key={-3}>
                <td><input type="radio" name={this.props.name + "Radio"} value={this.state.savedPersonId} onChange={this.handleSelectChange.bind(this)} checked={this.state.savedPersonId === this.state.personId} /></td>
                <td>{person.data.firstName}</td>
                <td>{person.data.middleName}</td>
                <td>{person.data.lastName}</td>
                {initDateCol}
            </tr>);
        }

        // text entry
        picks.push(<tr key={-2}>
            <td className="indentBlock"></td>
            <td><input type="text" name="firstName" value={this.state.firstName} onChange={this.handleTextChange.bind(this)} autoComplete="new-password" /></td>
            <td><input type="text" name="middleName" value={this.state.middleName} onChange={this.handleTextChange.bind(this)} autoComplete="new-password" /></td>
            <td><input type="text" name="lastName" value={this.state.lastName} onChange={this.handleTextChange.bind(this)} autoComplete="new-password" /></td>
        </tr>);

        if (this.state.suggestions !== null) {

            // new person option
            picks.push(<tr key={-1}>
                <td><input type="radio" name={this.props.name + "Radio"} value={-1} onChange={this.handleSelectChange.bind(this)} /></td>
                <td colSpan="3">Create a New Person Entry</td>
            </tr>);

            // then each of the options
            this.state.suggestions.people.forEach((person, i) => {

                // dont show the saved person
                if (person.personId === this.state.savedPersonId) return;

                let initiation = person.initiations.find(init => {
                    if (init.data.degreeId === this.state.lookupDegreeId) return true;
                }) || null;

                let initDateCol = this.state.lookupDegreeId === null ? null : <td>{getInitiationDate(initiation)}</td>;

                picks.push(<tr key={i}>
                    <td><input type="radio" name={this.props.name + "Radio"} value={person.personId} onChange={this.handleSelectChange.bind(this)} checked={person.personId === this.state.personId} /></td>
                    <td>{person.data.firstName}</td>
                    <td>{person.data.middleName}</td>
                    <td>{person.data.lastName}</td>
                    {initDateCol}
                </tr>);
            });

        }

        let degreeHeader = null;
        if (this.state.lookupDegreeId) {
            let degree = getDegreeById(this.state.lookupDegreeId);
            degreeHeader = <th>{degree.longName || degree.name}</th>;
        }

        return <div className="personPicker">
            <input type="hidden" value="something"/>

            <table className="noPad">
                <thead>
                <tr>
                    <th></th>
                    <th className="formItemTitle">First</th>
                    <th className="formItemTitle">Middle</th>
                    <th className="formItemTitle">Last</th>
                    {degreeHeader}
                </tr>
                </thead>
                <tbody>{picks}</tbody>
            </table>

        </div>;
    }

}