import React from 'react';
import FormSetDemo from '../form/setdemo.jsx';

class PageBasicSettings extends React.Component {

  constructor(props) {
    super(props);
    this.handleAdvancedSettingsClick = this.handleAdvancedSettingsClick.bind(this);
    this.goToDocs = this.goToDocs.bind(this);
    this.goToDemoSite = this.goToDemoSite.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.openAssets = this.openAssets.bind(this);
    this.handleOptionsClick = this.handleOptionsClick.bind(this);
  }

  goToDocs () {
    window.open(this.props.state.demo.documentation, '_blank');
  }

  goToDemoSite () {
    window.open(this.props.state.demo.url, '_blank');
  }

  openAssets () {
    console.log(this.props.state.demo.supportingTabs);
    for (var i = 0; i < this.props.state.demo.supportingTabs.length; i++) {
      window.open(this.props.state.demo.supportingTabs[i], '_blank');
    }
  }

  handleReset () {
    stealth.demo.reset(this.props.state.demo.id);
    this.props.needsRefresh(true);
    this.props.updateState({
      demo: stealth.demo.get(stealth.settings.state.activeDemo)
    });
  }

  handleOptionsClick () {
    chrome.tabs.create({'url': "/settings.html" } );
  }

  handleAdvancedSettingsClick () {
    this.props.updateState({currentPage: 'advancedsettings'});
  }

  render() {
    return (
      <section className="settings">
        <div className="basic">
          <h1>Basic Settings <span><a href="#" onClick={this.handleOptionsClick}>advanced</a></span><span><a href="#" onClick={this.handleAdvancedSettingsClick}>profiles</a></span><span><a href="#" onClick={this.handleAdvancedSettingsClick}>account</a></span></h1>
          <div>
            <div className="value">
              <FormSetDemo updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></FormSetDemo>
            </div>
          </div>
          <div className="detail">
            <div>
              <div className="key">Name</div>
              <div className="value">{this.props.state.demo.name}</div>
            </div>
            <div className={(this.props.state.demo.id == 'unscripted' ? 'hide' : '')}>
            <div className="key">Toolkit</div>
            <div className="value">
              <button onClick={this.goToDocs}>Documentation</button>
              <button onClick={this.goToDemoSite}>Demo Site</button>
              <button onClick={this.openAssets}>Open Assets</button>
            </div>
          </div>
          <div>
            <div className="key">Description</div>
            <div className="value">
              {this.props.state.demo.description}
            </div>
          </div>
        </div>
        <div className="reset">
          <button className="red" onClick={this.handleReset}>Reset Demo</button>
        </div>
      </div>
      <div className="health">
        <h1>System Health</h1>
          <div>
            <h2>Data Collection (jstag)</h2>
            <span>Version <strong>2.0.0</strong></span>
            <span>Proxied <strong>True</strong></span>
          </div>
          <div>
            <h2>Personalization (lio)</h2>
            <span>Proxied <strong>True</strong></span>
          </div>
          <div>
            <h2>Pathfora</h2>
            <span>Version <strong>2.0.0</strong></span>
            <span>Proxied <strong>True</strong></span>
          </div>
        </div>
      </section>
    );
  }

}

export default PageBasicSettings;