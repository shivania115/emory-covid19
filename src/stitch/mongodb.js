import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import { app } from "./app";

// TODO: Initialize a MongoDB Service Client
const mongoClient = app.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas-test"
);

// TODO: Instantiate a collection handle for todo.items
const members = mongoClient.db("test").collection("members");
const registry = mongoClient.db("test").collection("registry");
const users = mongoClient.db("test").collection("users");

export { members, registry, users };
