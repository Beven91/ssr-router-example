import Navigator from './navigator';
import IndexScreen from '../../pages/home';
import UserScreen from '../../pages/user';

export default Navigator({
    Index: {
        screen: IndexScreen,
        navigationOptions: {
            title: 'Home'
        }
    },
    User: {
        screen: UserScreen,
        path: 'user',
        navigationOptions: {
            title: 'User Center'
        }
    }
})