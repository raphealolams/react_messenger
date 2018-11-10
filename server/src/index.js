/**
* @author Ajilore Raphael Olamide <raphealolams@gmail.com>
*  
*/

require('dotenv').load();
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { version } from '../package.json';
import webSocketServer, {Server} from 'uws'
import AppRouter from './appRouter';
import Model from './models';
import Database from './database'

const PORT = 9107;
const app = express();
app.server = http.createServer(app);


app.use(morgan('dev'));

app.use(cors({
  exposedHeaders: "*"
}));

app.use(bodyParser.json({
  limit: '50mb'
}));

new Database().connect()
.then(db => {
  app.db = db
  console.log("db connected")
})
  .catch(err => {throw err})

app.models = new Model(app)
app.routers = new AppRouter(app)

app.wss = new Server({
  "server": app.server
})

app.wss.on('connection', (connection) => {
  console.log("Socket connected....")

  connection.on('message', (message) => {

    console.log("Got new message :", message)
  })

  connection.send("what's up client")
})

app.server.listen(process.env.PORT || PORT, () => {
  console.log(`App is running on port ${app.server.address().port}`);
});

export default app;