import React from 'react';
import {render} from 'react-dom';

import * as queryString from 'query-string';
import {PersonPage} from './PersonPage.jsx';
import {PeopleSearch} from './PeopleSearch.jsx';

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

render( <Index />, document.getElementById('app') );