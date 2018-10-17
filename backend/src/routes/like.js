import { Likes } from '../util/db_helpers';

export const toggleLike = (result, client) => {
	console.log(result);
	Likes.toggle(result.posts_id, result.person_id)
		.then(liked => {
			liked.posts_id = result.posts_id;
			client.emit('likeToggled', liked);
		})
		.catch(err => {
			console.log(err);
		});
};

export const getLike = ({ posts_id, person_id }) => {
	Likes.get(posts_id, person_id)
		.then(liked =>liked)
		.catch(err => err);
};


