const express = require('express')
var bodyParser = require('body-parser')
const axios = require('axios')
const app = express()

const wechatBotUrl = process.env.wechatBotUrl;

app.use(function (req, res, next) {
  console.log('========== Time:', Date.now())
  next()
})

app.post('/msg', bodyParser.text(), function (req, res, next) {

  console.log(req.originalUrl);
  console.log(req.body);

  axios
    .post(wechatBotUrl, {
      msgtype: "text",
      text: {
        content: req.body
      }
    })
    .then(res => {
      // console.log(res);
    })
    .catch(err => {
      console.log(`status: ${err.response.status}, ${err.response.statusText}. data: ${err.response.data}`);
    });
  res.send('Success!')
}, function (req, res, next) {
  console.log(`status: ${err.response.status}, ${err.response.statusText}. data: ${err.response.data}`);
  res.send('Failure!')
})

//---------- Error handling

app.get('/error', function (req, res, next){
  throw new Error("Imitate error!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json(err.message)
})


const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));

