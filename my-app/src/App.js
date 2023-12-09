import React, { Component } from 'react';
import Select from 'react-select'
import logo from './logo.svg';
import './App.css';
import './components/ChordTable/_chordtable.css';

import ChordTable from './components/ChordTable'

const complexity = [
  { value: "colors", label: 'Colors' },
  { value: "simple", label: 'Simple' },
  { value: "medium", label: 'Medium' },
  { value: "complex", label: 'Complex' },
  { value: "drop2", label: 'Drop 2' }
]

const defaultKey = { label: "C", value: "C" }
const defaultProgression = { value: "ordered", label: 'ordered' } 

class App extends Component {
  state = {
    targetchord: "C",
    targetprogression: "ordered",
    chords: [ { value: "D", label: 'D' } ],
    majorProgressions: [ { value: "ordered", label: 'ordered' } ]
  }
  getChords() {
    const headers = { 'x-api-key': process.env.REACT_APP_CHORD_QUERY };
    try {
        fetch(
            "https://yhrc1nyykj.execute-api.us-east-1.amazonaws.com/prod/piano",
            {
                method: 'GET',
                headers,
            }
        )
            .then(response => response.json())
            .then(json => {
                
                this.setState(() => {
                    //console.log(json.chords);
                    return {
                        chords: json.chords,
                        majorProgressions: json.majorProgressions
                    };
                });
            });
    } catch (error) {
        console.log('Error: ' + error);
    }
}
  componentDidMount() {
    console.log("Starting...")
    this.getChords()
  }
  handleChordChange = (selectedOption) => {
    console.log("New Chord: "+selectedOption.value)
    this.setState({ targetchord: selectedOption.value });
  }
  handleComplexityChange = (selectedOption) => {
    console.log("New Complexity: "+selectedOption.value)
    this.setState({ targetcomplexity: selectedOption.value });
  }
  handleProgressionChange = (selectedOption) => {
    console.log("New Progression: "+selectedOption.value)
    this.setState({ targetprogression: selectedOption.value });
  }
  render() {

    return ( 
            <div>
            <Select options={this.state.chords} onChange={this.handleChordChange} defaultValue={defaultKey}/>
            <Select options={complexity} onChange={this.handleComplexityChange} defaultValue={complexity[0]}/>
            <Select options={this.state.majorProgressions} onChange={this.handleProgressionChange} defaultValue={defaultProgression}/>
            <ChordTable targetchord={this.state.targetchord} targetcomplexity={this.state.targetcomplexity} targetprogression={this.state.targetprogression}/>
            </div>
    );
  }
}

export default App;
