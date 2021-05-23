const jwt = require('jsonwebtoken');
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const User = require('../models/user')(sequelize, DataTypes);
const { StatusCodes } = require('http-status-codes');

module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next();   // allowing options as a method for request
    } else {
        const sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if (!sessionToken) {
            res.status(StatusCodes.FORBIDDEN).json({
                auth: false,
                message: "No token provided.",
            });
        } else {
            jwt.verify(
                sessionToken,
                'lets_play_sum_games_man',
                (err, decoded) => {
                    if (decoded) {
                        User.findOne({
                            where: {
                                id: decoded.id,
                            }
                        })
                            .then(
                                user => {
                                    req.user = user;
                                    console.log(`user: ${JSON.stringify(user.dataValues)}`);
                                    next();
                                },

                                () => {
                                    res.status(StatusCodes.UNAUTHORIZED).json({
                                        error: "not authorized",
                                    });
                                })

                    } else {
                        res.status(StatusCodes.BAD_REQUEST).json({
                            error: "not authorized",
                        });
                    }
                });
        }
    }
};
