const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    time: Array
});

// eventSchema.statics.mostRecent = async function() { ////  если будет нужно показывать пять событий
//     return this.find().sort('createdAt').limit(5).exec();
// }

module.exports = mongoose.model('Event', eventSchema);
