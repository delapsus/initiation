import React from 'react';
import {render} from 'react-dom';

import * as queryString from 'query-string';

class Index extends React.Component {
    constructor(props) {
        super(props);

        let parsed = queryString.parse(location.search);
        this.state = {
            page: 'people-search'
        };

        if (parsed.personid) {
            this.state.page = 'person';
            this.state.personId = +parsed.personid;
        }


    }
    render() {
        if (this.state.page === 'people-search') return <PeopleSearch />;
        else if (this.state.page === 'person') return <PersonPage personId={this.state.personId} />;
    }
}

function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(data)); // params
    return xhr;
}

function getPeople(pageSize, pageIndex, textSearch) {
    return new Promise((resolve, reject) => {
        postAjax("http://localhost:2020/people", {pageSize:pageSize, index: pageIndex, textSearch: textSearch}, result => {
            result = JSON.parse(result);
            resolve(result);
        });
    });
}

class PeopleSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            pageSize: 20,
            pageIndex: 0,
            pageCount: 0,
            searchText: ""
        };
        this.onClickNext = this.onClickNext.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }


    updatePeopleList() {
        getPeople(this.state.pageSize, this.state.pageIndex, this.state.searchText).then(result => {
            this.setState({
                people: result.people,
                pageCount: Math.ceil(result.count / this.state.pageSize)
            });

        });
    }


    componentDidMount() {
        this.updatePeopleList();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageIndex === this.state.pageIndex && prevState.searchText === this.state.searchText) return;
        this.updatePeopleList();
    }
    onClickNext() {
        this.setState({pageIndex: this.state.pageIndex + 1});
    }
    handleKeyPress(event) {
        this.setState({searchText: event.target.value});
    }

    render() {
        return <div>
            <div><input type="text" onKeyUp={this.handleKeyPress}></input></div>
            <div>Page: {this.state.pageIndex} / {this.state.pageCount} <span onClick={this.onClickNext}>next</span></div>
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

            let maxDegree = "", when = "";

            if (person.initiations.length > 0) {
                let lastInit = person.initiations[person.initiations.length-1];
                maxDegree = lastInit.degree.name;
                when = lastInit.actualDate === null ? "" : ago(new Date(lastInit.actualDate));
            }


            a.push(<tr key={i}>
                <td><a href={"?personid=" + person.personId}>view</a></td>
                <td>{person.firstName}</td>
                <td>{person.lastName}</td>
                <td>{maxDegree}</td>
                <td>{when}</td>
                </tr>);
        });

        return <table><tbody>{a}</tbody></table>;
    }
}

class PersonPage extends React.Component {
    render() {
        return <div>personId: {this.props.personId}</div>;
    }
}

render( <Index />, document.getElementById('app') );