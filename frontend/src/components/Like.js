import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';
import LikeIcon from '@material-ui/icons/ThumbUp'
import indigo from '@material-ui/core/colors/indigo';
import openSocket from "socket.io-client";
const socket = openSocket('http://localhost:8000');

const Panel = styled.div`
	cursor: pointer;
	display: inline-block;
	padding: 0px 10px;
	margin: 0 0 -20px 0;
`;

const LikeText = styled.p`
	position: relative;
	display: inline-block;
	top: -5px;
	left: 10px;
`;

const LikedText = styled(LikeText)`
	color: ${indigo[500]};
`;


const LikedPanel = ({posts_id, person_id, current_posts_id, liked, toggleLikePost}) => (
	<Panel onClick={() => toggleLikePost(posts_id, person_id)}>
		{liked
			?
			<Fragment>
				<LikeIcon nativeColor={indigo[500]}/>
				<LikedText>Like</LikedText>
			</Fragment>
			:
			<Fragment>
				<LikeIcon/>
				<LikeText>Like</LikeText>
			</Fragment>
		}
	</Panel>
);

class Like extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {['liked'+props.posts_id] : props.liked, current_posts_id: props.posts_id };
		socket.on('likeToggled', (res) => {
			this.setState({ ['liked'+res.posts_id] : res.liked });
		});
	}

	toggleLikePost = (posts_id, person_id) => {
		socket.emit('click_like', { posts_id, person_id });
	};

	render() {

		const { posts_id, person_id } = this.props;
		return (
			<Fragment>
				<LikedPanel
					posts_id={posts_id}
					current_posts_id={this.state.current_posts_id}
					person_id={person_id}
					toggleLikePost={this.toggleLikePost}
					liked={this.state['liked'+posts_id]}
				/>
				<hr/>
			</Fragment>

		)
	}
}

export default Like;