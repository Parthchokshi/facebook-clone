import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import DeleteIcon from '@material-ui/icons/Delete'
import red from '@material-ui/core/colors/red';

const Panel = styled.div`
	margin: 5px;
`;

const Delete = styled(DeleteIcon)`
	position: relative;
	cursor: pointer;
	right: 15px;
	top: 9px;
	float:right;
`;

class ContentMedia extends Component {

	constructor(props) {
		super(props);
		this.state = {open: false}
	}

	handleOpenDialog = () => this.setState({open: true});

	handleClose = () => this.setState({open: false});

	render() {
		const { post, deletePost } = this.props;
		return(
			<Panel>
				<Grid container style={{margin: 10}}>
					<Grid item xs={10} sm={10} md={10}>
						<Typography style={{fontSize: 18}}>{post.text}</Typography>
						<Typography style={{fontSize: 10, color: "#A9A9A9", marginBottom: 5}}>
							{moment(post.created_at).fromNow()}
						</Typography>
					</Grid>
					<Grid item xs={2} sm={2} md={2}>
						<Delete nativeColor={red[600]} onClick={() => deletePost(post.id)}/>
					</Grid>
				</Grid>
				{post.image_url &&
				<Fragment>
					<CardMedia onClick={this.handleOpenDialog} style={{cursor: 'pointer', margin: '-5px', height: 0, paddingTop: '56.25%'}} image={post.image_url}
										 title="Media"/>
					<Dialog
						open={this.state.open}
						onClose={this.handleClose}
					>
						<img src={post.image_url} width="100%" height="100%" title="Media"/>
					</Dialog>
				</Fragment>
				}
			</Panel>
		);
	}
}

export default ContentMedia;
