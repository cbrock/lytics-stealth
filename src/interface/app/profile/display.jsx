import React from 'react';

class ProfileDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    // update master state
    stealth.profile.activate(this.props.id, function(){
      this.props.updateState({
        segments: stealth.profile.get(stealth.settings.state.activeProfile).segments,
        affinities: stealth.profile.get(stealth.settings.state.activeProfile).affinities
      });

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        this.props.needsRefresh(false);
      }.bind(this));
    }.bind(this));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <img className={(stealth.settings.state.activeProfile === this.props.profile.id ? 'selected' : '')} src={'img/' + this.props.profile.image} alt="" />
        <p>{this.props.profile.name}</p>
      </div>
    );
  }

}

export default ProfileDisplay;
