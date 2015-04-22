(function() {
    
    'use strict';

    /**
    * Wrapps an <input>. Should trigger an search on enter, and display suggestions when state changes.
    */
    var SearchInputComponent = React.createClass({
        getInitialState : function() {
            return {
                val : '',
                source  : [],
                matches : [],
                showResults: false,
                showSuggestions: false
            };
        },
        componentDidMount: function() {
            $.ajax({ url: this.props.source, dataType: 'json',
              success: function(data) {
                this.setState({source: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
        },
        inputChanged : function(e) {
            this.setState({ 
                // Find matches by <input> value from our source.
                matches : this.state.source.filter(function(d) { return d[this.props.searchField].indexOf( e.target.value.toUpperCase() )>=0 ? true : false; }.bind(this)),
                val     : e.target.value
            });
        },
        keyUp : function(e) {
            // Enter key.
            if (e.keyCode == 13) {
                this.setState({ showResults: true, showSuggestions: false });
            } 
            else if(this.state.val.length > 0) {
                this.setState({ showResults: false, showSuggestions: true });
            }
            else {
                this.setState({ showResults: false, showSuggestions: false });
            }
        },
        render : function() {
            return (
                <div>
                    <input onKeyUp={this.keyUp} onChange={this.inputChanged} val={this.state.val} type='text' /> 
                    { this.state.showSuggestions ? <DisplaySuggestionsComponent results={this.state.matches} displayField={this.props.searchField} /> : null }
                    { this.state.showResults     ? <DisplayResultComponent results={this.state.matches} /> : null }
                </div>
            );
        }
    });
    
    /**
    * Renders suggestions, 
    */
    var DisplaySuggestionsComponent = React.createClass({
        render : function() {
            return (
                <ul>
                    {this.props.results.map(function(result, i) {
                        return <li key={i}>{result[this.props.displayField]}</li>
                    }.bind(this))}
                </ul>
            );
        }
    });
    
    /**
    * Component that displays search-results, after search is complete.
    * Should show the regnumber/brand/model and color of a car.
    */
    var DisplayResultComponent = React.createClass({
        render : function() {
            return (
                <table>
                    <tbody>
                        {this.props.results.map(function(result, i) {
                            return <ObjectRow obj={result} key={i} />
                        })}
                    </tbody>
                </table>
            );
        }
    });
    
    /**
    * Component that render a table <tr> from associative array.
    */
    var ObjectRow = React.createClass({
        render : function() {
            var cols = Array();
            for (var key in this.props.obj) {
                cols.push(<td>{this.props.obj[key]}</td>);
            }
            return <tr>{cols}</tr>;
        }
    });

    React.render(
        <SearchInputComponent source="data/movies.json" searchField="title" />,
        document.getElementById('app')
    );
    
})();
