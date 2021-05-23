const jwt = require('jsonwebtoken');
const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const User = require('../models/user')(sequelize, DataTypes);

module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next();   // allowing options as a method for request
    } else {
        const sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if (!sessionToken) {
            res.status(403).json({
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
                                    res.status(401).json({
                                        error: "not authorized",
                                    });
                                })

                    } else {
                        res.status(400).json({
                            error: "not authorized",
                        });
                    }
                });
        }
    }
};
