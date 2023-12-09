import React from 'react';
import { Component } from 'react';


class ChordTable extends Component {
    state = {
        targetchord: "C",
        targetprogression: "ordered",
        targetcomplexity: "simple",
        contents: {}
    };
    constructor(props) {
        super(props);
        this.state = {
            targetchord: props.targetchord,
            targetcomplexity: props.targetcomplexity,
            targetprogression: props.targetprogression,
            contents: { chords: [], metadata: [] }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.targetchord !== this.state.targetchord) {
            console.log("New Chord Selected: " + this.state.targetchord)
            this.getContent()
        }
        if (prevState.targetcomplexity !== this.state.targetcomplexity) {
            console.log("New Complexity Selected: " + this.state.targetcomplexity)
            this.getContent()
        }
        if (prevState.targetprogression !== this.state.targetprogression) {
            console.log("New Progression Selected: " + this.state.targetprogression)
            this.getContent()
        }


    }

    componentWillReceiveProps(newProps) {
        this.setState({ targetchord: newProps.targetchord });
        this.setState({ targetcomplexity: newProps.targetcomplexity });
        this.setState({ targetprogression: newProps.targetprogression });
        //console.log("Component Will Receive Props: "+newProps.targetchord)

    }

    getContent() {
        const headers = { 'x-api-key': process.env.REACT_APP_CHORD_QUERY };
        // "https://yhrc1nyykj.execute-api.us-east-1.amazonaws.com/prod/jazzchords?key=C&major=true"
        try {
            var url = new URL("https://yhrc1nyykj.execute-api.us-east-1.amazonaws.com/prod/jazzchords"),
                params = { key: this.state.targetchord, major: true, complexity: this.state.targetcomplexity, progression: this.state.targetprogression }
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            //console.log(url)
            fetch(
                url,
                {
                    method: 'GET',
                    headers,
                }
            )
                .then(response => response.json())
                .then(json => {
                    //console.log(json);
                    this.setState(() => {
                        return {
                            contents: json.chords
                        };
                    });
                });
        } catch (error) {
            console.log('Error: ' + error);
        }
    }

    // Lifecycle methods
    componentDidMount() {
        //console.log('ChordTable mounted');
        this.getContent()
    }

    componentWillUnmount() {
        //console.log('ChordTable unmounted');
    }

    render() {
        return (


            <table id="chordtable" className="chordtable-body">
                <thead>
                    <tr>
                        {this.state.contents.metadata.map((header, header_index) => (
                            <th key={header + header_index} className="chordtable-th">
                                {header}
                            </th>
                        )
                        )
                        }
                    </tr>
                </thead>
                <tbody>
                    {this.state.contents.chords.map((columns, index) => (
                        <tr key={columns[0]}>
                            {columns.map((column, column_index) => (
                                <td key={columns[0] + column_index}>
                                    {column}
                                </td>
                            )
                            )
                            }
                        </tr>
                    )
                    )
                    }
                </tbody>
            </table>

        );
    }
}

ChordTable.defaultProps = {
    targetchord: 'C',
    targetcomplexity: 'colors',
    targetprogression: 'ordered'
};

export default ChordTable;
