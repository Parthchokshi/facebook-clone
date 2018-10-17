'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getLike = exports.toggleLike = undefined;

var _db_helpers = require('../util/db_helpers');

var toggleLike = exports.toggleLike = function toggleLike(result, client) {
	console.log(result);
	_db_helpers.Likes.toggle(result.posts_id, result.person_id).then(function (liked) {
		liked.posts_id = result.posts_id;
		client.emit('likeToggled', liked);
	}).catch(function (err) {
		console.log(err);
	});
};

var getLike = exports.getLike = function getLike(_ref) {
	var posts_id = _ref.posts_id,
	    person_id = _ref.person_id;

	_db_helpers.Likes.get(posts_id, person_id).then(function (liked) {
		return liked;
	}).catch(function (err) {
		return err;
	});
};