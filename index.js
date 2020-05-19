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
      const msg = `status: ${res.status}, ${res.statusText}. data: ${res.data}`;
      console.log(msg);
      res.status(503).send(`Fail: ${msg}`);
    })
    .catch(err => {
      const res = err.response;
      const msg = `status: ${res.status}, ${res.statusText}. data: ${res.data}`;
      console.log(msg);
      res.status(503).send(`Fail: ${msg}`);
    });
}, function (req, res, next) {
  const res = err.response;
  const msg = `status: ${res.status}, ${res.statusText}. data: ${res.data}`;
  console.log(msg);
  res.status(503).send(`Fail: ${msg}`);
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

