import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {email: '', password: ''};
	}

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = event => {
		event.preventDefault();
		axios.post('http://localhost:4000/login', {email: this.state.email, password: this.state.password});
	};

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<FormControl style={{ display: 'block' }}>
					<InputLabel htmlFor="email">Email</InputLabel>
					<Input name="email" onChange={this.handleChange}/>
				</FormControl>
				<FormControl style={{ display: 'block' }}>
					<InputLabel htmlFor="password">Password</InputLabel>
					<Input name="password" type="password" onChange={this.handleChange}/>
				</FormControl>
				<Button type="submit" variant="outlined">Login</Button>
			</form>
		);
	}
}

export default Login;
