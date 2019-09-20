import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMovieDetailsFromApi, createMovieNoRedirect, createMovie } from '../../actions/movieActions';
import { getMovieNights } from '../../actions/movieNightActions';
import moment from 'moment';
import './../../App.css';

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieToUpdatetoDB: undefined
        };
    }
    
    componentDidMount = async () => {
        this.props.getMovieDetailsFromApi(this.props.imdbId);
    }

    // TODO: Remove temp
    /*
    onSubmit = async (e)  =>{
        e.preventDefault();
        //console.log(this.state.movieToUpdatetoDB);
        if (this.props.movieDetail && this.props.movieDetail.release_date) {
            var movieDetail = {};
            movieDetail = this.props.movieDetail;
            //console.log(movieDetail);
            //console.log(this.props.movie.movie);
            
            if (this.props.movie.movie && this.props.movie.movie._id) {
                var movieToUpdate = this.props.movie.movie;
                movieToUpdate.genres = movieDetail.genres;

                if (movieDetail.crew) {
                    var crewToAdd = [];
                    movieDetail.crew.forEach((crewMember) => {
                        crewToAdd.push(crewMember.id)
                    });
                    if (crewToAdd.length > 0){
                        movieToUpdate.crew = crewToAdd;
                    }
                }
                if (movieDetail.cast) {
                    var castToAdd = [];
                    movieDetail.cast.forEach((castMember) => {
                        castToAdd.push(castMember.id)
                    });
                    if (castToAdd.length > 0){
                        movieToUpdate.cast = castToAdd;
                    }
                }
                console.log(movieToUpdate);
                this.props.createMovieNoRedirect(movieToUpdate);
            }
        }
    }
    */

    render() {
        var movieDetail = {};
        var formattedYear = '';
        var posterContent;
        var movieNightViewedContent = '';
        var crew = [];
        var crewContent;
        var cast = [];
        var castContent;
        var ratings = [];
        var ratingsContent;
        var genres = [];
        
        if (this.props.movieDetail && this.props.movieDetail.release_date) {

            movieDetail = this.props.movieDetail;
            genres = movieDetail.genres;
            
            // format year
            formattedYear = (moment(movieDetail.release_date).format('YYYY'));

            if (movieDetail.imageBaseUrl && movieDetail.posterSizeL && movieDetail.poster_path) {
                posterContent = (
                    <img src={movieDetail.imageBaseUrl + movieDetail.posterSizeL + movieDetail.poster_path} style={{width: 185}} className={"floatLeft"} alt={movieDetail.title}></img>
                );
            }            

            if (movieDetail.movieNightViewed) {
                movieNightViewedContent = (
                    <div>
                        <p>This movie was viewed on <Link to={`/movieNight/${moment.utc(movieDetail.movieNightViewed.date).format('YYYY-MM-DD')}`}>{moment.utc(movieDetail.movieNightViewed.date).format('dddd, MMMM Do YYYY')}</Link>.</p>
                    </div>
                );
            } else {
                movieNightViewedContent = (
                    <div>
                        <p>This movie has not been viewed yet.</p>
                    </div>
                );
            }
                //<Link to={`/allMovieNights/${host}`}>{host}</Link> 
            // format genres
            var genresString = "";
            if (movieDetail.genres && movieDetail.genres.length > 0) {
                var genreArray = movieDetail.genres;
                genreArray.forEach((genre) => {
                    genresString = genresString + genre.name + ', '
                });
                genresString = genresString.slice(0, -2);
            }

            crew = movieDetail.crew;
            if (crew && crew[0].credit_id) {
                crewContent = (
                    <div>
                        <p>Select Crew:</p>
                        <ListGroup>
                            {crew.map(({ credit_id, name, job }) => (
                                <ListGroupItem key={credit_id}>{name}: {job}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                );
            } else {
                crewContent = (
                    <div>
                        <p>No crew found</p>
                    </div>
                );
            }
            cast = movieDetail.cast;
            if (cast && cast[0].cast_id) {
                castContent = (
                    <div>
                        <p>Select Cast:</p>
                        <ListGroup>
                            {cast.map(({ cast_id, name, character }) => (
                                <ListGroupItem key={cast_id}>{name}: {character}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                );
            } else {
                castContent = (
                    <div>
                        <p>No cast found</p>
                    </div>
                );
            }
            ratings = movieDetail.ratings;
            if (ratings && ratings[0].Source) {
                ratingsContent = (
                    <div>
                        <p>Ratings:</p>
                        <ListGroup>
                            {ratings.map(({ Source, Value }) => (
                                <ListGroupItem>{Source}: {Value}</ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                );
            } else {
                ratingsContent = (
                    <div>
                        <p>No ratings found</p>
                    </div>
                );
            }
        }

        return(
            <div className='movieDetail'>
                <Row>
                    <Col xs="12">
                        <h3>{movieDetail.title} ({formattedYear})</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {posterContent}
                        {movieNightViewedContent}
                        <p>{movieDetail.overview}</p>
                        <p>Runtime: {movieDetail.runtime} minutes</p>
                        <p>Genres: {genresString}</p>
                        {genres.map(({ _id, name }) => (
                            <Link to={`/allMovies/${name}`}>{name} </Link> 
                        ))}
                        <p>Rated: {movieDetail.rated}</p>
                        <p><a href={`https://www.imdb.com/title/${this.props.imdbId}`} target="_blank">IMDB</a> | <a href={`https://www.themoviedb.org/movie/${this.props.movieDetail.tmdbId}`} target="_blank">TMDB</a></p>                        
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        {ratingsContent}
                        {crewContent}
                        {castContent}
                    </Col>
                </Row>
            
                {/* 
                <form onSubmit={this.onSubmit}>                    
                    <input
                    type="submit"
                    value="Submit"
                    className="btn btn-info btn-block mt-4"
                    />
                </form>
                */}
                        
            </div>
        );
        
    }
}

MovieDetail.propTypes = {
    getMovieNights: PropTypes.func.isRequired,
    getMovieDetailsFromApi: PropTypes.func.isRequired,
    movieDetail: PropTypes.object.isRequired,
    imdbId: PropTypes.string,
    movie: PropTypes.object.isRequired,
    movieNight: PropTypes.object
}

const mapStateToProps = (state) => ({
    movie: state.movie,
    movieNight: state.movieNight,
    movieDetail: state.movie.movieDetail
})

export default connect(mapStateToProps, { getMovieNights, getMovieDetailsFromApi, createMovieNoRedirect, createMovie })(MovieDetail);