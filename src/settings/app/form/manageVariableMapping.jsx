import React from 'react';

class ManageVariableMapping extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ecom_acct_id: stealth.var.get('ecom_acct_id'),
      media_acct_id: stealth.var.get('media_acct_id')
    };

    this.handleSave = this.handleSave.bind(this);
  }

  handleChange (key, e) {
    var obj = {};
    obj[key] = e.target.value;
    this.setState(obj);
  }

  handleSave (e) {
    // set values
    for (var key in this.state) {
      stealth.var.set(key, this.state[key]);
    }

    // save the new account id
    this.props.needsRefresh(true);

    // add the segment
    this.props.updateState({
      variableMap: stealth.settings.state.var
    });
  }

  render() {
    return (
      <div>
        <div className="info">
          <h2>Account Mapping</h2>
          <p>
            No account information is included with the base installation. Please enter the current account information for the pre-determined demo sites below.
          </p>
        </div>
        <div className="field">
          <label>Ecommerce Demo</label><input type="text" onChange={this.handleChange.bind(this, 'ecom_acct_id')} value={this.state.ecom_acct_id} placeholder="Enter Account Id"/>
          <button className="add" onClick={this.handleSave}>save</button>
        </div>
        <div className="field">
          <label>Media Demo</label><input type="text" onChange={this.handleChange.bind(this, 'media_acct_id')} value={this.state.media_acct_id} placeholder="Enter Account Id"/>
          <button className="add" onClick={this.handleSave}>save</button>
        </div>
      </div>
    );
  }

}

export default ManageVariableMapping;