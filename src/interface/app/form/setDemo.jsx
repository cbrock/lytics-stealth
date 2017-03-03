import React from 'react';

class FormSetDemo extends React.Component {

  constructor(props) {
    super(props);
    this.onDemoSet = this.onDemoSet.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  onDemoSet (e) {
    var selectedOption = e.target.value || undefined;

    // change demo name to 'unscripted' and update selected profile(s)
    stealth.settings.state.activeDemo = selectedOption;
    stealth.demo.activate(stealth.settings.state.activeDemo);

    // save the new account id
    this.props.needsRefresh(true);

    // render update
    this.props.updateState({
      demo: stealth.demo.get(stealth.settings.state.activeDemo),
      account: stealth.settings.state.account,
      profiles: stealth.profile.whitelisted(),
      segments: stealth.profile.get(stealth.settings.state.activeProfile).segments,
      affinities: stealth.profile.get(stealth.settings.state.activeProfile).affinities
    });
  }

  getOptions () {
    var demos = stealth.defaults.demos;
    var out = [];

    // get current state is there is one
    if(stealth.settings.state.activeDemo){
      // get the demo details
      var d = stealth.demo.get(stealth.settings.state.activeDemo);
      out.push((<option key={d.id+'-selected'} value={d.id}>{d.name}</option>))
    }

    // all all options
    for (var d in demos) {
      out.push((<option key={demos[d].id} value={demos[d].id}>{demos[d].name}</option>))
    }

    return (
      out
    )
  }

  render() {
    return (
      <div>
        <select name="settings-demo" id="settings-demo" onChange={this.onDemoSet}>
          {this.getOptions()}
        </select>
      </div>
    );
  }

}

export default FormSetDemo;