const Sequelize = require('sequelize').Sequelize;

const sequelizeInstance = new Sequelize(process.env.DB_Connection, {logging: false});

module.exports = {
    db: sequelizeInstance,
	//MW: temporarily change the result to make it compliant with the old pg.pool.query() code.
    query: async (command, params) => {
		return new Promise( (resolve, reject) => {
			sequelizeInstance.query(command, {bind: params})
			.then((res) => {
				resolve({rows: res[0], rowCount: res[1].rowCount});
			})
			.catch((err) => {return reject(err)});
		});
	}
};