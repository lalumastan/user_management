const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.USER_MGMT_MONGO_URI;
const secret_key = Buffer.from(uri).toString("base64");
exports.MongoClient = MongoClient;
exports.ServerApiVersion = ServerApiVersion;
exports.uri = uri;
exports.secret_key = secret_key;