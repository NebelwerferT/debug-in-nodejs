const router = require('express').Router();
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Game = require('../models/game')(sequelize, DataTypes);

router.get('/all', (req, res) => {
    Game.findAll({
        where: {
            owner_id: req.user.id,
        }
    })
        .then(
            (games) => {
                res.status(200).json({
                    games: games,
                    message: "Data fetched.",
                });
            },

            () => {
                res.status(500).json({
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
                    res.status(200).json({
                        game: game,
                    });

                } else {
                    res.status(404).json({
                        message: "Game not found.",
                    });
                }
            },

            () => {
                res.status(500).json({
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
                res.status(200).json({
                    game: game,
                    message: "Game created.",
                });
            },

            (err) => {
                res.status(500).json({
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
                res.status(200).json({
                    updatedGame: updatedGame[1],
                    message: "Successfully updated.",
                });
            },

            (err) => {
                if (err.message.includes("null")) {
                    res.status(404).json({
                        message: "Game not found.",
                    });
                } else {
                    res.status(500).json({
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
                                res.status(200).json({
                                    deletedGame: deletedGame,
                                    message: "Successfully deleted",
                                });
                            },

                            (err) => {
                                res.status(500).json({
                                    error: err.message,
                                });
                            }
                        );
                } else {
                    res.status(404).json({
                        message: "Game not found.",
                    });
                }
            },

            () => {
                res.status(500).json({
                    message: "Data not found.",
                });
            }
        );
});

module.exports = router;