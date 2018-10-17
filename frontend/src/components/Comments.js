import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/CheckCircle';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

const Panel = styled.div`
	margin: 5px;
`;

const CommentBasePanel = styled.div`
	display: flex;
	width: 100%;
	padding: 10px 0;
	margin: 10px 0;
	background-color: #f6f6f6;
	border-radius: 5px;

`;

const CommentText = styled(Typography)`
	width: 95%;
	padding: 8px 15px 5px 15px;
	flex: 1;
`;

const CommentBase = ({comment, open, anchorEl, handleClick, handleClose, handleDelete, handleEdit}) => (
	<CommentBasePanel>
		<CommentText>
			{comment.text}
			<span style={{ float: 'right', fontSize: 10, color: '#A9A9A9' }}>{moment(comment.created_at).fromNow()}</span>
		</CommentText>
		<Typography style={{ padding: 10, cursor: 'pointer', display: 'inline-block' }} onClick={() => handleEdit(comment)}>
			Edit
		</Typography>
		<Typography style={{ padding: 10, color: red[500], cursor: 'pointer', display: 'inline-block' }} onClick={() => handleDelete(comment.id)}>
			Delete
		</Typography>
	</CommentBasePanel>
);

const RenderComments = (props) => {
	return props.comments.map(comment => {
		return <CommentBase
			key={comment.id}
			comment={comment}
			open={props.open}
			anchorEl={props.anchorEl}
			handleClick={props.handleClick}
			handleClose={props.handleClose}
			handleDelete={props.handleDelete}
			handleEdit={props.handleEdit}
		/>
	});
};

class Comments extends Component {
	constructor(props) {
		super(props);
		this.state = {anchorEl: null, comment: '', comment_id: null, comments: props.comments, post_id: props.post_id };
	}

	handleClick = (event) => {
		this.setState({ anchorEl: event.currentTarget })
	};

	handleClose = () => {
		this.setState({ anchorEl: null })
	};

	onSubmit = (event) => {
		event.preventDefault();
		if(!this.state.comment) {
			return;
		}
		// Edit comment
		if(!this.state.comment_id) {
			axios.post(`http://localhost:4000/comments/${this.state.post_id}/1`, {text: this.state.comment})
				.then(res => this.setState({comments: res.data.data.comments, comment: ''}))
				.catch(err => console.log(err));
		}
		// Create comment
		else {
			axios.put(`http://localhost:4000/comments/${this.state.comment_id}/${this.state.post_id}`, {text: this.state.comment})
				.then(res => this.setState({comments: res.data.data.comments, comment: ''}))
				.catch(err => console.log(err))
				.finally(() => this.setState({ comment_id: null }));
		}
	};

	handleChange = (event) => {
		this.setState({ comment: event.target.value });
	};

	handleEdit = (comment) => {
		this.setState({ comment: comment.text, comment_id: comment.id })
	};

	handleDelete = (comment_id) => {
		axios.delete(`http://localhost:4000/comments/${comment_id}/${this.state.post_id}`)
			.then(res => this.setState({ comments: res.data.data.comments, comment: '' }))
			.catch(err => console.log(err))
			.finally(() => this.handleClose());
	};

	resetTextField = () => {
		this.setState({ comment: '', comment_id: null });
	};

	render() {

		const { anchorEl } = this.state;
		const open = Boolean(anchorEl);

		return(
			<Panel>
				<form noValidate autoComplete="off" onSubmit={this.onSubmit}>
					<TextField
						id={`comment${this.state.post_id}`}
						name="comment"
						fullWidth
						placeholder="Comment here"
						margin="normal"
						value={this.state.comment}
						onChange={this.handleChange}
						InputProps={{
							endAdornment : (<Fragment>
								<InputAdornment position="end">
									<IconButton onClick={this.onSubmit} title="Save">
										<SaveIcon/>
									</IconButton>
								</InputAdornment>
								<InputAdornment position="end">
									<IconButton onClick={this.resetTextField} title="Clear">
										<CloseIcon/>
									</IconButton>
								</InputAdornment>
							</Fragment>)
						}}
					/>
				</form>

				{this.state.comments && this.state.comments.length > 0 &&
				<RenderComments
					comments={this.state.comments}
					open={open}
					anchorEl={this.state.anchorEl}
					handleClick={this.handleClick}
					handleClose={this.handleClose}
					handleDelete={this.handleDelete}
					handleEdit={this.handleEdit}
				/>
				}
			</Panel>
		)
	}

}


export default Comments;
