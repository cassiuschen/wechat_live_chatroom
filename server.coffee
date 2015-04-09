express = require 'express'
app = express()
server = require('http').Server(app)
io = require('socket.io')(server)
redisServer = require 'redis'
redis = redisServer.createClient(6379, '127.0.0.1', {})



# Configure
app.engine 'jade', require('jade').__express
app.set('views', './views')
app.set('view engine', 'jade')

app.use express.static('./public')

redis.set
# Global Filter
server.listen 8080, ->
	console.log "Start Listen #{server.address()}:8080"

app.use (req,res,next) ->
	console.log "==> GET #{req.protocol}://#{req.hostname}#{req.path} from #{req.ip} at #{Date.now()}"
	next()

redis.on 'ready', (err) ->
	console.log "Redis is ready!"

redis.on 'error', (err) ->
	console.log "Redis ERROR: #{err}"

app.get '/', (req, res) ->
	res.render 'index',
		title: "hello world"
		msg: "Hello World!!!"

app.get '/message', (req, res) ->
	if req.query.content
		io.emit('message', req.query.content)
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
		io.emit('message', msg)

