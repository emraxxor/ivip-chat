const express = require('express');
const redis = require('../redis')
const config = require('../config')

const AuthenticationRouter = express.Router()
module.exports = AuthenticationRouter
