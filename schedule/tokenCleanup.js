const schedule = require('node-schedule');
const Token = require('../models/Token');


const removeExpiredTokens = async () => {
    try {
        const currentTimestamp = new Date().getTime();
        await Token.destroy({ where: { expires_in: { [Op.lt]: currentTimestamp } } });
        console.log('Tokens expirados eliminados con éxito.');
    } catch (error) {
        console.error('Error al eliminar tokens expirados:', error);
    }
};


schedule.scheduleJob('0 0 * * *', removeExpiredTokens);