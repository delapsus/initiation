import React from 'react';
import {postAjax} from './http';
import {formatDate} from './common.js';

function getPeople(state) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/data/people", {pageSize:state.pageSize, index: state.pageIndex, textSearch: state.searchText, degreeId:state.degreeId}, result => {
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
            pageSize: 40,
            pageIndex: 0,
            pageCount: 0,
            recordCount: 0,

            searchText: "",
            degreeId: 0
        };
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrev = this.onClickPrev.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleDegreeChange = this.handleDegreeChange.bind(this);
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

    render() {


        let pageNext = <span className="link" onClick={this.onClickNext}>next</span>;
        if (this.state.pageIndex + 1 === this.state.pageCount) pageNext = "next";

        let pagePrev = <span className="link" onClick={this.onClickPrev}>prev</span>;
        if (this.state.pageIndex === 0) pagePrev = "prev";


        return <div>

            <div id="peopleFilters">

                <div className="item">Name Search: <input type="text" onKeyUp={this.handleKeyPress}></input></div>

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

class PeopleDisplay extends React.Component {

    render() {

        if (this.props.people === null || this.props.people.length === 0) return <div>loading...</div>;

        let a = [];

        this.props.people.forEach((person, i) => {

            let maxDegree = "", maxDegreeDate = "", minDegreeDate = "";

            if (person.initiations.length > 0) {
                let lastInit = person.initiations[person.initiations.length-1];
                maxDegree = lastInit.degree.name;
                maxDegreeDate = lastInit.data.actualDate === null ? "" : formatDate(new Date(lastInit.data.actualDate));

                let minInit = person.initiations[0];
                minDegreeDate = minInit.data.actualDate === null ? "" : formatDate(new Date(minInit.data.actualDate));
            }


            a.push(<tr key={i}>
                <td className="colLink"><a href={"?personid=" + person.personId}>view</a></td>
                <td className="colFirst">{person.data.firstName}</td>
                <td className="colLast">{person.data.lastName}</td>
                <td className="colDegree">{maxDegree}</td>
                <td className="colMaxDate">{maxDegreeDate}</td>
                <td className="colMinDate">{minDegreeDate}</td>
            </tr>);
        });

        return <table className="peopleListTable">
            <thead>
                <th></th>
                <th>First</th>
                <th>Last</th>
                <th>°</th>
                <th>On</th>
                <th>Earliest</th>
            </thead>
            <tbody>{a}</tbody>
        </table>;
    }
}