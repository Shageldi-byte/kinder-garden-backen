import express from 'express';
import requestIp from 'request-ip';
import cors from 'cors';
import { Server } from "socket.io";
import fs from 'fs';
import { router } from './routes/router.mjs';

const app = express();
app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',router);


const server=app.listen(5009, () => {
    console.log(`listening on port 5009`);
})

const io = new Server(server, { /* options */ });

io.on("connection", (client) => {
    console.log("Connected  "+client.id);
    client.on('onEntire', (data)=> {
        console.log(data)
        io.emit('onEntire', data);
    });
});

app.get('/socket-test', function(req, res,next) {  
    const html=fs.readFileSync('public/index.html', 'utf8');
    res.send(html);
});



export const socket_io = io;