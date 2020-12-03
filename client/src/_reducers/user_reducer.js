import {
    LOGIN_USER
    ,REGISTER_USER
} from '../_actions/action_types';

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload };           // spread operator 위에 걸 똑같이 가져온다 빈상태를 나타낸다.(...)
        case REGISTER_USER:
            return { ...state, register: action.payload };
        default:
            return state;
    }
}