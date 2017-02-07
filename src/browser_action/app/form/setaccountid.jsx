import React from 'react';

class FormSetAccountId extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accountvalue: stealth.settings.state.account
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  handleChange (e) {
    this.setState({
      accountvalue: e.target.value
    })
  }

  onSave (e) {
    // change demo name to 'unscripted' and update account id
    stealth.settings.state.activeDemo = 'unscripted';
    stealth.settings.state.account = this.state.accountvalue;

    // save the new account id
    this.props.needsRefresh(true);

    // add the segment
    this.props.updateState({
      account: stealth.settings.state.account,
      demo: stealth.settings.state.activeDemo
    });
  }

  render() {
    return (
      <div>
        <h1>Lytics Account</h1>
        <p className="warn">Use with caution. Associating the Stealth extension to a Lytics account will cause data to be sent and received as if our tag was on their site in production.</p>
        <input type="text" name="settings-account-id" id="settings-account-id" ref="account-input" placeholder="Account ID (use the full Id rather than AID)" defaultValue={this.state.accountvalue} onChange={this.handleChange}/>
        <button id="settings-proflie-reset-1" onClick={this.onSave}>save</button>
      </div>
    );
  }

}

export default FormSetAccountId;