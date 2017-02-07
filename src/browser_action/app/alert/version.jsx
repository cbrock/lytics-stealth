import React from 'react';

class AlertVersion extends React.Component {

  constructor(props) {
    super(props);
    this.handleFlush = this.handleFlush.bind(this);

    var hasNewVersion;
    hasNewVersion = false;
    if(stealth.settings.state.version !== chrome.runtime.getManifest().version){
      hasNewVersion = true;
    }

    this.state = {
      newVersion: hasNewVersion
    }
  }

  handleFlush() {
    alert('bonk');

    // update profiles
    // update demos
    // reset current demo

    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    //   this.props.needsRefresh(false);
    // }.bind(this));
  }

  render() {
    return (
      <section className={"red alert " + (this.state.newVersion ? 'active' : '')}>
        <p>There is a new version of Stealth available.</p>
        <button onClick={this.handleFlush}>Update Now</button>
      </section>
    );
  }

}

export default AlertVersion;