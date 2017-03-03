import React from 'react';

class ProfileSegments extends React.Component {

  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteSegment = this.deleteSegment.bind(this);
    this.deleteAffinity = this.deleteAffinity.bind(this);
    this.eachSegment = this.eachSegment.bind(this);
  }

  clickHandler (e) {
    e.preventDefault();

    var type = $(e.target).attr('data-type'),
        top = $(e.target).offset().top,
        left = $(e.target).offset().left,
        width = $('.entry').outerWidth(),
        height = $('.entry').outerHeight();

    // set the hidden field
    $('#hidden-type').val(type);

    // display the form
    $('.entry-wrapper').outerHeight($(window).height());
    $('.entry').css({top: ($(window).height()/2)-(height/2), left: ($(window).width()/2)-(width/2)});
    $('.entry-wrapper').addClass('show');
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
            <a href="#" className="add-data" onClick={this.clickHandler} data-type={this.props.group == 'segments' ? 'segments' : 'affinities'}>{this.props.group == 'segments' ? 'add segment' : 'add affinities'}</a>
          </div>
        </div>
      </div>
    );
  }

}

export default ProfileSegments;