import db from './db';

export const Posts = {
	getAll: () => {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM Posts', (err, rows) => {
				if(err) {
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	get: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM Posts WHERE id = ${id}`, (err, rows) => {
				if(err) {
					reject(err);
				}
				resolve(rows[0]);
			});
		});
	},
	create: (post) => {
		return new Promise((resolve, reject) => {
			db.query(`INSERT INTO Posts SET ?`, post, (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(Feed.getAll());
			});
		});
	},
	update: (id, post) => {
		return new Promise((resolve, reject) => {
			db.query(`UPDATE Posts SET ? WHERE id = ?`,[post,id], (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(Posts.get(id));
			});
		});


	},
	delete: (id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM Posts WHERE id = ${id}`, (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(Feed.getAll());
			})
		});
	}
};

export const Comments = {
	getAll: (posts_id) => {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM Comments where posts_id IN (?)', [posts_id], (err, rows) => {
				if(err) {
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	get: (post_id) => {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM Comments where posts_id = ?', post_id, (err, rows) => {
				if(err) {
					reject(err);
				}
				resolve(rows);
			});
		});
	},
	create: (posts_id, person_id, text) => {
		let comment = {posts_id, person_id, text};
		return new Promise((resolve, reject) => {
			db.query(`INSERT INTO Comments SET ?`, comment, (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(Comments.get(posts_id));
			});
		});
	},
	update: (posts_id, id, text) => {
		let comment = { text };
		return new Promise((resolve, reject) => {
			db.query(`UPDATE Comments SET ? WHERE id = ? AND posts_id = ?`,[comment, id, posts_id], (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(Comments.getAll(posts_id));
			});
		});
	},
	delete: (posts_id, id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM Comments WHERE posts_id = ? AND id = ?`, [posts_id, id], (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(Comments.getAll(posts_id));
			})
		});
	}
};

export const Likes = {
	getAll: (posts_id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM Likes WHERE posts_id IN (?)`, [posts_id], (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			})
		});
	},
	get: (posts_id, person_id) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM Likes WHERE posts_id = ? AND person_id = ?`, [posts_id, person_id], (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			})
		});
	},
	remove: (posts_id, person_id) => {
		return new Promise((resolve, reject) => {
			db.query(`DELETE FROM Likes WHERE posts_id = ? AND person_id = ?`, [posts_id, person_id], (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			})
		});
	},
	insert: (posts_id, person_id) => {
		return new Promise((resolve, reject) => {
			db.query(`INSERT INTO Likes SET ?`, {posts_id, person_id}, (err, rows) => {
				if(err) {
					console.log(err);
					reject(err);
				}
				resolve(rows);
			})
		});
	},
	toggle: (posts_id, person_id) => {
		return new Promise((resolve, reject) => {
			let liked = false;
			Likes.get(posts_id, person_id)
				.then(data => {
					if (data.length) {
						liked = false;
						return Likes.remove(posts_id, person_id);
					}
					liked = true;
					return Likes.insert(posts_id, person_id);
				})
				.then(() => resolve({liked}))
				.catch(err => reject(err));
		});
	},
};

export const Feed = {
	getAll: () => {
		return new Promise((resolve, reject) => {
			let posts = [], comments = [], likes = [], posts_id = [];
			Posts.getAll()
				.then(db_posts => {
					posts = db_posts;
					if(posts.length) {
						posts_id = posts.map(post => post.id);
						return Comments.getAll(posts_id);
					}
					resolve([]);
					throw new Error('No posts');
				})
				.then(db_comments => {
					comments = db_comments;
					return Likes.getAll(posts_id);
				})
				.then(db_likes => {
					likes = db_likes;
					let feeds = [];
					posts.forEach(post => {
						let new_feed = {};
						new_feed.post = post;
						new_feed.post.comments = comments.filter(comment => comment.posts_id === post.id);
						new_feed.post.likes = likes.filter(like => like.posts_id === post.id);
						feeds.push(new_feed);
					});
					const sortedFeeds = feeds.sort((feed1, feed2) => new Date(feed1.post.created_at).getTime() < new Date(feed2.post.created_at).getTime());
					resolve(sortedFeeds);
				})
				.catch(err => reject(err));
		});
	}
};