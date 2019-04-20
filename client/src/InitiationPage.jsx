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

        let officers = init.data.officers.map((o, i) => {
            return <div key={i}>
                <div className="title">{o.officer.name}:</div><div><PersonLink person={o.person} altName={o.name} /></div>
            </div>
        });

        let otherPeople = init.otherPeople.map((p, i) => {
            return <div key={i}><PersonLink person={p} /></div>
        });

        let editLink = "index.html?page=edit-initiation&initiationid=" + this.props.initiationId;

        let submittedThrough = init.submittedThroughLocation === null ? "" : <div style={{marginTop:"0.5em"}}><div className="title">Submitted Through:</div><div><LocationLink location={init.submittedThroughLocation}></LocationLink></div></div>;

        return <div className="initiationPage">

            <div className="pageTitleDiv">
                <span className="pageTitle">Initiation</span> | <a href={editLink}>Edit Initiation Data</a>
            </div>

            <div><div className="title">Person:</div><div><PersonLink person={init.person} /></div></div>
            <div><div className="title">Degree:</div><div>{init.degree.name}</div></div>
            <div><div className="title">Sponsor 1:</div><div><PersonLink person={init.sponsor1_person} altNameFirst={init.data.sponsor1First} altNameLast={init.data.sponsor1Last} /></div></div>
            <div><div className="title">Sponsor 2:</div><div><PersonLink person={init.sponsor2_person} altNameFirst={init.data.sponsor2First} altNameLast={init.data.sponsor2Last} /></div></div>


            <div style={{marginTop:"0.5em"}}><div className="title">Location:</div><div><LocationLink location={init.location} altName={init.data.location}></LocationLink></div></div>
            {submittedThrough}

            <div style={{marginBottom:"1em"}}>&nbsp;</div>

            {officers}
            <div><div className="title">Others Initiated:</div><div>{otherPeople}</div></div>

            <div style={{marginTop:"1em", fontWeight:'bold'}}><div>Application:</div></div>
            <div><div className="title">localBodyDate:</div><div>{formatDate(init.data.localBodyDate)}</div></div>
            <div><div className="title">signedDate:</div><div>{formatDate(init.data.signedDate)}</div></div>
            <div><div className="title">approvedDate:</div><div>{formatDate(init.data.approvedDate)}</div></div>

            <div style={{marginTop:"1em", fontWeight:'bold'}}><div>Initiation:</div></div>
            <div><div className="title">proposedDate:</div><div>{formatDate(init.data.proposedDate)}</div></div>
            <div><div className="title">actualDate:</div><div>{formatDate(init.data.actualDate)}</div></div>
            <div><div className="title">reportedDate:</div><div>{formatDate(init.data.reportedDate)}</div></div>

            <div style={{marginTop:"1em", fontWeight:'bold'}}><div>Certificate:</div></div>
            <div><div className="title">Received from body:</div><div>{formatDate(init.data.certReceivedDate)}</div></div>
            <div><div className="title">Sent Out For Signature:</div><div>{formatDate(init.data.certSentOutForSignatureDate)}</div></div>
            <div><div className="title">Sent Out To Body:</div><div>{formatDate(init.data.certSentOutToBodyDate)}</div></div>

        </div>;
    }

}
