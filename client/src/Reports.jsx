import React from 'react';
import {getDegreeById, getDegreeByName, allDegrees} from './degree';

export class Reports extends React.Component {

    constructor(props) {
        super(props);

        let d = new Date();
        this.state = {
            year: d.getFullYear(),

            minDegreeId: 6,
            maxDegreeId: 14,
            minYears: 3,
            maxYears: 15
        };
    }

    onGenerateYearly() {
        window.location.href = `/report/annual?year=${this.state.year.toString()}`;
    }
    onChangeYear(event) {
        this.setState({year: +event.target.value});
    }

    onGenerateWaitingForInitiation() {

        let qs = [
            `minDegreeId=${this.state.minDegreeId.toString()}`,
            `maxDegreeId=${this.state.maxDegreeId.toString()}`,
            `minYears=${this.state.minYears.toString()}`,
            `maxYears=${this.state.maxYears.toString()}`
        ];

        window.location.href = `/report/waiting?${qs.join('&')}`;
    }
    onChangeYearMin(event) {
        this.setState({minYears: +event.target.value});
    }
    onChangeYearMax(event) {
        this.setState({maxYears: +event.target.value});
    }

    render() {

        let d = new Date();
        let years = [];
        for (let i = d.getFullYear(); i >= 1970; i--) {
            years.push(<option value={i} key={i}>{i.toString()}</option>);
        }

        let minDegrees = [], maxDegrees = [];
        allDegrees.forEach((degree, i) => {
            minDegrees.push(<option value={degree.degreeId} key={i}>{degree.name}</option>);
            maxDegrees.push(<option value={degree.degreeId} key={i}>{degree.name}</option>);
        });

        return <div>
            <div>Reports:</div>
            <hr/>
            <div>
                <div className='reportTitle'>Annual Report Data:</div>
                <div className='reportSub'>Year: <select value={this.state.year} onChange={this.onChangeYear.bind(this)}>{years}</select></div>
                <div className='reportSub'><button onClick={this.onGenerateYearly.bind(this)}>Generate</button></div>
            </div>
            <hr/>
            <div>
                <div className='reportTitle'>Waiting for Initiation:</div>
                <div className='reportSub'>Min Degree: <select value={this.state.minDegreeId} onChange={this.onChangeYear.bind(this)}>{minDegrees}</select></div>
                <div className='reportSub'>Max Degree: <select value={this.state.maxDegreeId} onChange={this.onChangeYear.bind(this)}>{maxDegrees}</select></div>

                <div className='reportSub'>Min Years: <input className="year" type='text' value={this.state.minYears} onChange={this.onChangeYearMin.bind(this)} /></div>
                <div className='reportSub'>Max Years: <input className="year" type='text' value={this.state.maxYears} onChange={this.onChangeYearMax.bind(this)} /></div>

                <div className='reportSub'><button onClick={this.onGenerateWaitingForInitiation.bind(this)}>Generate</button></div>
            </div>

        </div>;
    }
}
