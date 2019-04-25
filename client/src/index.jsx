import React from 'react';
import {render} from 'react-dom';

import * as queryString from 'query-string';
import {PersonPage} from './PersonPage.jsx';
import {LocationPage} from './LocationPage.jsx';
import {LocationList} from './LocationList.jsx';
import {PeopleSearch} from './PeopleSearch.jsx';
import {ApplicationForm} from "./ApplicationForm.jsx";
import {Home} from "./Home.jsx";
import {InitiationPage} from "./InitiationPage.jsx";
import {InitiationList} from "./InitiationList.jsx";
import {EditPerson} from "./EditPerson.jsx";
import {EditLocation} from "./EditLocation.jsx";
import {EditInitiation} from "./EditInitiation.jsx";
import {InitiationReportForm} from "./InitiationReportForm.jsx";
import {Reports} from "./Reports.jsx";


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
        else if (this.state.page === 'edit-person') return <EditPerson personId={this.state.personId} />;

        else if (this.state.page === 'locations') return <LocationList />;
        else if (this.state.page === 'location') return <LocationPage locationId={this.state.locationId} />;
        else if (this.state.page === 'edit-location') return <EditLocation locationId={this.state.locationId} />;

        else if (this.state.page === 'initiations') return <InitiationList />;
        else if (this.state.page === 'initiation') return <InitiationPage initiationId={this.state.initiationId}/>;
        else if (this.state.page === 'edit-initiation') return <EditInitiation initiationId={this.state.initiationId}/>;

        else if (this.state.page === 'application') return <ApplicationForm />;
        else if (this.state.page === 'report-form') return <InitiationReportForm />;

        else if (this.state.page === 'reports') return <Reports />;

        else return <Home />;
    }

    render() {
        let content = this.getPageContent();

        return <div>
            <div id="menuHeader"><img src="icon.png" className="icon" /> O.T.O. USGL Initiation Database | <a href="index.html?page=people">People</a> | <a href="index.html?page=locations">Locations</a> | <a href="index.html?page=initiations">Initiations</a> | <a href="index.html?page=application">New Application</a> | <a href="index.html?page=report-form">Initiation Report</a> | <a href="index.html?page=reports">Reports</a></div>
            {content}
        </div>
    }
}

render( <Index />, document.getElementById('app') );