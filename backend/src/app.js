import http from 'http';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import {toggleLike, getLike} from './routes/like';
import feedRouter from './routes/feed';
import bodyParser from 'body-parser';
import db from './util/db';
import multer from 'multer';
import SocketIO from 'socket.io';

const app = express();

const storage = multer.diskStorage({
	destination: './public/images/uploads',
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const io = new SocketIO();
io.on('connection', (client) => {
	client.on('click_like', function(data) {
		toggleLike(data, client);
	});
});
io.listen(8000);

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.use(logger('dev'));

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

const upload = multer({storage: storage}).single('post_file');

app.use('/feed', feedRouter);
app.use('/posts', upload, postsRouter);
app.use('/comments', commentsRouter);

app.get('/public/images/uploads/:image_name', (req, res) => {
	res.sendFile(path.resolve(__dirname+'/../public/images/uploads/'+req.params.image_name));
});

// Connect to MySQL on start
db.connect(function(err) {
	if (err) {
		console.log('Unable to connect to MySQL.\n'+err);
		process.exit(1)
	} else {
		http.createServer(app).listen(4000, function() {
			console.log('Express server started on port 4000...')
		})
	}
});