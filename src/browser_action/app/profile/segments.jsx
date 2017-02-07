import React from 'react';

class ProfileSegments extends React.Component {

  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.deleteSegment = this.deleteSegment.bind(this);
    this.deleteAffinity = this.deleteAffinity.bind(this);
    this.eachSegment = this.eachSegment.bind(this);
  }

  delete (e, type) {
    e.preventDefault();

    // trigger needs refresh
    this.props.needsRefresh(true);

    // delete the value and update state
    stealth.profile.update(type, e.currentTarget.id, true, function(){
      this.props.updateState({
        segments: stealth.profile.get(stealth.settings.state.activeProfile).segments,
        affinities: stealth.profile.get(stealth.settings.state.activeProfile).affinities
      });
    }.bind(this));
  }

  deleteSegment (e) {
    this.delete(e, 'segments');
  }

  deleteAffinity (e) {
    this.delete(e, 'affinities');
  }

  eachSegment (segment, type) {
    if(this.props.group == "segments"){
      return (
        <div key={segment} id={segment} onClick={this.deleteSegment}>{segment}</div>
      )
    }else{
      return (
        <div key={segment} id={segment} onClick={this.deleteAffinity}>{segment}</div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="key">
          {this.props.group}
        </div>

        <div className="value">
          {this.props.group == 'segments' ? this.props.state.segments.map(this.eachSegment) : this.props.state.affinities.map(this.eachSegment)}
          <div>
            <a href="#" className="add-data" data-type={this.props.group == 'segments' ? 'segments' : 'affinities'}>{this.props.group == 'segments' ? 'add segment' : 'add affinities'}</a>
          </div>
        </div>
      </div>
    );
  }

}

export default ProfileSegments;