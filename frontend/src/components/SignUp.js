import React, {Component} from "react";
import Card from "@material-ui/core/Card";
import FormCntrl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import styled from 'styled-components';

const FormControl = styled(FormCntrl)`
	margin: 10px;
`;


class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {first_name: '', last_name: '', email: '', password: ''};
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value })
	};

	handleOnSubmit = (event) => {
		event.preventDefault();
		axios.post(`http://localhost:4000/signup`, {person: this.state})
			.then()
			.catch();
	};

	render() {
		return (
			<Card square style={{ padding: 30 }}>
				<form onSubmit={this.handleOnSubmit} autoComplete="off">
					<FormControl style={{ display: 'block', margin: 10 }}>
						<InputLabel htmlFor="first_name">First Name</InputLabel>
						<Input id="first_name" style={{ width: 400 }} value={this.state.first_name} onChange={this.handleChange}/>
					</FormControl>
					<FormControl style={{ display: 'block', margin: 10 }}>
						<InputLabel htmlFor="last_name">Last Name</InputLabel>
						<Input id="last_name" style={{ width: 400 }} value={this.state.last_name} onChange={this.handleChange}/>
					</FormControl>
					<FormControl style={{ display: 'block', margin: 10 }}>
						<InputLabel htmlFor="email">Email</InputLabel>
						<Input type="email" id="email" style={{ width: 400 }} value={this.state.email} onChange={this.handleChange}/>
					</FormControl>
					<FormControl style={{ display: 'block', margin: 10 }}>
						<InputLabel htmlFor="password">Password</InputLabel>
						<Input type="password" autoComplete="off" id="password" style={{ width: 400 }} value={this.state.password} onChange={this.handleChange}/>
					</FormControl>
					<Button type="submit" variant="outlined" style={{ margin: 10 }}>Create account</Button>
				</form>
			</Card>
		);
	}

}

export default SignUp;