import React from 'react';
import ProfileWrapper from '../profile/wrapper.jsx';
import ProfileSegments from '../profile/segments.jsx';

class PageHome extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <section className="personaselect" id="react-personas">
          <ProfileWrapper updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></ProfileWrapper>
        </section>
        <section className="detail">
          <div className="data">
            <div className="fieldwrap" id="react-segments">
              <ProfileSegments group="segments" updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></ProfileSegments>
            </div>
            <div className="fieldwrap" id="react-affinities">
              <ProfileSegments group="affinities" updateState={this.props.updateState} needsRefresh={this.props.needsRefresh} state={this.props.state}></ProfileSegments>
            </div>
          </div>
        </section>
      </div>
    );
  }

}

export default PageHome;
