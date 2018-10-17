"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _response = require("../util/response");

var _response2 = _interopRequireDefault(_response);

var _db_helpers = require("../util/db_helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commentsRouter = _express2.default.Router();

commentsRouter.get('/:post_id', function (req, res) {
	_db_helpers.Comments.getAll(req.params.post_id).then(function (comments) {
		return (0, _response2.default)(res, { comments: comments }, 200, "Successfully fetched comments.");
	}).catch(function (err) {
		return (0, _response2.default)(res, {}, 500, "Failed to get comments for Post No. " + req.params.post_id);
	});
});

commentsRouter.post('/:posts_id/:person_id', function (req, res) {
	_db_helpers.Comments.create(req.params.posts_id, req.params.person_id, req.body.text).then(function (comments) {
		return (0, _response2.default)(res, { comments: comments }, 200, 'Successfully created comment');
	}).catch(function (err) {
		return (0, _response2.default)(res, {}, 500, 'Failed to create comment.');
	});
});

commentsRouter.put('/:comment_id/:posts_id', function (req, res) {
	_db_helpers.Comments.update(req.params.posts_id, req.params.comment_id, req.body.text).then(function (comments) {
		return (0, _response2.default)(res, { comments: comments }, 200, 'Successfully updated comment');
	}).catch(function (err) {
		return (0, _response2.default)(res, {}, 500, 'Failed to update comment.');
	});
});

commentsRouter.delete('/:comment_id/:posts_id', function (req, res) {
	_db_helpers.Comments.delete(req.params.posts_id, req.params.comment_id).then(function (comments) {
		return (0, _response2.default)(res, { comments: comments }, 200, 'Successfully deleted comment');
	}).catch(function (err) {
		return (0, _response2.default)(res, {}, 500, 'Failed to delete comment.');
	});
});

exports.default = commentsRouter;