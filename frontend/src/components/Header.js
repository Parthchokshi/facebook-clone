import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
	root: {
		flexGrow: 1,
	},
	flex: {
		flexGrow: 1,
		textAlign: 'center',
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
};

const Header = (props) => (
	<div className={props.classes.root}>
		<AppBar position="static">
			<Toolbar>
				<Typography variant="title" color="inherit" className={props.classes.flex}>
					Just another Social Media
				</Typography>
				{/*<Button color="inherit">Sign Up</Button>*/}
				{/*<Button color="inherit">Login</Button>*/}
			</Toolbar>
		</AppBar>
	</div>
);

Header.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);