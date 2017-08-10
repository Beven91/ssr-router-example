/**
 * 实现卡片切换页面的视图，用于模拟app的页面切换效果
 * 
 * 用例： 
 *      <StackAnimateView route={path} isForward={forward}>..children...</StackAnimateView>
 */

import React from 'react';
import { PropTypes, Dimensions,Animated,View,StyleSheet,Easing  } from 'react-native';

const AnimateValue = (v) => new Animated.Value(v);

export default class StackAnimateView extends React.PureComponent {

    static propTypes = {
        route: PropTypes.string,
        isForward: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
    * 初始化动画参数
    */
    initAnimation(isForward) {
        const screenWidth = Dimensions.get('window').width;
        this.beginX = 0;
        this.endX = isForward ? screenWidth : -screenWidth;
        this.translateX = AnimateValue(0);
        this.translateZ = AnimateValue(0);
        //注册的动画
        this.createAnimations = {
            getInAnimate: this.inAnimation.bind(this),
            getOutAnimate: this.outAnimation.bind(this),
        }
    }

    /**
    * 获取进入页面动画样式
    */
    getPageInStyle(isForward) {
        let animateStyle = { backfaceVisibility: 'hidden' }
        let transXInterpolate = this.translateX.interpolate({
            inputRange: [0, 1],
            outputRange: [this.endX, this.beginX]
        });
        animateStyle.transform = [{ translate3d: '0,0,0' }, { translateX: transXInterpolate }];
        return animateStyle;
    }

    /**
     * 初始化进入页面动画样式
     */
    getPageOutStyle(state) {
        let outStyle = { backfaceVisibility: 'hidden' }
        let transZInterpolate = this.translateZ.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -300]
        });
        outStyle.transform = [{ translate3d: '0,0,0' }, { translateZ: transZInterpolate }];
        return outStyle;
    }

    /**
     * 播放动画
     */
    playAnimation() {
        this.createAnimations.getInAnimate().start();
        if (this.state.lastChildren) {
            this.createAnimations.getOutAnimate().start(() => {
                this.setState({ lastChildren: undefined })
            });
        }
    }

    inAnimation() {
        return Animated.timing(this.translateX, { toValue: 1, duration: 260, easing: Easing.inOut(Easing.ease) });
    }

    outAnimation() {
        return Animated.timing(this.translateZ, { toValue: 1, duration: 260, easing: Easing.inOut(Easing.ease) });
    }

    _shouldSetResponder() {
        return true;
    }

    /**
     * 当属性改变时,切换窗口样式
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.route !== this.props.route) {
            this.initAnimation(nextProps.isForward);
            this.setState({
                lastChildren: this.props.children,
                initStyle: this.getPageInStyle(),
                outStyle: this.getPageOutStyle()
            })
        }
    }

    /**
   * 当属性改变时,切换窗口样式
   */
    componentDidUpdate(nextProps) {
        this.playAnimation();
    }

    /**
     * 渲染切换前的视图
     */
    renderPrev() {
        let { lastChildren } = this.state;
        if (lastChildren) {
            return (
                <Animated.View style={[styles.nav, this.state.outStyle]} onStartShouldSetResponder={this._shouldSetResponder.bind(this)}>
                    {lastChildren}
                </Animated.View>
            )
        }
    }

    /**
     * 渲染组件
     */
    render() {
        return (
            <View style={styles.container}>
                {this.renderPrev()}
                <Animated.View style={[styles.nav, this.state.initStyle]} onStartShouldSetResponder={this._shouldSetResponder.bind(this)}>
                    {this.props.children}
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    transform: [{ translate3d: '0,0,0' }],
    backfaceVisibility: 'hidden',
    perspective: 1000
  },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#fff',
  }
});