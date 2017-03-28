import React from 'react';

import ManageDomainWhitelist from '../form/manageDomainWhitelist.jsx';
import ManageVariableMapping from '../form/manageVariableMapping.jsx';
import ManageExternalDataSync from '../form/manageExternalDataSync.jsx';

class PageGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.handleMapUpdate = this.handleMapUpdate.bind(this);
    this.handleDataSync = this.handleDataSync.bind(this);
  }

  handleMapUpdate () {
    var field = '';
    var value = '';

    alert('update', field, value);
  }

  handleDataSync () {
    var url = '';
    alert('sync', url);
  }

  render() {
    return (
      <div>
        <div className="settingwrapper">
          <ManageDomainWhitelist updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></ManageDomainWhitelist>
        </div>

        <div className="settingwrapper">
          <ManageVariableMapping updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></ManageVariableMapping>
        </div>

        <div className="settingwrapper">
          <ManageExternalDataSync updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></ManageExternalDataSync>
        </div>
      </div>
    );
  }
}

export default PageGeneral;
