import React from 'react';
import Profile from './display.jsx';

class ProfileWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.eachProfile = this.eachProfile.bind(this);
  }

  eachProfile (profile) {
    return (
      <Profile key={profile.id} id={profile.id} needsRefresh={this.props.needsRefresh} updateState={this.props.updateState} profile={profile}></Profile>
    )
  }

  render() {
    return (
      <div className="personas">
        {this.props.state.profiles.map(this.eachProfile)}
      </div>
    );
  }

}

export default ProfileWrapper;