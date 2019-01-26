const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date
    },
    writers: [String],
    directors: [String],
    actors: [String],
    genres: [String],
    runTime: { type: Number },
    rottenTomatoes: {
        urlKey: { type: String },
        tomatoMeter: { type: Number},
        audienceScore: { type: Number}
    },
    imdb: { 
        imdbId: { type: Number },
        imdbRating: { type: Number }
     },
    movieRating: [{ 
        person: { type: Schema.Types.ObjectId, ref: 'users' },
        rating: { type: Number },
        comment: { type: String }
     }]
});

module.exports = Movie = mongoose.model('movie', MovieSchema);