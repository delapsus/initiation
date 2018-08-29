import React from 'react';
import {getInitiation} from './webservice';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {LocationLink} from './LocationLink.jsx';



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

        //let html = {__html: putObjectInLines(this.state.initiation)};
        let html = {__html:  "<div></div>"};

        let init = this.state.initiation;

        let officers = init.data.officers.map(o => {
            return <div>{o.officer.name}: <PersonLink person={o.person} altName={o.name} /></div>
        });

        let otherPeople = init.otherPeople.map(p => {
            return <div><PersonLink person={p} /></div>
        });


        return <div className="initiationPage">

            <div>Degree: {init.degree.name}</div>
            <div>Person: <PersonLink person={init.person} /></div>
            <div>Location: <LocationLink location={init.location} altName={init.data.location}></LocationLink></div>

            <div>Sponsor 1: <PersonLink person={init.sponsor1_person} altNameFirst={init.data.sponsor1First} altNameLast={init.data.sponsor1Last} /></div>
            <div>Sponsor 2: <PersonLink person={init.sponsor2_person} altNameFirst={init.data.sponsor2First} altNameLast={init.data.sponsor2Last} /></div>
            {officers}
            <div>Other People:</div>
            {otherPeople}


            <div>Local body Membership: {init.data.localBody}</div>

            <div>localBodyDate: {formatDate(init.data.localBodyDate)}</div>
            <div>signedDate: {formatDate(init.data.signedDate)}</div>
            <div>proposedDate: {formatDate(init.data.proposedDate)}</div>
            <div>approvedDate: {formatDate(init.data.approvedDate)}</div>
            <div>actualDate: {formatDate(init.data.actualDate)}</div>
            <div>reportedDate: {formatDate(init.data.reportedDate)}</div>

            <div>Cert:</div>
            <div>certReceivedDate: {formatDate(init.data.certReceivedDate)}</div>
            <div>certSentOutForSignatureDate: {formatDate(init.data.certSentOutForSignatureDate)}</div>
            <div>certSentOutToBodyDate: {formatDate(init.data.certSentOutToBodyDate)}</div>

            <div dangerouslySetInnerHTML={html} />
        </div>;
    }

}
