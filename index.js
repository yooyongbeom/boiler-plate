const express = require('express');      // express 모듈을 가져온다.
const app = express();
const port = 5000;                       // port 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true               // 이것들을 안쓰면 에러난다.
    ,useUnifiedTopology: true
    ,useCreateIndex: true
    ,useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('시작의yyb')
})

app.post('/register', (req, res) => {
  // 회원가입할때 정보를 client에서 보내면 DB에 저장
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})