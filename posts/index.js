const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser')
const app = express();
const {randomBytes} = require('crypto');
const cors = require('cors');
const posts = {};
app.use(bodyParser.json());
app.use(cors());

app.get('/posts',(request, response)=>{
    response.send(posts);
});

app.post('/posts', async (request, response)=>{
    const id = randomBytes(4).toString('hex');
    const{title} = request.body;
    posts[id] = {id, title};
    await axios.post('http://localhost:4005/events',{
        type:'PostCreated',
        data:{
            id,title
        }
    });
    response.status(201).send(posts[id]);
});

app.post('/events', (req,res)=>{
    console.log('Received Event', req.body.type);
    res.send({});
});
app.listen(4000,()=>{
    console.log("V-21321");
    console.log("Listening on 4000");
});