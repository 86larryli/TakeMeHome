const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_CA_PATH = process.env.DATABASE_CA_PATH;

console.log("DATABASE_USERNAME", DATABASE_USERNAME);
console.log("DATABASE_PASSWORD", DATABASE_PASSWORD);
console.log("DATABASE_CA_PATH", DATABASE_CA_PATH);

const DATABASE_URL = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@docdb-2022-03-29-22-51-31.culh2xsdmtyc.us-east-1.docdb.amazonaws.com:27017/takemehome-dev`;

module.exports = {
    DATABASE_URL,
    DATABASE_CA_PATH
}