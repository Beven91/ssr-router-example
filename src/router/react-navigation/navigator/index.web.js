import React, { Component } from 'react';
import { PropTypes } from 'react-native';
import { NavigationActions, addNavigationHelpers, TabRouter, createNavigator } from 'react-navigation';
import DynamicView from './dynamic';
import NavigateHelper from './dynamic/forward';


const reactAppContext = global['@@__reactAppContext__@@'];
//判断是否为nodejs服务端运行react
const isNodeServerRuntime = global.__CLIENT__ !== true

class NavApp extends Component {

    static childContextTypes = {
        getActionForPathAndParams: PropTypes.func.isRequired,
        getURIForAction: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const { router } = this.props;
        const path = reactAppContext.route.toString();
        const initAction = this.getAction(router, path, { path });
        this.dispatch = this.dispatch.bind(this);
        this.state = router.getStateForAction(initAction);
        this.getActionForPathAndParams = this.getActionForPathAndParams.bind(this);
        this.getURIForAction = this.getURIForAction.bind(this);
        NavigateHelper.initRoute();
    }

    getAction(router, path, params) {
        return router.getActionForPathAndParams(path, params) || NavigationActions.navigate({
            params: { path },
            routeName: 'NotFound',
        });
    }

    getNavigation() {
        const { router } = this.props;
        const state = this.state;
        const navigation = addNavigationHelpers({
            state: this.state,
            dispatch: this.dispatch,
        })
        const screenNavigation = addNavigationHelpers({
            ...navigation,
            state: state.routes[state.index],
        });
        const options = router.getScreenOptions(screenNavigation, {});
        if (isNodeServerRuntime) {
            //通知express
            reactAppContext.route.setMatchRoute(options.title);
        } else {
            document.title = options.title;
        }
        return navigation;
    }

    dispatch(action) {
        if (isNodeServerRuntime) {
            //服务端直接返回false
            return false;
        }
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state);
        const isChange = state && state !== this.state;
        if(action.type === 'Navigation/BACK'){
            window.history.back();
        }else if (isChange) {
            state.popstate = action.fromPopstate;
            this.setState(state)
        }
        return (isChange || !state);
    }

    getURIForAction(action) {
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state) || this.state;
        const { path } = router.getPathAndParamsForState(state);
        return `/${path}`;
    }

    getActionForPathAndParams(path, params) {
        return router.getActionForPathAndParams(path, params);
    }

    getChildContext() {
        return {
            getActionForPathAndParams: this.getActionForPathAndParams,
            getURIForAction: this.getURIForAction,
            dispatch: this.dispatch,
        };
    }

    componentDidMount() {
        const { router } = this.props;
        window.onpopstate = e => {
            e.preventDefault();
            const action = this.getAction(router, window.location.pathname.substr(1));
            action.fromPopstate = true;
            if (action) this.dispatch(action);
        };
    }

    componentWillUpdate(props, state) {
        const { router } = this.props;
        const { path, params } = router.getPathAndParamsForState(state);
        const maybeHash = params && params.hash ? `#${params.hash}` : '';
        const uri = `/${path}${maybeHash}`;
        if (window.location.pathname !== uri) {
            const id = NavigateHelper.genStateID();
            window.history.pushState({ id }, state.title, uri);
        }
    }

    componentDidUpdate() {
        NavigateHelper.setCurrentStateID(window.history.state.id);
    }

    //非代码拆分渲染
    // render() {
    //     const { router } = this.props;
    //     const Screen = router.getComponentForState(this.state);
    //     const navigation = this.getNavigation();
    //     return (<Screen navigation={navigation} />)
    // }

    //代码拆分路由加载
    render() {
        const { router } = this.props;
        const navigation = this.getNavigation();
        const Screen = router.getComponentForState(this.state);
        const isForward = NavigateHelper.isForward(this.state.popstate || this.state.isBack)
        return (
            <DynamicView navigation={navigation} router={router} isForward={isForward} />
        )
    }
}

export default Navigator = (routeConfigs, stackConfig) => {
    return createNavigator(TabRouter(routeConfigs, stackConfig))(NavApp);
}