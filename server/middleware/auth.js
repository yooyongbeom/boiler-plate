const { User } = require('../models/User');

// 인증처리
let auth = (req, res, next) => {
    // 클라이언트 토큰에서 쿠키를 가져온다.
    let token = req.cookies.x_auth;

    // 복호화한 토큰으로 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ isAuth: false, error: true })
        }

        // token과 user를 넣어준다.
        req.token = token;
        req.user = user;
        next();
    });


    // 있으면 인증 성공

    // 없으면 인증 실패
};

module.exports = { auth };