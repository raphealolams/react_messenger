/**
* @author Ajilore Raphael Olamide <raphealolams@gmail.com>
*  
*/

import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { version } from '../package.json';
import webSocketServer, {Server} from 'uws'

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

app.use((req, res) => {
  res.json({
    "version": version
  })
})

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