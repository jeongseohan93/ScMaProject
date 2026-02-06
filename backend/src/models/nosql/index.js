const fs = require('fs');
const path = require('path');

const mongoModels = {};

fs.readdirSync(__dirname).filter((file) => file !== 'index.js' && file.endsWith('.js')).forEach((file) => {
    const modelName = path.basename(file, '.js');
    mongoModels[modelName] = require(path.join(__dirname, file));
});

module.exports = mongoModels;