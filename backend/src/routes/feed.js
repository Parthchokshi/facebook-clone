import express from 'express';
import response from '../util/response';
import {Feed} from '../util/db_helpers';
const feedRouter = express.Router();

feedRouter.get('/', (req, res) => {
	Feed.getAll()
		.then(feed => response(res, {feed}, 200, 'All Feeds'))
		.catch(err => response(res, {}, 500, 'Failed to get all feeds'));
});

export default feedRouter;