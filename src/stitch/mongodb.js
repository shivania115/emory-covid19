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


export { CHED_static, CHED_series};
