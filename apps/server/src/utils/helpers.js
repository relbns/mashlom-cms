const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { UserRoles, Stages } = require("./constants");

const isValidRole = (role) => Object.values(UserRoles).includes(role);

const stage = process.env.NODE_ENV

const isDev = stage === Stages.DEVELOPMENT;
const isProd = stage === Stages.PRODUCTION;
const isDemo = stage === Stages.DEMO;
const isLocalhost = process.env.HOST === 'localhost';

const BaseURL = `${process.env.HOST}:${process.env.PORT}`;
const uiPort = (isProd ? process.env.PORT : process.env.UI_PORT) || process.env.PORT // in case running only server
const UI_URL = `${process.env.HOST}:${uiPort}`;

const validateToken = (token, key) => {
    try {
        jwt.verify(token,key || process.env.JWT_SECRET);
        return true;
    } catch (error) {
        return false;
    }
}

const getPaginationParams = (req) => {
    const DEFAULT_PAGE = 1;
    const DEFAULT_LIMIT = 10;
    const page = _.toInteger(_.get(req, 'query.page', DEFAULT_PAGE));
    const limit = _.toInteger(_.get(req, 'query.limit', DEFAULT_LIMIT));

    return { page, limit };
};

module.exports = {
    isValidRole,
    stage,
    isDev,
    isProd,
    isDemo,
    BaseURL,
    UI_URL,
    isLocalhost,
    validateToken,
    getPaginationParams
}