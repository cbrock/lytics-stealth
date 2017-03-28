import React from 'react';

class PageDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      demoData: '',
      selectedDemo: ''
    }

    this.getOptions = this.getOptions.bind(this);
    this.handleDemoSelect = this.handleDemoSelect.bind(this);
    this.handleDemoSave = this.handleDemoSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (e) {
    this.setState({demoData: e.target.value});
  }

  handleDemoSave () {
    if (/^[\],:{}\s]*$/.test(this.state.demoData.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      // the json is valid, save the demo
      var newData = JSON.parse(this.state.demoData);

      if(newData.id === '' || typeof newData.id === 'undefined' || newData.name === '' || typeof newData.name === 'undefined'){
        alert('id and name are required for a demo');
        return;
      }

      stealth.demo.update(this.state.selectedDemo, newData, false, function(){
        // save the new account id
        this.props.needsRefresh(true);

        // add the segment
        this.props.updateState({
          demos: stealth.demo.all()
        });

      }.bind(this));
    }else{
      // surface error, json is invalid
      alert('JSON definition is invalid');
    }
  }

  handleDemoSelect (e) {
    var demos = stealth.demo.all();
    var selectedOption = e.target.value || undefined;
    var selectedOptionPayload = {};

    if(selectedOption === 'new'){
      selectedOptionPayload = {
        id: '',
        name: '',
        account: ''
      };
    } else {
      selectedOptionPayload = demos[selectedOption];
    }

    this.setState({
      selectedDemo: selectedOption,
      demoData: JSON.stringify(selectedOptionPayload, undefined, 2)
    });
  }

  getOptions () {
    var out = [];

    // add default
    out.push((<option key='invalid' value=''>-- select a demo --</option>));

    // generate output
    var demos = stealth.demo.all();
    for (var key in demos) {
      out.push((<option key={key} value={demos[key].id}>{demos[key].name}</option>));
    }

    // add default
    out.push((<option key='new' value='new'>[create new demo]</option>));

    return (
      out
    )
  }

  render() {
    return (
      <div>
        <div className="settingwrapper">
          <div className="info">
            <h2>Demo Management</h2>
            <p>Altering or adding demos can have adverse effects on scripted demos. Please only alter or add demos if you know what you are doing.
            </p>
          </div>
          <div className="field">
            <select onChange={this.handleDemoSelect}>
              {this.getOptions()}
            </select>
          </div>
          <div className="jsonedit">
            <div className="field">
              <textarea onChange={this.handleChange} value={this.state.demoData}></textarea><br/>
              <button className="save" onClick={this.handleDemoSave}>save</button>
            </div>

            <div className="example">
              <h3>Example Demo JSON</h3>
              <div className="tab0">&#123;</div>
                <div className="tab1">"id": "basic_demo",</div>
                <div className="tab1">"account": "11235123adgadg2351ad",</div>
                <div className="tab1">"name": "Basic Demo",</div>
                <div className="tab1">"documentation": "http://documentationurl.com",</div>
                <div className="tab1">"url": "http://ecom.lyticsdemo.com",</div>
                <div className="tab1">"description": "Detailed description of demo.",</div>
                <div className="tab1">"whiteListedProfiles": [</div>
                  <div className="tab2">"default",</div>
                  <div className="tab2">"james"</div>
                <div className="tab1">],</div>
                <div className="tab1">"supportingTabs": [</div>
                  <div className="tab2">"http://openthis.com",</div>
                  <div className="tab2">"http://andthis.com",</div>
                  <div className="tab2">"http://andalsothis.com"</div>
                <div className="tab1">]</div>
              <div className="tab0">&#125;</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PageDemo;
