import React from 'react';

class ManageDomainWhitelist extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      whiteListValue: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.displayCurrentWhitelist = this.displayCurrentWhitelist.bind(this);
  }

  handleAdd () {
    stealth.domain.add(this.state.whiteListValue, function(){
      // save the new account id
      this.props.needsRefresh(true);

      // add the segment
      this.props.updateState({
        whitelistedDomains: stealth.settings.state.whiteListedDomains
      });
    }.bind(this));
  }

  handleChange (e) {
    this.setState({whiteListValue: e.target.value});
  }

  handleRemove (e) {
    var url = e.target.attributes.getNamedItem('data-url').value;

    stealth.domain.remove(url, function(){
      // save the new account id
      this.props.needsRefresh(true);

      // add the segment
      this.props.updateState({
        whitelistedDomains: stealth.settings.state.whiteListedDomains
      });
    }.bind(this));
  }

  displayCurrentWhitelist () {
    var out = [];

    // generate output
    var domains = this.props.state.whitelistedDomains;
    for (var i = 0; i < domains.length; i++) {
      out.push( (<li key={i}><span>{domains[i]} <button data-url={domains[i]} onClick={this.handleRemove}>remove</button></span></li>) );
    }

    return (
      out
    )
  }

  render() {
    return (
      <div>
        <div className="info">
          <h2>Whitelisted Domains</h2>
          <p>All domains must be whitelisted before Stealth can be used on them. This prevents accidental data corruption or cross account contamination while the plugin is running.
          </p>
        </div>
        <div className="field">
          <input type="text" onChange={this.handleChange} placeholder="Enter Domain"/>
          <button className="add" onClick={this.handleAdd}>add</button>
        </div>
        <ul className="whitelist">
          {this.displayCurrentWhitelist()}
        </ul>
      </div>
    );
  }

}

export default ManageDomainWhitelist;
