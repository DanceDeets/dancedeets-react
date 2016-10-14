/**
 * Copyright 2016 DanceDeets.
 *
 * @flow
 */
'use strict';

import React from 'react';
import {
  Animated,
  Image,
  View,
} from 'react-native';

type Props = {
  originalWidth: number;
  originalHeight: number;
  style?: any;
  duration: number;
};

export default class ProportionalImage extends React.Component {
  props: Props;

  state: {
    height: ?number;
    width: ?number;
    opacity: any;
  };

  view: ReactElement<View>;

  constructor(props: Props) {
    super(props);
    this.state = {
      height: null,
      width: null,
      opacity: new Animated.Value(0),
    };
    (this: any).onLayout = this.onLayout.bind(this);
    (this: any).onLoad = this.onLoad.bind(this);
  }

  static defaultProps = {
    duration: 200,
  };

  setNativeProps(nativeProps: Object) {
    this.view.setNativeProps(nativeProps);
  }

  onLayout(e: SyntheticEvent) {
    const nativeEvent: any = e.nativeEvent;
    const layout = nativeEvent.layout;
    const aspectRatio = this.props.originalWidth / this.props.originalHeight;
    if (this.props.resizeDirection == 'width') {
      const measuredWidth = aspectRatio * layout.height;
      const currentWidth = layout.width;
      if (measuredWidth !== currentWidth) {
        this.setState({
          ...this.state,
          width: measuredWidth,
        });
      }
    } else {
      const measuredHeight = layout.width / aspectRatio;
      const currentHeight = layout.height;

      if (measuredHeight !== currentHeight) {
        this.setState({
          ...this.state,
          height: measuredHeight,
        });
      }
    }
  }

  onLoad() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: this.props.duration,
    }).start();
  }

  render() {
    // We catch the onLayout in the view, find the size, then resize the child (before it is laid out?)
    return (
      <View
        onLayout={this.onLayout}
        ref={(x) => {this.view = x;}}
        {...this.props}
        >
        <Animated.Image
          {...this.props}
          style={[{opacity: this.state.opacity, height: this.state.height, width: this.state.width}, this.props.style]}
          onLoad={this.onLoad}
        />
      </View>
    );
  }
}
