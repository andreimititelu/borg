const { v4: uuidv4 } = require('uuid');

module.exports = Object.freeze({
    // SERVER_NAME : uuidv4(), // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    SERVER_NAME : 'SERVER.1',
    HTTP_PORT : process.env.HTTP_PORT || 3001
});
