/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */

'use strict';

import { purpleColors, yellowColors, redColors } from '../Colors';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { HorizontalView } from './Misc';
import { Text } from './DDText';
import {
  semiNormalize,
} from './normalize';

type Props = {
  icon: ?number;
  caption: string;
  style: any;
  onPress: () => Promise<void> | () => void;
  size: 'small' | 'large';
  textStyle: any;
  color: 'purple' | 'yellow' | 'red';
  testID: ?string;
  enabled: ?boolean;
};

class Button extends React.Component {

  static defaultProps: Props = {
    caption: '',
    icon: null,
    style: {},
    onPress: () => {},
    size: 'large',
    textStyle: {},
    color: 'purple',
    testID: null,
    isLoading: false,
    enabled: true,
  };

  _renderRealContent() {
    const caption = this.props.caption;
    let icon;
    if (this.props.icon) {
      icon = <Image source={this.props.icon} style={[caption ? styles.iconSpacing : {}, styles.iconSize]} />;
    }
    const content = (
      <HorizontalView>
        {icon}
        <Text style={[styles.caption, this.props.textStyle]}>
          {caption}
        </Text>
      </HorizontalView>
    );
    return content;
  }

  _renderContent() {
    let contentOpacity = 1.0;
    let activityIndicator = null;
    if (this.props.isLoading) {
      activityIndicator = (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            animating={true}
            size="small"
            color={this.props.activityIndicatorColor || 'white'}
          />
        </View>
      );
      contentOpacity = 0;
    }
    return <View>
      {activityIndicator}
      <View style={{opacity: contentOpacity}}>
        {this._renderRealContent()}
      </View>
      </View>;
  }

  render() {
    const size = this.props.size === 'small' ? styles.smallButton : styles.largeButton;
    let colors = null;
    if (this.props.color === 'purple') {
      colors = [purpleColors[1], purpleColors[3], purpleColors[3]];
    } else if (this.props.color === 'yellow') {
      colors = [yellowColors[1], yellowColors[4], yellowColors[4]];
    } else if (this.props.color === 'red') {
      colors = [redColors[0], redColors[1], redColors[1]];
    }
    const buttonContents = <LinearGradient
      start={[0, 0]} end={[0, 1]}
      locations={[0.0, 0.7, 1.0]}
      colors={colors}
      style={[styles.button, size]}>
        {this._renderContent()}
    </LinearGradient>;

    if (this.props.enabled) {
      return (
        <TouchableOpacity
          accessibilityTraits="button"
          onPress={this.props.onPress}
          activeOpacity={0.8}
          style={[this.props.style]}
          testID={this.props.testID}>
          {buttonContents}
        </TouchableOpacity>
      );
    } else {
      return <View>{buttonContents}</View>;
    }
  }
}

var styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  largeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  iconSize: {
    width: semiNormalize(18),
    height: semiNormalize(18),
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  border: {
    borderWidth: 1,
    borderColor: 'white',
  },
  iconSpacing: {
    marginRight: 10,
  },
  caption: {
    letterSpacing: 1,
    fontSize: semiNormalize(16),
    lineHeight: semiNormalize(19),
    color: 'white',
  },
  secondaryCaption: {
    color: 'white',
  },
});

module.exports = Button;
