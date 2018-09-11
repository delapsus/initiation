import React from "react";
import {postAjax} from "./http";
import {getDegreeById} from "./degree";
import {getInitiationDate} from './common.js';

function getPeople(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/people", {pageSize:10, index: 0, textSearch: state.textSearch}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class PersonPicker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            middleName: '',
            lastName: '',
            suggestions: null,
            personId: null,
            lookupDegreeId: props.hasOwnProperty('lookupDegreeId') ? props.lookupDegreeId : null
        };

    }

    handleChange (event) {
        const target = event.target;
        let value = (target.type === 'checkbox' ? target.checked : target.value).trim();
        let name = target.name;
        const key = this.props.name + "Radio";

        if (name === key) name = 'personId';

        if (name === 'personId') value = +value;

        this.setState({
            [name]: value
        });

        // pass up an on change
        if (name === 'personId' && this.props.hasOwnProperty('onChange')) {

            this.sendChange(value, {
                firstName: this.state.firstName,
                middleName: this.state.middleName,
                lastName: this.state.lastName
            });

        }
        else {
            let data = {
                firstName: this.state.firstName,
                middleName: this.state.middleName,
                lastName: this.state.lastName
            };

            data[name] = value;

            this.sendChange(this.state.personId, data);
        }
    }

    sendChange(personId, data) {

        // pass up an on change
        if (this.props.hasOwnProperty('onChange')) {

            let person = {
                personId: personId
            };

            // indicates that this is a new person, pass the data
            if (person.personId === -1) {
                person.personId = -1;
                person.data = data;
            }

            this.props.onChange({
                target:{
                    type: 'PersonPicker',
                    name: this.props.name,
                    nameNew: this.props.nameNew,
                    person: person
                }
            });
        }
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

                this.setState({suggestions: result, personId: found ? personId : null});

                if (!found) this.sendChange(null, null);
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

        if (prevProps.lookupDegreeId !== this.props.lookupDegreeId) {
            this.setState({lookupDegreeId: this.props.lookupDegreeId});
        }

        if (prevState.firstName === this.state.firstName
            && prevState.middleName === this.state.middleName
            && prevState.lastName === this.state.lastName
            && prevState.lookupDegreeId === this.state.lookupDegreeId
        ) return;
        this.getData();
    }

    render() {

        let picks = [];

        picks.push(<tr key={-2}>
            <td className="indentBlock"></td>
            <td><input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange.bind(this)} autoComplete="new-password" /></td>
            <td><input type="text" name="middleName" value={this.state.middleName} onChange={this.handleChange.bind(this)} autoComplete="new-password" /></td>
            <td><input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange.bind(this)} autoComplete="new-password" /></td>
        </tr>);

        if (this.state.suggestions !== null) {

            picks.push(<tr key={-1}>
                <td><input type="radio" name={this.props.name + "Radio"} value={-1} onChange={this.handleChange.bind(this)} /></td>
                <td colSpan="3">Create a New Person Entry</td>
            </tr>);

            this.state.suggestions.people.forEach((person, i) => {

                let initiation = person.initiations.find(init => {
                    if (init.data.degreeId === this.state.lookupDegreeId) return true;
                }) || null;

                let initDateCol = this.state.lookupDegreeId === null ? '' : <td>{getInitiationDate(initiation)}</td>;

                picks.push(<tr key={i}>
                    <td><input type="radio" name={this.props.name + "Radio"} value={person.personId} onChange={this.handleChange.bind(this)} checked={person.personId === this.state.personId} /></td>
                    <td>{person.data.firstName}</td>
                    <td>{person.data.middleName}</td>
                    <td>{person.data.lastName}</td>
                    {initDateCol}
                </tr>);
            });

        }

        let degreeHeader = '';
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