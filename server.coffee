express = require 'express'
app = express()
server = require('http').Server(app)
io = require('socket.io')(server)
#redisServer = require 'redis'
#redis = redisServer.createClient(6379, '127.0.0.1', {})
mongodb = require 'mongodb'
monk = require 'monk'
db = monk 'localhost:27017/nodetest'
messageCollection = db.get 'message_collection'

data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
]

# Configure
app.engine 'jade', require('jade').__express
app.set('views', './views')
app.set('view engine', 'jade')
app.use express.static('./public')


# Global Filter
server.listen 8080, ->
  console.log "Start Listen #{server.address()}:8080"

app.use (req,res,next) ->
  console.log "==> GET #{req.protocol}://#{req.hostname}#{req.path} from #{req.ip} at #{Date.now()}"
  next()

#redis.on 'ready', (err) ->
#  console.log "Redis is ready!"

#redis.on 'error', (err) ->
#  console.log "Redis ERROR: #{err}"


# Route
app
  .get '/', (req, res) ->
    res.render 'index',
      title: "hello world"
      msg: "Hello World!!!"
  .get '/messages.json', (req, res) ->
    messageCollection.find {}, {}, (err, docs) ->
      res.json docs
  .get '/message', (req, res) ->
    if req.query.content
      io.emit('message', {author: 'from server', text: req.query.content})
      console.log 'Add Message:' + req.query.content
      res.status(200).end()
    else
      res.status(400).end()

io.on 'connection', (socket) ->
  console.log 'Login a User'
  socket.on 'disconnect', ->
    console.log 'User sign out!'

  socket.on 'message', (msg) ->
    console.log "MESSAGE: #{msg}"
    #redis.lpush("messages", {"author":"#{msg.author || '某人'}", "text":"#{msg.text}"}, redisServer.print)
    messageCollection.insert msg, (err, _) ->
      if (err)
        console.error 'Failed when insert data into Mongodb'
    io.emit('message', msg)
    #redis.lrange "messages", 0, -1, (err, replies) ->
    #  console.log replies.length + " messages:"
    #  replies.forEach (reply, i) ->
    #      console.log("    " + i + ": " + reply)


