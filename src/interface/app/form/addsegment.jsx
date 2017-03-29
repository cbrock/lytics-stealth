import React from 'react';

class FormAddSegment extends React.Component {

  constructor(props) {
    super(props);
    this.onFieldClick = this.onFieldClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFieldClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onSubmit(e) {
    e.preventDefault();

    // get form data
    var segmentName = document.getElementById('segment-field').value;
    var segmentType = document.getElementById('hidden-type').value;

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
    $('.entry-wrapper').removeClass('show');
  }

  render() {
    return (
      <form id="data-entry" onSubmit={this.onSubmit}>
        <div>
          <input type="text" placeholder="Enter Value" id="segment-field" onClick={this.onFieldClick} />
          <input type="hidden" id="hidden-type" name="type" />
          <input type="submit"/>
        </div>
      </form>
    );
  }

}

export default FormAddSegment;