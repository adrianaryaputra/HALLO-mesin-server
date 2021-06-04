const mongoose = require('mongoose');

const dataModel = require('./db.model.data')(mongoose);

module.exports = {
    mongoose,
    model:{
        data: dataModel,
    },
}