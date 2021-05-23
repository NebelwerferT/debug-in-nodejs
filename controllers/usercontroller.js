const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const User = require('../models/user')(sequelize, DataTypes);
const { StatusCodes } = require('http-status-codes');

router.post('/signup', (req, res) => {
    User.findOne({
        where: {
            username: req.body.user.username,
        }
    })
        .then(user => {
            if (!user) {
                User.create({
                    full_name: req.body.user.full_name,
                    username: req.body.user.username,
                    passwordHash: bcrypt.hashSync(req.body.user.password, 10),
                    email: req.body.user.email,
                })
                    .then(
                        (user) => {
                            let token = jwt.sign(
                                {
                                    id: user.id,
                                },
                                'lets_play_sum_games_man',
                                {
                                    expiresIn: (60 * 60 * 24),
                                }
                            );
                            res.status(StatusCodes.OK).json({
                                user: user,
                                token: token,
                            })
                        },

                        (err) => {
                            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                                error: err.message,
                            });
                        }
                    );
            } else {
                res.status(StatusCodes.CONFLICT).json({
                    error: "A user with this username already exists.",
                });
            }
        });
});

router.post('/signin', (req, res) => {
    User.findOne({
        where: {
            username: req.body.user.username,
        }
    })
        .then(user => {
            if (user) {
                bcrypt.compare(
                    req.body.user.password,
                    user.passwordHash,
                    (err, matches) => {
                        if (matches) {
                            let token = jwt.sign(
                                {
                                    id: user.id,
                                },
                                'lets_play_sum_games_man',
                                {
                                    expiresIn: (60 * 60 * 24),
                                }
                            );
                            res.json({
                                user: user,
                                message: "Successfully authenticated.",
                                sessionToken: token,
                            });
                        } else {
                            res.status(StatusCodes.BAD_GATEWAY).json({
                                error: "Passwords do not match.",
                            });
                        }
                    });
            } else {
                res.status(StatusCodes.FORBIDDEN).json({
                    error: "User not found.",
                });
            }
        });
});

module.exports = router;