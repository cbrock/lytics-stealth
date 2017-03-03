import React from 'react';

class NavSettings extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    switch(this.props.state.currentPage) {
      case 'basicsettings':
        this.props.updateState({currentPage: 'master'});
        break;
      case 'advancedsettings':
        this.props.updateState({currentPage: 'basicsettings'});
        break;
      default:
        this.props.updateState({currentPage: 'basicsettings'});
    }
  }

  render() {
    return (
      <div>
        <div>
          <a href="#" id="settings-link" onClick={this.handleClick}>
            <div className={(this.props.state.currentPage === 'master' ? 'settings' : 'back')}>&nbsp;</div>
          </a>
        </div>
      </div>
    );
  }

}

export default NavSettings;