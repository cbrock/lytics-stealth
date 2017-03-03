import React from 'react';

class NavPower extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    // if its checked turn the power on and save settings
    // if its not checked turn the power off and save settings
    if(this.refs.power.checked){
      stealth.settings.state.enabled = true
    }else{
      stealth.settings.state.enabled = false;
    }

    stealth.save.settings(function(){
      this.props.updateState({enabled: stealth.settings.state.enabled});

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        this.props.needsRefresh(false);
      }.bind(this));
    }.bind(this))
  }

  render() {
    return (
      <div>
        <input type="checkbox" ref="power" defaultChecked={this.props.state.enabled} onChange={this.handleChange} />
        <label data-on="ON" data-off="OFF" />
      </div>
    );
  }

}

export default NavPower;