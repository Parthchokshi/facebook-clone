import React, { Component, Fragment } from 'react';
import Header from './components/Header';
import Feed from './components/Feed';

class App extends Component {
	render() {
		return (
			<Fragment>
				<Header/>
				<Feed/>
			</Fragment>
		);
	}
}

export default App;
