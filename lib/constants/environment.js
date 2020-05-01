const { v4: uuidv4 } = require('uuid');

module.exports = Object.freeze({
    BORG_ID : uuidv4(), // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    BORG_NAME : 'BORG.1',
    HTTP_PORT : process.env.HTTP_PORT || 3001,
    CHANNELS : {
        TEST : "TEST"
    }
});
