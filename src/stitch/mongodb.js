import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import { app } from "./app";

// TODO: Initialize a MongoDB Service Client

const mongoClient = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);
const DB_NAME = 'healthequity';
const CHED_series = mongoClient.db(DB_NAME).collection("CHED_series");
const CHED_static = mongoClient.db(DB_NAME).collection("CHED_static");
const var_option_mapping = mongoClient.db(DB_NAME).collection("var_option_mapping");


export {  var_option_mapping, CHED_static, CHED_series};
