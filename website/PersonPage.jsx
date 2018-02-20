import React from 'react';
import {postAjax} from './http';

function getPerson(personId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/person", {personId: personId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class PersonPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            person: {}
        };
    }

    getPersonData() {
        getPerson(this.props.personId).then(result => {
            this.setState({
                person: result
            });

        });
    }

    componentDidMount() {
        this.getPersonData();
    }

    render() {
        let html = {__html: putObjectInLines(this.state.person)};
        return <div dangerouslySetInnerHTML={html} />;
    }

}

function putObjectInLines(o) {
    let lines = [];

    //lines.push('<div>{</div>');
    for (let key in o) {
        if (o[key] === null) {

        }
        else if (typeof o[key] === 'object' && Array.isArray(o[key])) {
            lines.push(`<div class="indent">${key}: [</div>`);
            lines.push(`<div class="indent">${putObjectInLines(o[key])}</div>`);
            lines.push(`<div class="indent">}]</div>`);
        }
        else if (typeof o[key] === 'object') {
            lines.push(`<div class="indent">${key}: {</div>`);
            lines.push(`<div class="indent">${putObjectInLines(o[key])}</div>`);
            lines.push(`<div class="indent">}</div>`);
        }
        else {
            lines.push(`<div class="indent">${key}: ${o[key]}</div>`);
        }

    }
    //lines.push('<div>}</div>');
    return lines.join('\n');
}