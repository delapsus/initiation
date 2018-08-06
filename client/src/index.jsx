import React from 'react';
import {render} from 'react-dom';

import * as queryString from 'query-string';
import {PersonPage} from './PersonPage.jsx';
import {LocationPage} from './LocationPage.jsx';
import {LocationList} from './LocationList.jsx';
import {PeopleSearch} from './PeopleSearch.jsx';
import {ApplicationFirst} from "./ApplicationFirst.jsx";
import {Home} from "./Home.jsx";
import {InitiationPage} from "./InitiationPage.jsx";
import {InitiationList} from "./InitiationList.jsx";


class Index extends React.Component {
    constructor(props) {
        super(props);

        let parsed = queryString.parse(location.search);
        this.state = {
            page: 'people'
        };

        if (parsed.personid) {
            this.state.page = 'person';
            this.state.personId = +parsed.personid;
        }

        if (parsed.locationid) {
            this.state.page = 'location';
            this.state.locationId = +parsed.locationid;
        }

        if (parsed.initiationid) {
            this.state.page = 'initiation';
            this.state.initiationId = +parsed.initiationid;
        }

        if (parsed.page) {
            this.state.page = parsed.page;
        }
    }

    getPageContent() {
        if (this.state.page === 'people') return <PeopleSearch />;

        else if (this.state.page === 'person') return <PersonPage personId={this.state.personId} />;
        else if (this.state.page === 'location') return <LocationPage locationId={this.state.locationId} />;
        else if (this.state.page === 'locations') return <LocationList />;
        else if (this.state.page === 'initiations') return <InitiationList />;
        else if (this.state.page === 'initiation') return <InitiationPage initiationId={this.state.initiationId}/>;
        else if (this.state.page === 'application') return <ApplicationFirst />;
        else return <Home />;
    }

    render() {
        let content = this.getPageContent();

        return <div>
            <div id="menuHeader">O.T.O. USGL Initiation Database | <a href="index.html?page=people">People</a> | <a href="index.html?page=locations">Locations</a> | <a href="index.html?page=initiations">Initiations</a> | <a href="index.html?page=application">New Application</a></div>
            {content}
        </div>
    }
}

render( <Index />, document.getElementById('app') );