import React from 'react';
import {postAjax} from './http';
import {formatDate, formatTime, putObjectInLines} from './common.js';

function getInitiation(initiationId) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/initiation", {initiationId: initiationId}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class InitiationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initiation: null
        };
    }

    getData() {
        getInitiation(this.props.initiationId).then(result => {
            this.setState({
                initiation: result
            });
        });
    }

    componentDidMount() {
        this.getData();
    }

    render() {

        if (this.state.initiation === null) return <div></div>;

        let html = {__html: putObjectInLines(this.state.initiation)};

        return <div className="initiationPage">
            <div dangerouslySetInnerHTML={html} />
        </div>;
    }

}
