import React from 'react';

class FormSetProfile extends React.Component {

  constructor(props) {
    super(props);
    this.onProfileReset = this.onProfileReset.bind(this);
    this.onProfileSet = this.onProfileSet.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  onProfileReset (e) {
    var position = this.props.profilePosition;

    // reset the profile
    stealth.profile.reset(stealth.settings.state.whiteListedProfiles[position-1]);

    // save the new account id
    this.props.needsRefresh(true);

    // render update
    this.props.updateState({
      profiles: stealth.profile.whitelisted(),
      demo: stealth.settings.state.activeDemo
    });
  }

  onProfileSet (e) {
    var position = this.props.profilePosition;
    var selectedOption = e.target.value || undefined;

    // change demo name to 'unscripted' and update selected profile(s)
    stealth.settings.state.activeDemo = 'unscripted';
    stealth.settings.state.whiteListedProfiles[position-1] = selectedOption;

    // save the new account id
    this.props.needsRefresh(true);

    // render update
    this.props.updateState({
      profiles: stealth.profile.whitelisted(),
      demo: stealth.settings.state.activeDemo
    });
  }

  getOptions () {
    var profiles = stealth.profile.all();
    var out = [];

    // get current state if there is one
    if(stealth.settings.state.whiteListedProfiles.length >= this.props.profilePosition){
      var p = stealth.profile.get(stealth.settings.state.whiteListedProfiles[this.props.profilePosition-1]);
      var key;

      if(typeof p !== 'undefined'){
        out.push((<option key={p.id+'-selected'} value={p.id}>{p.name} (_uid: {p._uid})</option>))
      }
    }

    // add select line
    out.push((<option key="undefined" value="">-- Select Profile or Leave Blank --</option>))

    // all all options
    for (var p in profiles) {
      out.push((<option key={profiles[p].id} value={profiles[p].id}>{profiles[p].name} (_uid: {profiles[p]._uid})</option>))
    }

    return (
      out
    )
  }

  render() {
    return (
      <div>
        <select onChange={this.onProfileSet}>
          {this.getOptions()}
        </select>
        <button onClick={this.onProfileReset}>reset</button>
      </div>
    );
  }

}

export default FormSetProfile;