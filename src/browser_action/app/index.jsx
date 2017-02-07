import style from '../sass/main.scss';

import React from 'react';
import {render} from 'react-dom';

import AlertRefresh from './alert/refresh.jsx';
import AlertVersion from './alert/version.jsx';
import FormAddSegment from './form/addsegment.jsx';
import NavPower from './nav/power.jsx';
import NavSettings from './nav/settings.jsx';
import PageAdvancedSettings from './page/advancedsettings.jsx';
import PageBasicSettings from './page/basicsettings.jsx';
import PageHome from './page/home.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      enabled: stealth.settings.state.enabled,
      profiles: stealth.profile.whitelisted(),
      segments: (stealth.settings.state.activeProfile && stealth.profile.get(stealth.settings.state.activeProfile).segments) || [],
      affinities: (stealth.settings.state.activeProfile && stealth.profile.get(stealth.settings.state.activeProfile).affinities) || [],
      needsRefresh: stealth.settings.state.unclean,
      currentPage: 'master',
      account: stealth.settings.state.account,
      demo: stealth.demo.get(stealth.settings.state.activeDemo)
    };
    this.updateState = this.updateState.bind(this);
    this.needsRefresh = this.needsRefresh.bind(this);
  }

  updateState (obj) {
    this.setState(obj);
  }

  needsRefresh (val) {
    stealth.settings.state.unclean = val;

    stealth.save.settings(function(){
      this.updateState({
        needsRefresh: stealth.settings.state.unclean
      });
    }.bind(this));
  }

  render () {

    let pageBody;
    if (this.state.currentPage == 'basicsettings') {
      pageBody = (
        <PageBasicSettings updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageBasicSettings>
      )
    } else if (this.state.currentPage == 'advancedsettings') {
      pageBody = (
        <PageAdvancedSettings updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageAdvancedSettings>
      )
    } else {
      pageBody = (
        <PageHome updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageHome>
      )
    }

    return (
      <div>
        <section className="power">
          <NavSettings updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></NavSettings>
          <div className="toggle">
            <span className="checkbox">
              <NavPower updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></NavPower>
            </span>
          </div>
        </section>

        {pageBody}

        <AlertRefresh updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></AlertRefresh>
        <AlertVersion updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></AlertVersion>

        <div className="footer">
          <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 183.7 104.3" enableBackground="new 0 0 183.7 104.3"><path d="M120.6 32.1h.3c4-1.1 6.5-2.9 6.2-8.3-.1-2-.8-3-1.9-3-2 0-3.6 3.9-3.8 4.3l-.3.6c-1 2.2-1.9 4.3-1.4 5.7 0 .5.5.7.9.7zM19.8 9.9c-1.5-.7-3.2.5-3.1 2.1l.1.5c.1 1 .6 1.9 1.3 2.6 3.8 3.8 15 12.4 21.7 12.4h.6c.2 0 .4.2.4.4-1.3 9.7-3.7 18.6-5.6 22.5-.8 1.6-1.7 3.3-2.7 3.3-.2 0-.5-.1-.7-.2-.9-.4-2.1-1.2-3.3-1.9-1.7-1-3.4-2.1-4.8-2.6-4.6-1.9-7.6-3.1-10.8-3.5-5.3-.5-11.7 1.7-12.7 7.2-.9 4.5 1.7 10.3 5.5 12.7 5.3 3.3 10.1 4.9 14.5 4.9 3.7 0 7.2-1.2 10.5-3.5.3-.2.7-.6 1.3-1.1.7-.6 2.3-2 3.2-2.6.1-.1.3-.1.4 0 .5.3.9.8 1.4 1.2.6.5 1.2 1 1.7 1.4 3.5 2.5 7.4 3.6 9.9 3.8.6 0 1.1.1 1.6.1 2.7 0 5.1-.6 7.3-1.9.1-.1.3-.1.4.1 1.5 1.5 3.1 1.9 4.5 1.9 4.9 0 10.5-5.2 14.1-9.3 0 .1 0 .2-.1.3-.5 2.8-1.1 5.4-2.3 7.6-.8 1.3-1.9 2.6-3 3.8-.5.5-.9 1-1.3 1.5-1.2 1.4-5.2 6.2-8.5 11.5-2.5 4-4.7 8.3-3.7 12.3.6 2.3 2.1 4.1 4.6 5.6 1.6.9 3.2 1.4 4.7 1.4 5.8 0 9.1-6.8 10.5-10.9 1.5-4.4 1.9-7.6 2.3-11.4.2-1.7.4-3.4.7-5.5.1-.5.2-1.1.2-1.7.3-2.5.6-4.8 2.2-6.3 1.8-1.6 3.6-3.3 5.3-4.9l.3-.3c.7-.6 1.4-1.3 2-1.9l.8-.7c.2-.2.5-.1.6.2.4 1.8 1.1 3.3 2 4.6 1.8 2.4 4.5 3.8 7.6 3.8 2.8 0 5.6-1.2 7.7-3.2.3-.3.8-1 1.5-2 .1-.2.4-.2.6 0 .4.5.8 1 1.3 1.4 2.3 1.8 4.1 2.6 5.7 2.6 2.4 0 4.3-1.7 6.9-4.3.2-.2.5-.6.8-1.1.1-.2.5-.2.6 0l.6 1.1c2 3 5.1 5 8.7 5.5 1.5.2 2.8.3 4.1.3 5 0 8.8-1.7 12.5-5.9.1-.2.4-.2.5 0 .7 1 1.5 1.9 2.3 2.6 2.3 2 6 3.4 9.3 3.4 4.3 0 7.4-2.3 8.5-6.3.7-2.6.7-2.6 3.4-3.6 1.9-.7 6.3-2.7 6.8-6.1.1-.8 0-1.4-.4-1.9-.2-.3-.7-.6-1.5-.6-1.5 0-3.7 1.2-5.8 2.3-.9.5-2.1 1.1-2.7 1.3-.1.1-.3 0-.4-.1-.2-.3-.4-.9-.7-1.9-.1-.4-.2-.8-.3-1.1-1.4-3.4-3.3-6.9-4.9-9.8-.2-.4-.5-1-.7-1.6-.4-1.1-.9-2.3-1.7-3.1-.7-.7-2.9-1.3-4.3-1.3-1.5 0-2 .6-2.2 1.2-.4 1 0 1.9.2 2.6.1.3.2.5.2.7.1.4 0 1.2-.2 2.1-.3 1.6-1.2 3-1.9 4.1-.1.1-.2.3-.4.5-.8 1.1-1.5 1.8-1.9 2.5-.3-.1-.5-.2-.8-.2-.4 0-.9.1-1.4.7-.9 1-1.2 3.1-1.3 4.7 0 .1 0 .1-.1.2-.7.9-1.4 1.9-2.1 3.2-.4.7-.9 1.4-1.2 1.8-1.1 1.4-3.7 2.9-6.9 2.9-2.4 0-4.8-.9-6.8-2.7-1-.9-1.5-2.2-1.6-3.8-.1-3.9 2.7-9.3 5.4-11.9 1.4-1.4 2.9-2.2 4-2.2.3 0 .6.1.9.2 1.1.6 1.1.9.2 2.6-.6 1.1-1.2 2.3-.8 3.6.1.4.3.7.7.8.8.4 1.3.7 2 1.1.6.3 1.3.2 1.8-.3 2.7-3 3.6-6.6 2.3-9.5-1.3-3-4.8-4.5-9.1-3.8-6.2 1-11.9 6.9-13.7 14.2-.1.4-.2.8-.3 1.3v.1c-.3.6-.7 1.2-1.1 1.9-1.4 2.6-3.2 5.8-5.5 6.7-1.1.4-1.6.5-1.9.5h-.2c-.2-.4.1-2 .3-3l.2-1.1c.5-2.5 1.3-4.9 2.2-7.2 1.1-3 2.3-6.1 2.6-9.6.1-1.1-.3-2.3-1.1-3.1-.7-.7-1.5-1.2-2.4-1.2-.9 0-1.8.5-2.3 1.4-.1.1-5 9.7-6 17.7 0 .1 0 .1-.1.2l-.8 1c-1.9 2.5-4.3 5.7-6.6 6.6-1.5.6-2.7.3-3.4-.7-.8-1.1-1.1-3.1-.6-4.8 1-3.5 1.9-7.1 2.7-10.6v-.1c1.4-3.2 2.4-6.6 3.4-10 0-.1.1-.2.3-.2 2.4-.4 4.8-.8 7.1-1.2.8-.1 1.6-.2 2.4-.2l1.8-.1c.5-.1 1-.4 1.2-.9.3-.8.3-1.7-.2-2.5-.8-1.3-2.6-2.1-3.9-2.1h-.2c-1.7 0-3.6.1-5.6.2-.2-.2-.2-.2-.4-.5 1-2.9 1.6-5.3 1.6-7.6 0-1.8-.2-3.1-.9-4.2-.9-1.5-2.7-2.4-4.2-1.9-2 .6-2.8 2.9-3.2 4.2-.5 1.4-.8 2.9-1.2 4.5v.1c-.7 1.8-1.6 3.8-2.4 6l-.8.6-.6.1c-.4 0-1 .1-1.7.1-2.2.2-5.6.4-7.3.9-1.3.4-2.2 1.1-2.5 2.2-.1.4-.2 1.1.2 1.9.8 1.4 2.7 2.5 3.8 2.8.4.1.8.2 1.4.2 1.4 0 3-.3 4.5-.7l.4-.1-1 3.6c-.6 2.3-1 4.5-1.3 6.5v.1c-.8 1.5-1.7 2.9-2.6 4.2-1.4 2-3.3 3.7-5.1 5.4l-.8.7c.4-5.6 1-9.2 2.1-15.1.1-.5-.1-1-.5-1.3l-1.9-1.7c-.3-.2-.6-.3-.9-.3h-.7c-.4 0-.7.2-.9.5-1.4 2.6-2.5 4.8-3.5 7-1.6 3.4-3.2 6.7-5.8 10.4-1.1 1.6-3.7 2.9-5.7 2.9-.9 0-1.5-.2-2-.6-.1-.1-.1-.1-.1-.2l-.3-1.2c-.1-.3-.3-.5-.4-.7v-.3c-.2-4.7 2.4-14.2 4.3-18.9.6-1.4 1.3-3.4.4-4.7-.5-.7-1.3-1.1-2.5-1.1h-.7c-3.3.3-6.4 7.6-6.4 7.7-1.8 4.3-3.6 12.7-2.9 18.7 0 .1 0 .3-.2.3-1.8 1.1-3.9 1.8-5.7 1.6-2.1-.2-4.8-.7-9.7-4.9-.1-.1-.2-.3-.1-.4 5.7-11.7 7.3-20.2 8.1-27.1.1-.8.2-2.2.8-2.5.5-.2 1.8-.3 2.4-.3h.4c2.9-.2 5.4-.5 7.8-1 3.6-.8 7.4-2.5 11-4.9 3.2-2.2 7.2-5.8 7.6-10.6.2-2.6-.6-5.1-2.4-7.1-2.1-2.4-5.4-3.7-8.6-3.4-5.8.5-11.2 2.9-14.8 6.5-2.4 2.4-5.2 6.2-6.9 8.9-.4.6-.7 1.3-1 2-.4 1.4-1.3 3.2-2.3 3.3-5.9.3-14.7-6.2-17.9-8.9-.7-.6-1.4-1-2.2-1.5l-1.1-.6zm45-3.3c.3-.1.6-.2 1-.3 2.5-.6 4.7-.3 5.4.7.3.4.4 1 .3 1.7-.4 2.3-2 4.5-4.6 6.5-4.5 3.4-10.5 4.7-15.7 5.3-.3 0-.5-.3-.3-.5 2.6-5 7-10.7 13.9-13.4zm-48.4 56.5c-3.7-.2-8.1-3-9.5-6.1-.6-1.4-.6-2.7.3-3.8.8-.8 2-1.2 3.6-1.2 5.6 0 14.2 4.8 17.9 7 .2.1.2.3.1.5-2 2.8-6 3.9-12.4 3.6zm57.1 18.2c-.5 2.7-1 5.5-1.5 7.6-.9 4-2.3 6.7-6.2 7.9h-.1c-.4.1-.7.1-1 .1-.9 0-1.1-.3-1.1-.4-.3-.5-.7-2.7 4.8-10.9l.2-.3c1.4-2.1 3.1-4.4 4.6-6.3.2-.3.7-.1.6.3-.1.6-.2 1.3-.3 2zm88.6-32.6h.6c2 2.5 3.3 4.8 4.3 7.5.1.2-.1.5-.3.5-2 0-4.1-.4-5.8-1.3-.7-.3-1.1-.7-1.2-1.2-.3-1.5 1.2-3.7 2.4-5.5zm5.2 14.1c-.1.7-.5 1.7-2.5 1.7-1.8 0-3.8-.8-4.6-1.4-.8-.6-1.4-1.8-1.8-3-.1-.3.2-.6.5-.4 2 1.1 4.6 2.4 6.8 2.6h1.7c0 .1-.1.3-.1.5z" /></svg>
        </div>
        <div className="entry-wrapper">
          <div>
            <FormAddSegment updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></FormAddSegment>
          </div>
        </div>
      </div>
      );
  }
}

render(<App/>, document.getElementById('app'));