import stealth from '../../../dist/stealth.js';
import Profile from '../../../src/interface/app/profile/display';
import React from 'react';
import { mount } from 'enzyme';

test('should ensure the proper profile info is set and passed on click', () => {
  var needsRefresh = jest.fn();
  var updateState = jest.fn();
  var profile = {
                  "id": "hodor",
                  "name": "Hodor",
                  "_uid": "22222.22222222222",
                  "image": "hodor.png",
                  "segments": [
                    "demo",
                    "doors",
                    "housestark"
                  ],
                  "affinities": [
                    "hodor",
                    "carpentry"
                  ]
                };

  const wrapper = mount(
    <Profile key={profile.id} id={profile.id} needsRefresh={needsRefresh} updateState={updateState} profile={profile}></Profile>
  );

  const p = wrapper.find('div');
  p.simulate('click');
  expect(updateState).toBeCalledWith({
    segments: [ 'demo', 'doors', 'housestark' ],
    affinities: [ 'hodor', 'carpentry' ]
  });
});