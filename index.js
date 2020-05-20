const express = require('express')
var bodyParser = require('body-parser')
const axios = require('axios')
const app = express()

const wechatBotUrl = process.env.wechatBotUrl;
const slackBotUrl = process.env.slackBotUrl;

app.use(function (req, res, next) {
  console.log('========== Time:', Date.now())
  next()
})

function send2wechat(msg) {
  return axios.post(wechatBotUrl, {
    msgtype: "text",
    text: {
      content: msg
    }
  })
}

function send2slack(msg) {
  return axios.post(slackBotUrl, {
    text: msg
  })
}

app.post('/msg', bodyParser.text({type:"*/*"}), function (req, res, next) {

  console.log(req.originalUrl);
  const d = req.body.split(/\r?\n/);
  console.log(d);

  let callArray = [];
  d.forEach(r => {
    callArray.push(send2wechat(r));
    callArray.push(send2slack(r));
  });

  axios.all(callArray)
    .then(axios.spread( (...responses) => {
      console.log(responses[0].statusText);
    })).catch(errors => {
      console.log(JSON.stringify(errors));
    });
//     .then(res => {
//       const msg = `status: ${res.status}, ${res.statusText}. data: ${res.data}`;
//       console.log(msg);
//       res.status(503).send(`Fail: ${msg}`);
//     })
//     .catch(err => {
//       const res = err.response;
//       const msg = `status: ${res.status}, ${res.statusText}. data: ${res.data}`;
//       console.log(msg);
//       res.status(503).send(`Fail: ${msg}`);
//     });
// }, function (req, res, next) {
//   const res = err.response;
//   const msg = `status: ${res.status}, ${res.statusText}. data: ${res.data}`;
//   console.log(msg);
//   res.status(503).send(`Fail: ${msg}`);

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

