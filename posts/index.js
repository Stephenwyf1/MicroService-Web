const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const {randomBytes} = require('crypto');
const posts = {};
app.use(bodyParser.json());
// ssaddad
app.get('/posts',(request, response)=>{
    response.send(posts);
});
// sadaddasdasd
app.post('/posts', (request, response)=>{
    const id = randomBytes(4).toString('hex');
    const{title} = request.body;
    posts[id] = {id, title};
    response.status(201).send(posts[id]);
})
app.listen(8080,()=>{
    console.log("Listening on 8080");
})