const schedule = require('node-schedule');
const Token = require('../models/token');


// Función para eliminar tokens expirados
const removeExpiredTokens = async () => {
    try {
        const currentTimestamp = new Date().getTime();
        await Token.destroy({ where: { expires_in: { [Op.lt]: currentTimestamp } } });
        console.log('Tokens expirados eliminados con éxito.');
    } catch (error) {
        console.error('Error al eliminar tokens expirados:', error);
    }
};

// Programar la ejecución de la función de eliminación de tokens expirados una vez al día
schedule.scheduleJob('0 0 0 0 *', removeExpiredTokens);