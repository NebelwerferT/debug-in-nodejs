const router = require('express').Router();
const sequelize = require('../db');
const Sequelize = require('sequelize');
const Game = require('../models/game')(sequelize, Sequelize.DataTypes);

router.get('/all', (req, res) => {
    Game.findAll({ where: { owner_id: req.user.id } })
        .then(
            function findSuccess(games) {
                res.status(200).json({
                    games: games,
                    message: "Data fetched."
                })
            },

            function findFail() {
                res.status(500).json({
                    message: "Data not found"
                })
            }
        )
})

router.get('/:id', (req, res) => {
    Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
        .then(
            function findSuccess(game) {
                if (game) {
                    res.status(200).json({
                        game: game
                    })
                }
                else {
                    res.status(404).json({
                        message: "Game not found."
                    })
                }
            },

            function findFail() {
                res.status(500).json({
                    message: "Data not found."
                })
            }
        )
})

router.post('/create', (req, res) => {
    Game.create({
        title: req.body.game.title,
        owner_id: req.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    })
        .then(
            function createSuccess(game) {
                res.status(200).json({
                    game: game,
                    message: "Game created."
                })
            },

            function createFail(err) {
                res.status(500).send(err.message)
            }
        )
})

router.put('/update/:id', (req, res) => {
    Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    },
        {
            returning: true,
            plain: true,
            where: {
                id: req.params.id,
                owner_id: req.user.id
            }
        })
        .then(
            function updateSuccess(updatedGame) {
                if (updatedGame) {
                    res.status(200).json({
                        updatedGame: updatedGame[1],
                        message: "Successfully updated."
                    })
                }
                else {
                    res.status(404).json({
                        message: "Game not found."
                    })
                }
            },

            function updateFail(err) {
                res.status(500).json({
                    message: err.message
                })
            }

        )
})

router.delete('/remove/:id', (req, res) => {
    Game.findOne({
        where: {
            id: req.params.id, owner_id: req.user.id
        }
    })
        .then(
            function findSuccess(deletedGame) {
                if (deletedGame) {
                    Game.destroy({
                        where: {
                            id: req.params.id,
                            owner_id: req.user.id
                        }
                    })
                        .then(
                            function deleteSuccess() {
                                res.status(200).json({
                                    deletedGame: deletedGame,
                                    message: "Successfully deleted"
                                })
                            },

                            function deleteFail(err) {
                                res.status(500).json({
                                    error: err.message
                                })
                            }
                        );
                }
                else {
                    res.status(404).json({
                        message: "Game not found."
                    })
                }
            },
            function findFail() {
                res.status(500).json({
                    message: "Data not found."
                })
            }
        );
});

module.exports = router;