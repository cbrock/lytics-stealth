import React from 'react';

class PageUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileData: '',
      selectedProfile: ''
    }

    this.getOptions = this.getOptions.bind(this);
    this.handleProfileSelect = this.handleProfileSelect.bind(this);
    this.handleProfileSave = this.handleProfileSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (e) {
    this.setState({profileData: e.target.value});
  }

  handleProfileSave () {
    if (/^[\],:{}\s]*$/.test(this.state.profileData.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      // the json is valid, save the profile
      var newData = JSON.parse(this.state.profileData);

      if(newData.id === '' || typeof newData.id === 'undefined' || newData._uid === '' || typeof newData._uid === 'undefined'){
        alert('id and _uid are required for a new profile');
        return;
      }

      stealth.profile.update(this.state.selectedProfile, newData, false, function(){
        // save the new account id
        this.props.needsRefresh(true);

        // add the segment
        this.props.updateState({
          profiles: stealth.profile.all()
        });

      }.bind(this));
    }else{
      // surface error, json is invalid
      alert('JSON definition is invalid');
    }
  }

  handleProfileSelect (e) {
    var selectedOptionPayload = {},
        profiles = stealth.profile.all(),
        selectedOption = e.target.value || undefined;

    if(selectedOption === 'new'){
      selectedOptionPayload = {
        id: '',
        _uid: ''
      };
    } else {
      selectedOptionPayload = profiles[selectedOption];
    }

    this.setState({
      selectedProfile: selectedOption,
      profileData: JSON.stringify(selectedOptionPayload, undefined, 2)
    });
  }

  getOptions () {
    var out = [];

    // add default
    out.push((<option key='invalid' value=''>-- select a profile --</option>));

    // generate output
    var profiles = stealth.profile.all();
    for (var key in profiles) {
      out.push((<option key={key} value={profiles[key].id}>{profiles[key].name}</option>));
    }

    // add default
    out.push((<option key='new' value='new'>[create new profile]</option>));

    return (
      out
    )
  }

  render() {
    return (
      <div>
        <div className="settingwrapper">
          <div className="info">
            <h2>Profile Management</h2>
            <p>Altering or adding profiles can have adverse effects on scripted demos. Please only alter or add profiles if you know what you are doing.
            </p>
          </div>
          <div className="field">
            <select onChange={this.handleProfileSelect}>
              {this.getOptions()}
            </select>
          </div>
          <div className="jsonedit">
            <div className="field">
              <textarea onChange={this.handleChange} value={this.state.profileData}></textarea><br/>
              <button className="save" onClick={this.handleProfileSave}>save</button>
            </div>

            <div className="example">
              <h3>Example Profile JSON</h3>
              <div className="tab0">&#123;</div>
                <div className="tab1">"id": "jon",</div>
                <div className="tab1">"name": "Jon",</div>
                <div className="tab1">"_uid": "11111.11111111111",</div>
                <div className="tab1">"image": "jon.png",</div>
                <div className="tab1">"segments": [</div>
                  <div className="tab2">"all",</div>
                  <div className="tab2">"royalty",</div>
                  <div className="tab2">"housestark"</div>
                <div className="tab1">],</div>
                <div className="tab1">"affinities": [</div>
                  <div className="tab2">"direwolves",</div>
                  <div className="tab2">"swords"</div>
                <div className="tab1">]</div>
              <div className="tab0">&#125;</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageUser;
