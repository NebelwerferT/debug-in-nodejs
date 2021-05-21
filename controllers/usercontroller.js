var router = require('express').Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var sequelize = require('../db');
const Sequelize = require('sequelize');
var User = require('../models/user')(sequelize, Sequelize.DataTypes);

router.post('/signup', (req, res) => {
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (!user) {
            User.create({
                full_name: req.body.user.full_name,
                username: req.body.user.username,
                passwordHash: bcrypt.hashSync(req.body.user.password, 10),
                email: req.body.user.email,
            })
                .then(
                    function signupSuccess(user) {
                        let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                        res.status(200).json({
                            user: user,
                            token: token
                        })
                    },

                    function signupFail(err) {
                        res.status(500).send(err.message)
                    }
                )
        }
        else { res.status(409).send({ error: "A user with this username already exists." }); }
    })

})

router.post('/signin', (req, res) => {
    User.findOne({ where: { username: req.body.user.username } }).then(user => {
        if (user) {
            bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
                if (matches) {
                    var token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
                    res.json({
                        user: user,
                        message: "Successfully authenticated.",
                        sessionToken: token
                    });
                } else {
                    res.status(502).send({ error: "Passwords do not match." })
                }
            });
        } else {
            res.status(403).send({ error: "User not found." })
        }

    })
})

module.exports = router;