import React from 'react';
import {render} from 'react-dom';

class Index extends React.Component {
    render() {
        return <div>test</div>;
    }
}

render( <Index />, document.getElementById('app') );

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

postAjax("http://localhost:2020/people", {test:true}, result => {
    result = JSON.parse(result);
    console.log(result.length);
    render( <People people={result} />, document.getElementById('app') );
});

class People extends React.Component {
    render() {

        let a = [];

        this.props.people.forEach(person => {
            a.push(<div>{person.firstName} {person.lastName}</div>);
        });

        return <div>{a}</div>;
    }
}