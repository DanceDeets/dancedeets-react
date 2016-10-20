/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import App from './app';
import React from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import Mixpanel from 'react-native-mixpanel';
import ScreenshotSlideshow from '../ScreenshotSlideshow';
import { intl } from '../intl';
import ProcessInfo from 'react-native-processinfo';
// Initialize firestack
import firestack from '../firestack';

export default function setup(): Class<Object> {
  console.disableYellowBox = true;

  class Root extends React.Component {
    state: {
      store: any,
    };

    constructor() {
      super();
      this.state = {
        store: configureStore(),
      };
    }

    render() {
      let app = <App />;
      if (Platform.OS === 'ios' && ProcessInfo.environment.UITest) {
        app = <ScreenshotSlideshow>{app}</ScreenshotSlideshow>;
      }
      return (
        <Provider store={this.state.store}>
          {app}
        </Provider>
      );
    }
  }

  return intl(Root);
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};
