const express = require('express');
const app = express();
const io = require('socket.io')(8080);
const Twig = require('twig');
const twig = Twig.twig;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const qs = require('querystring')

//setting middlewares
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io-client/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.set('view engine', 'twig');
app.use(cookieParser());
app.use(bodyParser.json())

//routes
app.get('/', (req, res) => {
    if (req.cookies.username) {
        username = req.cookies.username;
        isNotConnected = false
    } else {
        username = null;
        isNotConnected = true
    }
    console.log("User " + username + " not connected : " + isNotConnected)

    res.render(__dirname + '/index.twig', {
        username: username,
        isNotConnected: isNotConnected
    })
});


app.post('/login', (req, res) => {
    let body = '';
    let post;
    req.on('data', (data) => {
        body += data;
        console.log(body)
    });
    req.on('end', () => {
        post = qs.parse(body);
        console.log(post.username);
        res.cookie('username', post.username);
        res.sendStatus(201)
    });
});


//sockets
io.on('connection', (socket) => {
    console.log('listener connected');
    socket.on('chat message', (msg) => {
            let content = msg.username + ": " + msg.content;
            io.emit('chat message', content)
        }
    );
});

//server itself
app.listen(80, () => console.log('SelFish listening on port 3000!'))