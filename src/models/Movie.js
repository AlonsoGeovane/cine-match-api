import { DataTypes } from 'sequelize';
import { database } from '../config/database.js';

export const Movie = database.define('Movie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'release_date'
    },
    title: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    overview: {
        type: DataTypes.STRING(350),
        allowNull: false
    },
    voteAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'vote_average'
    },
    originalLanguage: {
        type: DataTypes.STRING(3),
        allowNull: false,
        field: 'original_language'
    },
    genre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    posterUrl: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'poster_url'
    }
}, {
    tableName: 'moviedb',
    timestamps: false
});