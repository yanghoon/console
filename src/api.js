// express
const express = require("express");
const app = express();

// websocket
const expressWs = require('express-ws')(app);
const WebSocket = require('ws');

// for kube
var K8s = require('k8s')

// service
var cluster = require('./modules/service/cluster');

app.use(express.static("dist"));

// file upload :: http://webframeworks.kr/tutorials/expressjs/expressjs_file_upload/
app.get("/api/cluster/list", (req, res) => {
  res.send(cluster.clusterNames());
})

app.get("/api/cluster/:cluster/namespace/list", (req, res) => {
  var kubectl = K8s.kubectl({
    binary: 'kubectl',
    kubeconfig: cluster.getPath(req.params.cluster)
  })

  cmd = `get ns --output=json`
  kubectl.command(cmd).then(function(ns){
    console.log(req.url, req.params)
    res.send(ns)
  }) 
})

app.get("/api/cluster/:cluster/namespace/:ns/pod/list", (req, res) => {
  var kubectl = K8s.kubectl({
    binary: 'kubectl',
    kubeconfig: cluster.getPath(req.params.cluster)
  })

  cmd = `get pod --namespace=${req.params.ns} --output=json`
  kubectl.command(cmd).then(function(ns){
    console.log(req.url, req.params)
    res.send(ns)
  }) 
})

app.ws('/api/shell', function(client, req){
  // https://stackoverflow.com/a/39233132
  //console.log(req)

  var init = false;
  function openShell(client, info){
    var url = info.server + info.endpoint + '/exec?container=mypod&stdin=1&stdout=1&stderr=1&tty=1&command=bash';
    var protocol = info.protocol;
    var headers = info.headers;
    var opts = {
      headers: headers,
      ca: new Buffer(info.ca, 'base64')
    }

    console.log(url)
    console.log(protocol)
    console.log(headers)
    console.log(opts)

    ws = new WebSocket(url, protocol, opts)
    ws.on('open',  () => { console.log('K8S-SHELL :: Open')})
    ws.on('error', (err) => { console.log('K8S-SHELL :: Error - ', err.message)})
    ws.on('close', (code) => { console.log('K8S-SHELL :: Close - ', code)})
    ws.on('ping', () => { console.log('K8S-SHELL :: Ping')})
    ws.on('pong', () => { console.log('K8S-SHELL :: Pong')})
    ws.on('message', (data) => {
      // https://stackoverflow.com/a/38237610
      var msg = Buffer.from(data.substring(1), 'base64').toString()
      if(msg)
        console.log("K8S-SHELL :: MESSAGE ", data, msg)
      client.send(msg)
    })
  }

  client.on('message', function(msg){
    //console.log(msg);

    if(!init){
      init = true;
      client.send('Try to connect the pod.\r\n') 

      openShell(client, JSON.parse(msg))
      return;
    }

    // https://stackoverflow.com/a/38237610
    var chunk = '0' + Buffer.from(msg + '\n').toString('base64')
    console.log('K8S-SHELL :: SEND ', chunk, msg)
    ws.send(chunk)
  })
})

app.get("/api/shell/info", (req, res) => {
  var info = {
    server: 'wss://192.168.99.100:8443',
    protocol: 'base64.channel.k8s.io',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRlZmF1bHQtdG9rZW4tdjU3ejgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGVmYXVsdCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjcyOGVhZGQ0LThiYzItMTFlOC04Mjc1LTA4MDAyN2MyN2JkNCIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZWZhdWx0OmRlZmF1bHQifQ.kzOVGWXUpJj0SEyhRTIjN2ZHZCCf0JU5NDQraQMQaqHwAzFJqWGF3IfLz77nD6T-cgC01UDtxS7yNJLtKTwataiin8XJQQ3BekgvpGBw_mv66sMmVEa0xiHNGSk3Lrojw7gL6LZFK-AUOZMvrO4AVbf7aSULv5I9ZE5ILxjJ1MwrbVNUmzHCjVA3XiS4W8hWyyJHrXJFVK5W96Qws-lY1QK0gx492tYlT5WYz_DSMe5EqV8DT5ObDG5u2-98t-fmJ3R1QEgU3gcOlgN_F0wKKXbAiCeXdJRffcMiW9a8BdzlKR75G_ViHOP85hTGC1OUmygQrQJrmdCf83iV1sHAOA'
    },
    ca: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1ekNDQWMrZ0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRFNE1EY3hPVEF5TVRJeE1Wb1hEVEk0TURjeE56QXlNVEl4TVZvd0ZURVRNQkVHQTFVRQpBeE1LYldsdWFXdDFZbVZEUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTW1JCmdaRmFtZ0pUSGRCaWl2L2o3R3FhZmY1bzJHN3FRTko2YnAvbVJJU21GejNqTEEzNkxValgrVCszdHBJQndiWGYKWWtqU09LZHdUdlVyT293ZlZyYlI4TmpyYVZGYlFSWHA5Sk9VejN5Y2l4MnU5V24xYXNYTmtKRUFpUjNyWmpITQpEamkrUXhuQUt3M2JEZHlTK2ozcEVpcVJQTFNwSk5qb3pkSlpQRmJZekc2MHg1cmg5b3RYSEZlRlVhU3VvQkNxCnhPRXNCUWVSTTVqR2kzWW4yL24vQ05YYjlpR01WdEowSGhxOWJNS0U3ZzNZcjJhZnNDZ012czZIcVRPOEZuUlAKOTIxWkpTaW1KalJwNXlQaGZIRlk0cERsS1grQWEyejl5V1B1QTY1VkZMTk1qZ1ZGL0RocS8reGRJUjdVQmNoVgo5TmhEYXRKdW1wWXRNYVRZYTBzQ0F3RUFBYU5DTUVBd0RnWURWUjBQQVFIL0JBUURBZ0trTUIwR0ExVWRKUVFXCk1CUUdDQ3NHQVFVRkJ3TUNCZ2dyQmdFRkJRY0RBVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQTBHQ1NxR1NJYjMKRFFFQkN3VUFBNElCQVFCbUNiTHU2RGpyWlFkNmdtQXZRODErT0M4NUtoc2x4MnAyZDkvUmdWMVI4VDVkU0pwWgppMXFiZm83NndpRVFTV3d1QXozcFNDenR1SjlPcUI5bU1pNHFiYkhiRURyVG1GZE9RQlhtenpaNHppb0V2cDJrCkpYZWFhYmdQRCs1bGY5Z0UveU4waUYwTjdML3lJSnUxWEhrMzFjM0t1S3EwUzB0VWFLWWFkY2d0SGJ0THh5Mm4KQVgyOWRwYWdMWFhHZUROZ21kdmxoZU5uZWt4MEdSL0txdmQrbzlhMWtvaU43Q3pLaVMrYVdUaVZRVjNDZUl4dwpVR0U3emdKUEtTdVNBTHJXWlJFUWRhSStXbWNwMzhhSXJwRWJaQ0NnZVFoRzNLUEFWMVdjRnFRMk9MdVdrTjRSCmR3S0hjWGRLOTNSOXRqUUFKVlovOEsvWFVBb3RsZFRLZC9FbAotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg=='
  }

  //console.log(fs.readFileSync('C:/Users/07713/.minikube/ca.crt'))

  res.send(info)
})

app.get("/api/:resource", (req, res) => {
  var kubectl = K8s.kubectl({
    binary: 'kubectl',
    kubeconfig: cluster.getPath(req.params.cluster)
  })
  var kind = kubectl[req.params.resource]
  if(!kind){
  	//ERR!!
  	console.log(req.params)
  	res.send({err:"There is no Kubernetes resource."})
  }

  kind.list().then(function(items){
  	console.log(req.url, req.params)
  	res.send(items)
  })
})

app.get("/api/:resource/:name", (req, res) => {
  console.log('!!!!!', req.url, req.params, req.query)

  var kubectl = K8s.kubectl({
    binary: 'kubectl',
    kubeconfig: cluster.getPath(req.query.cluster)
  })
  cmd = `get ${req.params.resource} ${req.params.name} -n ${req.query.ns} --output=${req.query.type || 'json'}`

  kubectl.command(cmd).then(function(pod){
  	console.log(req.url, req.params)
  	res.send(pod)
  })
})

app.listen(3001, () => console.log("Listening on port 3001!"));