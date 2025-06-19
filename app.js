const env = require('dotenv').config();
const PORT = env.parsed.PORT ? env.parsed.PORT : 3000;
const HOST = env.parsed.HOST ? env.parsed.HOST : 'localhost';
const path = require('path');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('./utils/passport');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const connectToDB = require('./utils/connectDB');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
const advertisementRouter = require('./routes/advertismentsRouter');
const sessionparam = {
    secret: 'hghtyNN23h',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
    resave: true,
    saveUninitialized: true
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(
  session(sessionparam)
);
app.use(express.static(path.join(__dirname, process.env.STATIC_FOLDER)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', userRouter);
app.use('/api', advertisementRouter);
app.use('/chat', chatRouter);
server.listen(PORT);
console.log(`server started at: \n http://${HOST}:${PORT}`);
connectToDB();

io.engine.use(session(sessionparam));
io.use((socket, next) => passport.initialize()(socket.request, {}, next));
io.use((socket, next) => passport.session()(socket.request, {}, next));

io.on('connection', (socket) => {
    const clientId = socket.id;
    console.log(socket.id)
    socket.on("getHistory", async (id) => {
      console.log('test')
	  });
})

