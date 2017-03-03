import React from 'react';
import FormSetProfile from '../form/setprofile.jsx';
import FormSetAccountId from '../form/setaccountid.jsx';

class PageAdvancedSettings extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <section className="settings">
          <div className="advanced">
            <FormSetAccountId updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></FormSetAccountId>
            <h1>User Profile(s)</h1>
            <FormSetProfile profilePosition="1" updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></FormSetProfile>
            <FormSetProfile profilePosition="2" updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></FormSetProfile>
            <FormSetProfile profilePosition="3" updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></FormSetProfile>
          </div>
        </section>
      </div>
    );
  }

}

export default PageAdvancedSettings;
