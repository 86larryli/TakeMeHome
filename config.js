const MODE = "DEV";

const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_CA_PATH = process.env.DATABASE_CA_PATH;

const DATABASE_URL = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@docdb-2022-03-29-22-51-31.culh2xsdmtyc.us-east-1.docdb.amazonaws.com:27017/takemehome-dev`;

module.exports = {
    MODE,
    DATABASE_URL,
    DATABASE_CA_PATH
}