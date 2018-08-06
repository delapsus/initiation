import React from 'react';
import {postAjax} from './http';
import {formatDate} from './common.js';
import {InitiationDisplay, InitiationDisplayHeader} from './InitiationDisplay.jsx';

function getInitiations(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/initiations", {
            pageSize:state.pageSize,
            index: state.pageIndex,
            degreeId: state.degreeId,
            status: state.status
        }, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

export class InitiationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initiations: [],
            pageSize: 40,
            pageIndex: 0,
            pageCount: 0,
            recordCount: 0,
            degreeId: null,
            status: ""
        };
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.handleDegreeChange = this.handleDegreeChange.bind(this);
    }


    getData() {
        getInitiations(this.state).then(result => {
            this.setState({
                initiations: result.initiations,
                pageCount: Math.ceil(result.count / this.state.pageSize),
                recordCount: result.count
            });

        });
    }

    componentDidMount() {
        this.getData();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageIndex === this.state.pageIndex
            && prevState.degreeId === this.state.degreeId
            && prevState.status === this.state.status
        ) return;
        this.getData();
    }
    onClickPrev() {
        this.setState({pageIndex: this.state.pageIndex - 1});
    }
    onClickNext() {
        this.setState({pageIndex: this.state.pageIndex + 1});
    }
    handleDegreeChange(event) {
        this.setState({degreeId: +event.target.value, pageIndex:0});
    }
    handleStatusChange(event) {
        this.setState({status: event.target.value, pageIndex:0});
    }

    render() {


        let pageNext = <span className="link" onClick={this.onClickNext}>next</span>;
        if (this.state.pageIndex + 1 === this.state.pageCount) pageNext = "next";

        let pagePrev = <span className="link" onClick={this.onClickPrev}>prev</span>;
        if (this.state.pageIndex === 0) pagePrev = "prev";

        let inits = this.state.initiations.map((init, i) => {
            return <InitiationDisplay initiation={init} key={i} showPerson={true} dontShowSponsors={true} />;
        });

        /*
            {name:'certReceivedDate', type:'datetime'},
    {name:'certSentOutForSignatureDate', type:'datetime'},
    {name:'certSentOutToBodyDate', type:'datetime'},
         */

        return <div>

            <div id="peopleFilters">

                <div className="item">
                    Degree: <select value={this.state.degreeId} onChange={this.handleDegreeChange}>
                    <option value="0"></option>
                    <option value="-1">none</option>
                    <option value="1">0</option>
                    <option value="2">1</option>
                    <option value="3">2</option>
                    <option value="4">3</option>
                    <option value="5">4</option>
                    <option value="6">PI</option>
                    <option value="7">KEW</option>
                    <option value="8">5</option>
                    <option value="9">KRE</option>
                    <option value="10">6</option>
                    <option value="11">GIC</option>
                    <option value="12">PRS</option>
                    <option value="13">7</option>
                    <option value="14">8</option>
                    <option value="15">9</option>
                    <option value="16">10</option>
                </select>
                </div>
                <div className="item">
                    <div><input type="radio" name="status" value="" checked={this.state.status === ""} onChange={this.handleStatusChange.bind(this)} /> Show All</div>
                    <div><input type="radio" name="status" value="waitingForCert" checked={this.state.status === "waitingForCert"} onChange={this.handleStatusChange.bind(this)} /> Waiting For Cert From Body</div>
                    <div><input type="radio" name="status" value="receivedCertFromBody" checked={this.state.status === "receivedCertFromBody"} onChange={this.handleStatusChange.bind(this)} /> Received cert, need to send for signature</div>

                    
                    <div><input type="radio" name="status" value="sentForSig" checked={this.state.status === "sentForSig"} onChange={this.handleStatusChange.bind(this)} /> Sent For Signature</div>
                    <div><input type="radio" name="status" value="certSentToBody" checked={this.state.status === "certSentToBody"} onChange={this.handleStatusChange.bind(this)} /> Cert Sent to Body (complete)</div>
                </div>

            </div>

            <div id="resultsHeader">
                <div className="item">Records: {this.state.recordCount}</div>
                <div className="item">Page: {pagePrev} {this.state.pageIndex + 1} / {this.state.pageCount} {pageNext}</div>
            </div>

            <InitiationDisplayHeader showPerson={true} dontShowSponsors={true} />
            {inits}
        </div>;
    }
}


