import { combineReducers } from 'redux';
import user from './user_reducer';

// store에 reducer가 여러가지가 있을 수 있다.
// combineReducer를 이용해서 하나로 합쳐주는 것이다.
// 기능이 많아질수록 합쳐주면 하나로 사용할 수 있다.
const rootReducer = combineReducers({
    user
});

export default rootReducer;