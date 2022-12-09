import React, { Component } from 'react';

import Badge from 'react-bootstrap/Badge';

import Table from 'react-bootstrap/Table';
import ReactAutocomplete from 'react-autocomplete';
import './App.css';
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class App extends Component {

  state = {
    allstatesdata: [],
    statesdata: [],
    inputString: '',
    cases_time_series: [],
    activeData: [],
    flag: false
  };


  componentDidMount() {
    document.body.style.backgroundColor = "#000000"

    fetch('https://covid19mydata.s3.amazonaws.com/state_district.json')
      .then(res => res.json())
      .then((data) => {
        this.setState({ allstatesdata: data })
        this.setState({ statesdata: data.filter(d => d.statecode === this.state.inputString.toUpperCase()) })
      })
      .catch(console.log)  
      fetch('https://covid19mydata.s3.amazonaws.com/data.json')
        .then(res => res.json())
        .then((data) =>
         this.setState({ cases_time_series: data.cases_time_series })
        )
        .catch(console.log)
  }

  handleChange(value) {
    console.log("handle Change" , value);
    this.setState({
      inputString: value
    });
    this.componentDidMount();
  }

  getActiveData = () => {
    if (this.state.inputString == '') {    
      return this.state.cases_time_series.map(item => {
        return { label: item.date, y: parseInt(item.dailyconfirmed, 10) }
      })
    }
  }
  getRecoveredData = () => {
    if (this.state.inputString == '') {
      return this.state.cases_time_series.map(item => {
        return { label: item.date, y: parseInt(item.dailyrecovered, 10) }
      })
    }
  }
  getDeceasedData = () => {
    if (this.state.inputString == '') {
      return this.state.cases_time_series.map(item => {
        return { label: item.date, y: parseInt(item.dailydeceased, 10) }
      })
    }
  }

  render() {
    const options = {
      title:{
        text: "India"
      },
      theme: "dark1",
      animationEnabled: true,
      height: 100,
      width: 350,
      axisY: {
        title: "Cases",
        includeZero: false
      },
      data: [{
        type: "spline",
        dataPoints: this.getActiveData(),
        lineColor: "blue"
      }, {
        type: "spline",
        dataPoints: this.getRecoveredData(),
        lineColor: "green"
      }, {
        type: "spline",
        dataPoints: this.getDeceasedData(),
        lineColor: "red"
      }]
    };
    return (


      <div class="container-fluid">
        <br/>
        <center>

          <Table striped bordered hover size="sm" variant="dark">
            <thead><tr><th colSpan="4"><img src={require('./virus.png')} class="App-logo" alt="virus"></img>India</th></tr></thead>
            <thead>
              <tr>
                <th>Confirmed</th>
                <th>Active</th>
                <th>Recovered</th>
                <th>Deceased</th>

              </tr>
            </thead>

            <tbody>
              <td> <h4><Badge variant="dark">{this.state.allstatesdata.reduce((total, st) =>
                total + st.districtData.reduce((total1, d) => total1 + d.confirmed, 0), 0)}</Badge></h4></td>
              <td><h4><Badge variant="dark">{this.state.allstatesdata.reduce((total, st) =>
                total + st.districtData.reduce((total1, d) => total1 + d.active, 0), 0)}</Badge><br /> <Badge variant="light">{this.state.allstatesdata.reduce((total, st) =>
                  total + st.districtData.reduce((total1, d) => total1 + d.delta.confirmed, 0), 0)}</Badge></h4></td>
              <td><h4><Badge variant="dark">{this.state.allstatesdata.reduce((total, st) =>
                total + st.districtData.reduce((total1, d) => total1 + d.recovered, 0), 0)} </Badge><br /><Badge variant="light">{this.state.allstatesdata.reduce((total, st) =>
                  total + st.districtData.reduce((total1, d) => total1 + d.delta.recovered, 0), 0)}</Badge></h4></td>
              <td><h4><Badge variant="dark">{this.state.allstatesdata.reduce((total, st) =>
                total + st.districtData.reduce((total1, d) => total1 + d.deceased, 0), 0)}</Badge><br /> <Badge variant="light">{this.state.allstatesdata.reduce((total, st) =>
                  total + st.districtData.reduce((total1, d) => total1 + d.delta.deceased, 0), 0)}</Badge></h4></td>

            </tbody>
          </Table>
          <div >
          {this.state.inputString == ''?
          <CanvasJSChart options={options} onRef={ref => this.chart = ref} 
          />: '' }
        </div>
          <b class="whiteColor">Input State Name/Abbr:</b>
          <ReactAutocomplete
            getItemValue={(item) => item.label}
            shouldItemRender={(item, value) => item.label.toLowerCase().startsWith(value.toLowerCase())}

            items={[
              { label: 'AP', name: "Andhra Pradesh" }, { label: 'AR', name: "Arunachal Pradesh" },
              { label: 'AS', name: "Assam" }, { label: 'BR', name: "Bihar" }, { label: 'CT', name: "Chhattisgarh" },
              { label: 'GA', name: "Goa" }, { label: 'GJ', name: "Gujarat" }, { label: 'HR', name: "Haryana" },
              { label: 'HP', name: "Himachal Pradesh" }, { label: 'JK', name: "Jammu and Kashmir" },
              { label: 'JH', name: "Jharkhand" }, { label: 'KA', name: "Karnataka" }, { label: 'KL', name: "Kerla" },
              { label: 'MP', name: "Madhya Pradesh" }, { label: 'MH', name: "Maharastra" },
              { label: 'MN', name: "Manipur" }, { label: 'ML', name: "Meghalaya" }, { label: 'MZ', name: "Mizoram" },
              { label: 'NL', name: "Nagaland" }, { label: 'OR', name: "Orissa" },
              { label: 'PB', name: "Punjab" }, { label: 'RJ', name: "Rajasthan" }, { label: 'SK', name: "Sikkim" },
              { label: 'TN', name: "TamilNadu" }, { label: 'TG', name: "Telangana" },
              { label: 'TR', name: "Tripura" }, { label: 'UP', name: "Uttar Pradesh" }, { label: 'UT', name: "Uttarakhand" },
              { label: 'WB', name: 'West Bengal' }, { label: 'AN', name: 'Andaman and Nicobar' },
              { label: 'CH', name: 'Chandigarh' }, { label: 'DD', name: 'Diu and Daman' }, { label: 'DL', name: 'Delhi' },
              { label: 'LA', name: 'Ladakh' },
              { label: 'LD', name: 'Lakshadweep' }, { label: 'PY', name: 'Puducherry' }

            ]}
            renderItem={(item, highlighted) =>
              <div
                key={item.id}
                style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
              >
                {item.name}
              </div>
            }
            value={this.state.inputString}
            onChange={e => this.handleChange(e.target.value)}
            onSelect={(val) => this.handleChange(val)}
          />
        </center>
        <br />
        

        {
          this.state.statesdata.map((state =>
            <div>
              <h4>
                <div class="whiteColor">{state.state}-{state.statecode}</div> <br /> <small>
                  <Badge variant="dark">Confirmed - {state.districtData.reduce((total, d) => total + d.confirmed, 0)}</Badge> </small><small>
                  <Badge variant="dark">Active - {state.districtData.reduce((total, d) => total + d.active, 0)} <Badge variant="light">{state.districtData.reduce((total, d) => total + d.delta.confirmed, 0)}</Badge></Badge> </small><small>
                  <Badge variant="dark">Recovered - {state.districtData.reduce((total, d) => total + d.recovered, 0)} <Badge variant="light">{state.districtData.reduce((total, d) => total + d.delta.recovered, 0)}</Badge></Badge> </small><small>
                  <Badge variant="dark">Deceased - {state.districtData.reduce((total, d) => total + d.deceased, 0)} <Badge variant="light">{state.districtData.reduce((total, d) => total + d.delta.deceased, 0)}</Badge></Badge>
                </small> </h4>
              <div class="table-responsive-sm">
                <Table striped bordered hover size="sm" variant="dark">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Current</th>
                      <th>Recovered</th>
                      <th>Deceased</th>
                      <th>Confirmed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.districtData
                      .sort((a, b) => b.active - a.active)
                      .map(d =>

                        <tr>
                          <td><b>{d.district}</b></td>
                          <td >{d.active} <span class="activeClass">({d.delta.confirmed})</span></td>
                          <td >{d.recovered}  <span class="recoveredClass">({d.delta.recovered})</span></td>
                          <td >{d.deceased} <span class="deceasedClass">({d.delta.deceased})</span></td>
                          <td >{d.confirmed}</td>
                        </tr>



                      )}
                  </tbody>
                </Table>
              </div>


            </div>

          ))
        }
      </div>

    );
  }
}

export default App;
