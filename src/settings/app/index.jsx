import React from 'react';
import {render} from 'react-dom';

// styles
import stylegrid from '../sass/grid.scss';
import stylemain from '../sass/main.scss';

// modules
import PageHome from './page/home.jsx';
import PageAdvanced from './page/advanced.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'home'
    };

    this.updateState = this.updateState.bind(this);
    this.needsRefresh = this.needsRefresh.bind(this);
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

  render () {

    let pageBody;
    if (this.state.currentPage == 'advanced') {
      pageBody = (
        <PageAdvanced updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageAdvanced>
      )
    } else {
      pageBody = (
        <PageHome updateState={this.updateState} needsRefresh={this.needsRefresh} state={this.state}></PageHome>
      )
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-4">
            Stealth
            By Lytics
          </div>
          <div className="col-8">
            {pageBody}
          </div>
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));