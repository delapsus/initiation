import React from 'react';
import {postAjax} from './http';
import {formatDate} from './common.js';

function getPeople(state) {
    return new Promise((resolve, reject) => {

        let args = {
            pageSize:state.pageSize,
            index: state.pageIndex,
            textSearch: state.searchText,
            degreeId:state.degreeId,
            sortBy: state.sortBy
        };

        postAjax("http://localhost:2020/data/people", args, result => {
            result = JSON.parse(result);
            resolve(result);
        });

    });
}

export class PeopleSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            pageSize: 30,
            pageIndex: 0,
            pageCount: 0,
            recordCount: 0,

            searchText: "",
            degreeId: 0,
            sortBy: 'lastName'
        };
    }


    updatePeopleList() {
        getPeople(this.state).then(result => {
            this.setState({
                people: result.people,
                pageCount: Math.ceil(result.count / this.state.pageSize),
                recordCount: result.count
            });

        });
    }

    componentDidMount() {
        this.updatePeopleList();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageIndex === this.state.pageIndex
            && prevState.searchText === this.state.searchText
            && prevState.degreeId === this.state.degreeId
            && prevState.sortBy === this.state.sortBy
        ) return;
        this.updatePeopleList();
    }
    onClickPrev() {
        this.setState({pageIndex: this.state.pageIndex - 1});
    }
    onClickNext() {
        this.setState({pageIndex: this.state.pageIndex + 1});
    }
    handleKeyPress(event) {
        this.setState({searchText: event.target.value, pageIndex:0});
    }
    handleDegreeChange(event) {
        this.setState({degreeId: +event.target.value, pageIndex:0});
    }
    handleSortChange(event) {
        this.setState({sortBy: event.target.value, pageIndex:0});
    }

    render() {


        let pageNext = <span className="link" onClick={this.onClickNext.bind(this)}>next</span>;
        if (this.state.pageIndex + 1 === this.state.pageCount) pageNext = "next";

        let pagePrev = <span className="link" onClick={this.onClickPrev.bind(this)}>prev</span>;
        if (this.state.pageIndex === 0) pagePrev = "prev";


        return <div>

            <div id="peopleFilters">

                <div className="item">Name Search: <input type="text" onKeyUp={this.handleKeyPress.bind(this)}></input></div>

                <div className="item">
                    Degree: <select value={this.state.degreeId} onChange={this.handleDegreeChange.bind(this)}>
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
                    Sort by: <select value={this.state.sortBy} onChange={this.handleSortChange.bind(this)}>
                    <option value="lastName">Last Name</option>
                    <option value="firstName">First Name</option>
                    <option value="lastDateDesc">Last Initiation Date (Desc)</option>
                    <option value="lastDateAsc">Last Initiation Date (Asc)</option>
                    <option value="sponsored">Sponsored Count</option>
                    <option value="officered">Officered Count</option>
                </select>
                </div>

            </div>

            <div id="resultsHeader">
                <div className="item">Records: {this.state.recordCount}</div>
                <div className="item">Page: {pagePrev} {this.state.pageIndex + 1} / {this.state.pageCount} {pageNext}</div>
            </div>

            <PeopleDisplay people={this.state.people} />
        </div>;
    }
}

function ago(date) {
    let now = new Date().getTime();
    let duration = now - date.getTime();
    let years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365));
    return `${years}yrs`;
}

function getInitiationDate(init) {
    let date = init.data.actualDate || null;
    let noActualDate = date === null;
    date = date || init.data.proposedDate || init.data.signedDate || init.data.localBodyDate;

    let actualDate = formatDate(date);
    if (noActualDate && actualDate.length > 0) actualDate = "[" + actualDate + "]";
    return actualDate;
}

class PeopleDisplay extends React.Component {

    render() {

        if (this.props.people === null || this.props.people.length === 0) return <div>loading...</div>;

        let a = [];

        this.props.people.forEach((person, i) => {

            let maxDegree = "", maxDegreeDate = "", minDegreeDate = "";

            if (person.initiations.length > 0) {
                let lastInit = person.initiations[person.initiations.length-1];
                maxDegree = lastInit.degree.name;
                maxDegreeDate = getInitiationDate(lastInit); //lastInit.data.actualDate === null ? "" : formatDate(new Date(lastInit.data.actualDate));

                let minInit = person.initiations[0];
                minDegreeDate = getInitiationDate(minInit); //minInit.data.actualDate === null ? "" : formatDate(new Date(minInit.data.actualDate));
            }




            a.push(<tr key={i}>
                <td className="colLink"><a href={"?personid=" + person.personId}>view</a></td>
                <td className="colFirst">{person.data.firstName}</td>
                <td className="colLast">{person.data.lastName}</td>
                <td className="colDegree">{maxDegree}</td>
                <td className="colMaxDate">{maxDegreeDate}</td>
                <td className="colMinDate">{minDegreeDate}</td>

                <td className="colCount">{person.initiations.length}</td>
                <td className="colCount">{person.sponsoredInitiations.length}</td>
                <td className="colCount">{person.officeredInitiations.length}</td>
            </tr>);
        });

        return <table className="peopleListTable">
            <thead><tr>

                <th></th>
                <th>First</th>
                <th>Last</th>
                <th style={{textAlign:'center'}}>°</th>
                <th>Taken</th>
                <th>Earliest</th>

                <th style={{textAlign:'center'}}>Inits</th>
                <th style={{textAlign:'center'}}>Sponsor</th>
                <th style={{textAlign:'center'}}>Officer</th>

            </tr></thead>
            <tbody>{a}</tbody>
        </table>;
    }
}