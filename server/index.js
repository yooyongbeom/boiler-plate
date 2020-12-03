const express = require('express');      // express 모듈을 가져온다.
const app = express();
const port = 5000;                       // port 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true               // 이것들을 안쓰면 에러난다.
    ,useUnifiedTopology: true
    ,useCreateIndex: true
    ,useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('시작의yyb')
});

app.post('/register', (req, res) => {
  // 회원가입할때 정보를 client에서 보내면 DB에 저장
  const user = new User(req.body);
  // console.log(req.body);
  user.save((err, userInfo) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({ success: true });
  });
});

app.post('/login', (req, res) => {
  // 1. 요청된 이메일을 DB에서 찾는다.
  // 2. 있으면 비번이 맞는지 체크한다.
  // 3. 토큰을 생성한다.
  // console.log(req.body);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false
        ,message: "존재하지 않는 이메일 입니다. 확인해주십시오."
      });
    }
    // 이메일이 있으면 비번 체크
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
      }
      // 토큰 생성
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        // 토큰을 쿠키로 저장
        res.cookie("x_auth", user.token).status(200).json( {loginSuccess: true, userId: user._id} );

      });
    });

  });
});

app.get('/api/users/auth', auth, (req, res) => {
  // 미들웨어를 통과했으면 인증이 성공했다는것
  res.status(200).json({
    _id: req.user._id
    ,isAdmin: req.user.role === 0 ? false : true
    ,isAuth: true
    ,email: req.user.email
    ,name: req.user.name
    ,lastname: req.user.lastname
    ,role: req.user.role
    ,image: req.user.image
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: ""}, (err, user) => {
    if (err) {
      return res.json( {success: false, err });
    }
    return res.status(200).send({
      success: true
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});