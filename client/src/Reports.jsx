import React from 'react';

export class Reports extends React.Component {

    constructor(props) {
        super(props);

        let d = new Date();
        this.state = {
            year: d.getFullYear()
        };
    }

    onGenerate() {
        window.location.href = `/report/annual?year=${this.state.year.toString()}`;
    }

    onChangeYear(event) {
        this.setState({year: +event.target.value});
    }

    render() {

        let d = new Date();
        let years = [];
        for (let i = d.getFullYear(); i >= 1970; i--) {
            years.push(<option value={i} key={i}>{i.toString()}</option>);
        }

        return <div>
            <div>Reports:</div>
            <div>Annual Report Data: <select value={this.state.year} onChange={this.onChangeYear.bind(this)}>{years}</select> <button onClick={this.onGenerate.bind(this)}>Generate</button></div>
        </div>;
    }
}
