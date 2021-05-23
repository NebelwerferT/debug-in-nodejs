const router = require('express').Router();
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Game = require('../models/game')(sequelize, DataTypes);
const { StatusCodes } = require('http-status-codes');

router.get('/all', (req, res) => {
    Game.findAll({
        where: {
            owner_id: req.user.id,
        }
    })
        .then(
            (games) => {
                res.status(StatusCodes.OK).json({
                    games: games,
                    message: "Data fetched.",
                });
            },

            () => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Data not found",
                });
            }
        );
});

router.get('/:id', (req, res) => {
    Game.findOne({
        where: {
            id: req.params.id,
            owner_id: req.user.id,
        }
    })
        .then(
            (game) => {
                if (game) {
                    res.status(StatusCodes.OK).json({
                        game: game,
                    });

                } else {
                    res.status(StatusCodes.NOT_FOUND).json({
                        message: "Game not found.",
                    });
                }
            },

            () => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Data not found.",
                });
            }
        );
});

router.post('/create', (req, res) => {
    Game.create({
        title: req.body.game.title,
        owner_id: req.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played,
    })
        .then(
            (game) => {
                res.status(StatusCodes.OK).json({
                    game: game,
                    message: "Game created.",
                });
            },

            (err) => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: err.message,
                });
            }
        );
});

router.put('/update/:id', (req, res) => {
    Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played,
    }, {
        returning: true,
        plain: true,
        where: {
            id: req.params.id,
            owner_id: req.user.id,
        }
    })
        .then(
            (updatedGame) => {
                res.status(StatusCodes.OK).json({
                    updatedGame: updatedGame[1],
                    message: "Successfully updated.",
                });
            },

            (err) => {
                if (err.message.includes("null")) {
                    res.status(StatusCodes.NOT_FOUND).json({
                        message: "Game not found.",
                    });
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        message: err.message,
                    });
                }
            }
        );
});

router.delete('/remove/:id', (req, res) => {
    Game.findOne({
        where: {
            id: req.params.id,
            owner_id: req.user.id,
        }
    })
        .then(
            (deletedGame) => {
                if (deletedGame) {
                    Game.destroy({
                        where: {
                            id: req.params.id,
                            owner_id: req.user.id,
                        }
                    })
                        .then(
                            () => {
                                res.status(StatusCodes.OK).json({
                                    deletedGame: deletedGame,
                                    message: "Successfully deleted",
                                });
                            },

                            (err) => {
                                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                    error: err.message,
                                });
                            }
                        );
                } else {
                    res.status(StatusCodes.NOT_FOUND).json({
                        message: "Game not found.",
                    });
                }
            },

            () => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Data not found.",
                });
            }
        );
});

module.exports = router;