require('dotenv').config();
const config = require('config');

async function startDaemon() {
  try {
    console.log('Iniciando el servicio...');

    if (config.get('features.useMariaDB')) {
        console.log("Revisando la base de datos MariaDB...");
        const { checkDatabase } = require('./audit-event/checkDatabase');
        console.log('Iniciando las revision periodica.');
        await checkDatabase();
        process.exit(1);
      }

    } catch (error) {
        console.error('Error starting the daemon:', error);
        process.exit(1);
    }
}

startDaemon();
