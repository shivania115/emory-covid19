import { TwilioServiceClient } from 'mongodb-stitch-browser-services-twilio';
import { app } from "./app";

const twilio = app.getServiceClient(TwilioServiceClient.factory, "twilio");

export { twilio };