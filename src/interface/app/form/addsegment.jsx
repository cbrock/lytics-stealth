import React from 'react';

class FormAddSegment extends React.Component {

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    // get form data
    var segmentName = document.getElementById('segment-field').value;
    var segmentType = document.getElementById('hidden-type').value;

    console.log(segmentName, segmentType)

    // trigger needs refresh
    this.props.needsRefresh(true);

    // add the segment
    stealth.profile.update(segmentType, segmentName, false, function(){
      this.props.updateState({
        segments: (stealth.settings.state.activeProfile && stealth.profile.get(stealth.settings.state.activeProfile).segments) || [],
        affinities: (stealth.settings.state.activeProfile && stealth.profile.get(stealth.settings.state.activeProfile).affinities) || []
      });
    }.bind(this));

    // clear form data
    document.getElementById('hidden-type').value = '';
    document.getElementById('segment-field').value = '';
  }

  render() {
    return (
      <form id="data-entry" onSubmit={this.onSubmit}>
        <div>
          <input type="text" placeholder="Enter Value" id="segment-field"  />
          <input type="hidden" id="hidden-type" name="type" />
          <input type="submit"/>
        </div>
      </form>
    );
  }

}

export default FormAddSegment;