import React from 'react';

class AlertRefresh extends React.Component {

  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  handleRefresh() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
      this.props.needsRefresh(false);
    }.bind(this));
  }

  render() {
    return (
      <section className={"alert " + (this.props.state.needsRefresh ? 'active' : '')}>
        <p>Settings have changed. Please refresh for changes to take effect.</p>
        <button onClick={this.handleRefresh}>Refresh Page</button>
      </section>
    );
  }

}

export default AlertRefresh;