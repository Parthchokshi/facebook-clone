import React  from 'react';
import ContentMedia from './ContentMedia';
import Like from './Like';
import Comments from './Comments';
import Card from '@material-ui/core/Card';

const Posts = ({ feed, deletePost }) => (
	<Card style={{ margin: '25px 0'}} square>
		<ContentMedia post={feed.post} deletePost={deletePost} />
		<Like liked={feed.post.likes.length > 0} posts_id={feed.post.id} person_id={feed.post.person_id} />
		<Comments post_id={feed.post.id} comments={feed.post.comments} />
	</Card>
);

export default Posts;
