import React from 'react';
import {render} from 'react-dom';

// styles
import stylemain from '../sass/main.scss';

// modules
import PageGeneral from './page/general.jsx';
import PageUser from './page/user.jsx';
import PageDemo from './page/demo.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'general',
      whitelistedDomains: stealth.settings.state.whiteListedDomains || [],
      variableMap: stealth.settings.state.var || {},
      dataSyncUrl: stealth.var.get('dataSyncUrl') || '',
      profiles: stealth.profile.all() || [],
      demos: stealth.demo.all() || []
    };

    this.updateState = this.updateState.bind(this);
    this.needsRefresh = this.needsRefresh.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  updateState (obj) {
    this.setState(obj);
  }

  needsRefresh (val) {
    stealth.save.settings(function(){
      this.updateState({
        needsRefresh: stealth.settings.state.unclean
      });
    }.bind(this));
  }

  handleNavClick (e) {
    var page = e.target.id;
    this.updateState({currentPage: page});
  }

  render () {
    let pageBody;
    if (this.state.currentPage == 'users') {
      pageBody = (
        <PageUser updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageUser>
      )
    } else if (this.state.currentPage == 'demos') {
      pageBody = (
        <PageDemo updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageDemo>
      )
    } else {
      pageBody = (
        <PageGeneral updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageGeneral>
      )
    }

    return (
      <div>
        <div className="navcol">
          <div className="logo"><img src="img/stealth-logo.svg" /></div>
          <ul className="navmenu">
            <li className={(this.state.currentPage === 'general' ? 'active' : '')} onClick={this.handleNavClick} id="general">Security</li>
            <li className={(this.state.currentPage === 'users' ? 'active' : '')} onClick={this.handleNavClick} id="users">Profile Editor</li>
            <li className={(this.state.currentPage === 'demos' ? 'active' : '')} onClick={this.handleNavClick} id="demos">Demo Editor</li>
          </ul>
        </div>
        <div className="pagecol">
          {pageBody}
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));