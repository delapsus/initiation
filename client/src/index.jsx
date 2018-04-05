import React from 'react';
import {render} from 'react-dom';

import * as queryString from 'query-string';
import {PersonPage} from './PersonPage.jsx';
import {LocationPage} from './LocationPage.jsx';
import {LocationList} from './LocationList.jsx';
import {PeopleSearch} from './PeopleSearch.jsx';
import {PersonSelect} from './PersonSelect.jsx';
import {ApplicationFirst} from "./ApplicationFirst.jsx";
import {Home} from "./Home.jsx";


class Index extends React.Component {
    constructor(props) {
        super(props);

        let parsed = queryString.parse(location.search);
        this.state = {
            //page: 'people-search'
            page: 'home'
        };

        if (parsed.personid) {
            this.state.page = 'person';
            this.state.personId = +parsed.personid;
        }

        if (parsed.locationid) {
            this.state.page = 'location';
            this.state.locationId = +parsed.locationid;
        }

        if (parsed.page) {
            this.state.page = parsed.page;
        }
    }
    render() {
        if (this.state.page === 'people') return <PeopleSearch />;
        if (this.state.page === 'person-select') return <PersonSelect />;
        else if (this.state.page === 'person') return <PersonPage personId={this.state.personId} />;
        else if (this.state.page === 'location') return <LocationPage locationId={this.state.locationId} />;
        else if (this.state.page === 'locations') return <LocationList />;
        else if (this.state.page === 'application') return <ApplicationFirst />;
        else return <Home />;
    }
}

render( <Index />, document.getElementById('app') );