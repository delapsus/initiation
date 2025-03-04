import React from 'react';
import { postAjax } from './http';
import { InitiationDisplay, InitiationDisplayHeader } from './InitiationDisplay.jsx';
import { getLocations } from './data/locations'
import axios from "axios";

async function getInitiations(state) {

    const initiationResult = await axios.get(
        `http://localhost:2020/data/initiation/all?pageSize=${state.pageSize}&index=${state.pageIndex}&degreeId=${state.degreeId}&status=${state.status}&sort=${state.sort}&maxDays=${state.maxDays}&locationId=${state.locationId}`
    );
    return initiationResult.data;
}


export class InitiationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initiations: [],
            pageSize: 30,
            pageIndex: 0,
            pageCount: 0,
            recordCount: 0,
            degreeId: null,
            status: "",
            sort: "actualDateDesc",
            maxDays: 0,
            locations: [],
            locationId: 0
        };
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.handleDegreeChange = this.handleDegreeChange.bind(this);

        getLocations().then(res => {
            this.setState({
                locations: res.locations
            });
        });
    }


    async getData() {
        const result = await getInitiations(this.state)
        this.setState({
            initiations: result.initiations,
            pageCount: Math.ceil(result.count / this.state.pageSize),
            recordCount: result.count
        });
    }

    componentDidMount() {
        this.getData();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageIndex === this.state.pageIndex
            && prevState.degreeId === this.state.degreeId
            && prevState.status === this.state.status
            && prevState.sort === this.state.sort
            && prevState.maxDays === this.state.maxDays
            && prevState.locationId === this.state.locationId
        ) return;
        this.getData();
    }
    onClickPrev() {
        this.setState({ pageIndex: this.state.pageIndex - 1 });
    }
    onClickNext() {
        this.setState({ pageIndex: this.state.pageIndex + 1 });
    }
    handleDegreeChange(event) {
        this.setState({ degreeId: +event.target.value, pageIndex: 0 });
    }
    handleStatusChange(event) {
        this.setState({ status: event.target.value, pageIndex: 0 });
    }
    handleSortChange(event) {
        this.setState({ sort: event.target.value, pageIndex: 0 });
    }
    handleMaxDaysChange(event) {
        this.setState({ maxDays: +event.target.value, pageIndex: 0 });
    }
    handleLocationChange(event) {
        this.setState({ locationId: +event.target.value, pageIndex: 0 });
    }


    render() {


        let pageNext = <span className="link" onClick={this.onClickNext}>next</span>;
        if (this.state.pageIndex + 1 === this.state.pageCount) pageNext = "next";

        let pagePrev = <span className="link" onClick={this.onClickPrev}>prev</span>;
        if (this.state.pageIndex === 0) pagePrev = "prev";

        let inits = this.state.initiations.map((init, i) => {
            return <InitiationDisplay initiation={init} key={i} showPerson={true} dontShowSponsors={true} />;
        });

        let locationOptions = this.state.locations.map((location, i) => {
            return <option value={location.locationId} key={i}>{location.data.name}</option>
        });

        /*
            {name:'certReceivedDate', type:'datetime'},
    {name:'certSentOutForSignatureDate', type:'datetime'},
    {name:'certSentOutToBodyDate', type:'datetime'},
         */

        return <div>

            <div id="peopleFilters">

                <div className="item">
                    Degree: <select value={this.state.degreeId || 0} onChange={this.handleDegreeChange}>
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
                    Sort: <select value={this.state.sort} onChange={this.handleSortChange.bind(this)}>
                        <option value="actualDateDesc">Date (desc)</option>
                        <option value="actualDateAsc">Date (asc)</option>
                    </select>
                </div>

                <div className="item">
                    <div><input type="radio" name="status" value="" checked={this.state.status === ""} onChange={this.handleStatusChange.bind(this)} /> Show All</div>
                    <div><input type="radio" name="status" value="waitingForReport" checked={this.state.status === "waitingForReport"} onChange={this.handleStatusChange.bind(this)} /> Waiting For Initiation Report</div>

                    <div><input type="radio" name="status" value="waitingForCert" checked={this.state.status === "waitingForCert"} onChange={this.handleStatusChange.bind(this)} /> Waiting For Cert From Body</div>
                    <div><input type="radio" name="status" value="receivedCertFromBody" checked={this.state.status === "receivedCertFromBody"} onChange={this.handleStatusChange.bind(this)} /> Received cert, need to send for signature</div>
                    <div><input type="radio" name="status" value="sentForSig" checked={this.state.status === "sentForSig"} onChange={this.handleStatusChange.bind(this)} /> Sent For Signature</div>
                    <div><input type="radio" name="status" value="certSentToBody" checked={this.state.status === "certSentToBody"} onChange={this.handleStatusChange.bind(this)} /> Cert Sent to Body (complete)</div>
                </div>

                <div className="item">
                    Last Update: <select value={this.state.maxDays} onChange={this.handleMaxDaysChange.bind(this)}>
                        <option value="0">All</option>
                        <option value={30}>30 Days</option>
                        <option value={90}>90 Days</option>
                        <option value={365}>1 Year</option>
                        <option value={365 * 2}>2 Years</option>
                        <option value={365 * 3}>3 Years</option>
                        <option value={365 * 4}>4 Years</option>
                        <option value={365 * 5}>5 Years</option>
                    </select>
                </div>

                <div className="item" style={{ marginTop: '1em' }}>
                    Location: <select value={this.state.locationId} onChange={this.handleLocationChange.bind(this)}>
                        <option value="0">All</option>
                        {locationOptions}
                    </select>
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


