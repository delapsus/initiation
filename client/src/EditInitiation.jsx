import React from 'react';
import {getInitiation} from './webservice';
import {formatDate, formatTime, putObjectInLines} from './common.js';
import {PersonLink} from './PersonLink.jsx';
import {LocationPicker} from './LocationPicker.jsx';
import {LocationLink} from './LocationLink.jsx';
import {PersonPicker} from "./PersonPicker.jsx";
import {getOfficerByDegreeId} from "./officer";


export class EditInitiation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initiation: null
        };

        this.officers = {};
        this.officerPickers = {};
        this.sponsor1Picker = React.createRef();
        this.sponsor2Picker = React.createRef();
        this.locationPicker = React.createRef();
    }

    getData() {
        getInitiation(this.props.initiationId).then(result => {

            //init.data.officers.forEach()

            this.officers = getOfficerByDegreeId(result.degree.degreeId);

            // fix the pickers
            this.officers.forEach(o => {
                let key = o.officerId.toString();
                this.officerPickers[key] = React.createRef();
            });



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

        // create the officer rows
        let officerInput = this.officers.map((officer, i) => {
            let key = officer.officerId.toString();

            // get the personId if available
            let officerEntry = this.state.initiation.data.officers.find(o => {
                return o.officerId === officer.officerId;
            });

            return <div className="formLine" key={i}>
                <div className="formItem">
                    <div className="formItemTitle">{officer.name}</div>
                    <PersonPicker ref={this.officerPickers[key]} name={"officer" + key} index={i} savedPerson={officerEntry.person} />
                </div>
            </div>;
        });

        let editLink = "index.html?page=edit-initiation&initiationid=" + this.props.initiationId;

        return <div className="initiationPage">

            <div className="pageTitleDiv">
                <span className="pageTitle">Initiation</span> | <a href={editLink}>Edit Initiation Data</a>
            </div>

            <div><div className="title">Person:</div><div><PersonLink person={init.person} /></div></div>
            <div style={{marginBottom:"1em"}}><div className="title">Degree:</div><div>{init.degree.name}</div></div>

            <div className="formLine" style={{marginBottom:"1em"}}>
                <div className="formItem" style={{marginBottom:"1em"}}>
                    <div className="formItemTitle">Sponsor 1:</div>
                    <PersonPicker ref={this.sponsor1Picker} name={"sponsor1_person"} savedPerson={init.sponsor1_person} />
                </div>
                <div className="formItem">
                    <div className="formItemTitle">Sponsor 2:</div>
                    <div><PersonPicker ref={this.sponsor2Picker} name={"sponsor2_person"} savedPerson={init.sponsor2_person} /></div>
                </div>
            </div>

            <div><div className="title">Local body Membership:</div><div>{init.data.localBody}</div></div>

            <div className="formLine" style={{marginTop:"1em"}}>
                <div className="formItem">
                    <div className="formItemTitle">Location:</div>
                    <div><LocationPicker ref={this.locationPicker} savedLocation={init.location} ></LocationPicker></div>
                </div>
            </div>

            <div>
                {officerInput}
            </div>

            <div style={{marginTop:"1em"}}><div className="title">localBodyDate:</div><div>{formatDate(init.data.localBodyDate)}</div></div>
            <div><div className="title">signedDate:</div><div>{formatDate(init.data.signedDate)}</div></div>
            <div><div className="title">proposedDate:</div><div>{formatDate(init.data.proposedDate)}</div></div>
            <div><div className="title">approvedDate:</div><div>{formatDate(init.data.approvedDate)}</div></div>
            <div><div className="title">actualDate:</div><div>{formatDate(init.data.actualDate)}</div></div>
            <div><div className="title">reportedDate:</div><div>{formatDate(init.data.reportedDate)}</div></div>

            <div style={{marginTop:"1em"}}><div>Cert:</div></div>
            <div><div className="title">Received:</div><div>{formatDate(init.data.certReceivedDate)}</div></div>
            <div><div className="title">Sent Out For Signature:</div><div>{formatDate(init.data.certSentOutForSignatureDate)}</div></div>
            <div><div className="title">Sent Out To Body:</div><div>{formatDate(init.data.certSentOutToBodyDate)}</div></div>

        </div>;
    }

}
