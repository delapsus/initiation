import React from 'react';
import {render} from 'react-dom';

class Index extends React.Component {
    render() {
        return <div>test</div>;
    }
}

render( <Index />, document.getElementById('app') );