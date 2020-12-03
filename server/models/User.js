const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String
        ,maxlength:50
    },
    email: {
        type: String
        ,trim: true
        ,unique: 1
    },
    password: {
        type: String
        ,minlength:5
    },
    lastname: {
        type: String
        ,maxlength: 50
    },
    role: {
        type: Number
        ,default:0
    },
    image: String
    ,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

// 비번 입력시 암호화
userSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        // 비밀번호 암호화 시킴
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});

// 패스워드 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// 토큰 생성
userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken을 이용해서 생성
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken');      // token = user._id + 'secretToken' 이다.
    
    user.token = token;
    user.save(function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });

};

userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    // token decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디로 찾아 클라이언트와 DB의 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);
module.exports = {User};
