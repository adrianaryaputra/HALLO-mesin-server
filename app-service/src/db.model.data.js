module.exports = function(db){

    let dataSchema = new db.Schema({
        AI: [Number],
        DI: [Number],
        TEMP: [Number],
        TIMESTAMP: Date,
    });
    
    let dataBucketSchema = new db.Schema({
        NAMA_MESIN: String,
        DATE_FROM: Date,
        DATE_TO: Date,
        DATA_COUNT: Number,
        DATA: [dataSchema],
    });

    return db.model('machine-data', dataBucketSchema)

}