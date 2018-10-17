'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Feed = exports.Likes = exports.Comments = exports.Posts = undefined;

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Posts = exports.Posts = {
	getAll: function getAll() {
		return new Promise(function (resolve, reject) {
			_db2.default.query('SELECT * FROM Posts', function (err, rows) {
				if (err) {
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	get: function get(id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('SELECT * FROM Posts WHERE id = ' + id, function (err, rows) {
				if (err) {
					reject(err);
				}
				resolve(rows[0]);
			});
		});
	},
	create: function create(post) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('INSERT INTO Posts SET ?', post, function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(Feed.getAll());
			});
		});
	},
	update: function update(id, post) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('UPDATE Posts SET ? WHERE id = ?', [post, id], function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(Posts.get(id));
			});
		});
	},
	delete: function _delete(id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('DELETE FROM Posts WHERE id = ' + id, function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(Feed.getAll());
			});
		});
	}
};

var Comments = exports.Comments = {
	getAll: function getAll(posts_id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('SELECT * FROM Comments where posts_id IN (?)', [posts_id], function (err, rows) {
				if (err) {
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	get: function get(post_id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('SELECT * FROM Comments where posts_id = ?', post_id, function (err, rows) {
				if (err) {
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	create: function create(posts_id, person_id, text) {
		var comment = { posts_id: posts_id, person_id: person_id, text: text };
		return new Promise(function (resolve, reject) {
			_db2.default.query('INSERT INTO Comments SET ?', comment, function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(Comments.get(posts_id));
			});
		});
	},
	update: function update(posts_id, id, text) {
		var comment = { text: text };
		return new Promise(function (resolve, reject) {
			_db2.default.query('UPDATE Comments SET ? WHERE id = ? AND posts_id = ?', [comment, id, posts_id], function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(Comments.getAll(posts_id));
			});
		});
	},
	delete: function _delete(posts_id, id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('DELETE FROM Comments WHERE posts_id = ? AND id = ?', [posts_id, id], function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(Comments.getAll(posts_id));
			});
		});
	}
};

var Likes = exports.Likes = {
	getAll: function getAll(posts_id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('SELECT * FROM Likes WHERE posts_id IN (?)', [posts_id], function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	get: function get(posts_id, person_id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('SELECT * FROM Likes WHERE posts_id = ? AND person_id = ?', [posts_id, person_id], function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	remove: function remove(posts_id, person_id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('DELETE FROM Likes WHERE posts_id = ? AND person_id = ?', [posts_id, person_id], function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	insert: function insert(posts_id, person_id) {
		return new Promise(function (resolve, reject) {
			_db2.default.query('INSERT INTO Likes SET ?', { posts_id: posts_id, person_id: person_id }, function (err, rows) {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	toggle: function toggle(posts_id, person_id) {
		return new Promise(function (resolve, reject) {
			var liked = false;
			Likes.get(posts_id, person_id).then(function (data) {
				if (data.length) {
					liked = false;
					return Likes.remove(posts_id, person_id);
				}
				liked = true;
				return Likes.insert(posts_id, person_id);
			}).then(function () {
				return resolve({ liked: liked });
			}).catch(function (err) {
				return reject(err);
			});
		});
	}
};

var Feed = exports.Feed = {
	getAll: function getAll() {
		return new Promise(function (resolve, reject) {
			var posts = [],
			    comments = [],
			    likes = [],
			    posts_id = [];
			Posts.getAll().then(function (db_posts) {
				posts = db_posts;
				if (posts.length) {
					posts_id = posts.map(function (post) {
						return post.id;
					});
					return Comments.getAll(posts_id);
				}
				resolve([]);
				throw new Error('No posts');
			}).then(function (db_comments) {
				comments = db_comments;
				return Likes.getAll(posts_id);
			}).then(function (db_likes) {
				likes = db_likes;
				var feeds = [];
				posts.forEach(function (post) {
					var new_feed = {};
					new_feed.post = post;
					new_feed.post.comments = comments.filter(function (comment) {
						return comment.posts_id === post.id;
					});
					new_feed.post.likes = likes.filter(function (like) {
						return like.posts_id === post.id;
					});
					feeds.push(new_feed);
				});
				var sortedFeeds = feeds.sort(function (feed1, feed2) {
					return new Date(feed1.post.created_at).getTime() < new Date(feed2.post.created_at).getTime();
				});
				resolve(sortedFeeds);
			}).catch(function (err) {
				return reject(err);
			});
		});
	}
};