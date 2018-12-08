import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles/';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const style = {
	form: {
		width: '100%',
		margin: '0 auto',
		display: 'flex',
		paddingTop: 20,
	},
	formControl : {
		margin: '0 auto',
		width: 500,
	},
	button: {
		width: 200,
		margin: '10px 0',
	}
};

class CreatePost extends Component {

	constructor(props) {
		super(props);
		this.state = {post: '', selectedFile: null, resetFileInput: new Date()};
	}

	handleChange = event => {
		this.setState({post: event.target.value})
	};

	handleFileChange = event => {
		this.setState({selectedFile: event.target.files[0]})
	};

	handleSubmit = event => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('text', this.state.post);
		if(this.state.selectedFile) {
			formData.append('post_file', this.state.selectedFile, this.state.selectedFile.name);
		}
		axios.post('http://localhost:4000/posts', formData)
			.then(res => {
				this.setState({ post: '', resetFileInput: new Date() });
				return this.props.updatePosts(res.data.data.feed)
			})
			.catch(err => console.log(err));
	};

	render() {
		const { classes } = this.props;
		return (
			<form onSubmit={this.handleSubmit} className={classes.form} encType="multipart/form-data">
				<FormControl className={classes.formControl}>
					<InputLabel htmlFor="new_post">What's on your mind?</InputLabel>
					<Input type="text" autoComplete="off" id="text" name="text" value={this.state.post} onChange={this.handleChange}/>
					<Input type="file" name="new_post_file" key={this.state.resetFileInput} onChange={this.handleFileChange} />
					<Button type="submit" disabled={!this.state.post} variant="outlined" className={classes.button}>Create Post</Button>
				</FormControl>
			</form>
		);
	}

}

export default withStyles(style)(CreatePost);
