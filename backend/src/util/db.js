import mysql from 'mysql';

// Enter your user and password for the database
const connectionConfig = {
	host: 'localhost',
	user: '',
	password: '',
	database: 'social_media',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};

const connection = mysql.createConnection(connectionConfig);

export default connection;
