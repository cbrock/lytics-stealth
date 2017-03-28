import React from 'react';

class ManageExternalDataSync extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSyncUrl: stealth.var.get('dataSyncUrl')
    };

    this.handleSync = this.handleSync.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (e) {
    this.setState({dataSyncUrl: e.target.value});
  }

  handleSync (e) {
    stealth.var.set('dataSyncUrl', this.state.dataSyncUrl);

    // save the new account id
    this.props.needsRefresh(true);

    // add the segment
    this.props.updateState({
      dataSyncUrl: stealth.var.get('dataSyncUrl')
    });

    alert('this functionality is not currently supported. would sync to ' + this.state.dataSyncUrl);
  }

  render() {
    return (
      <div>
        <div className="info">
          <h2>Data Sync</h2>
          <p>
            A full set of profile and demo data can be hosted and synced from a third party source. To sync data enter the url below and press "sync". Note: This will reset all custom overrides currently in place.
          </p>
        </div>
        <div className="field">
          <input type="text" onChange={this.handleChange} value={this.state.dataSyncUrl} placeholder="Enter Sync URL" /> <button onClick={this.handleSync} className="add">sync</button>
        </div>
      </div>
    );
  }

}

export default ManageExternalDataSync;