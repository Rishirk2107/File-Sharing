const serverless = require("@vendia/serverless-express");
const app = require("./index");

exports.handler = serverless({ app });
