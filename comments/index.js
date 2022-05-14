const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');
const {randomBytes} = require('crypto');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const commentsByPostId = {};

app.get('/posts/:id/comments',(request, response)=>{
    // console.log(request.params.id);
    response.send(commentsByPostId[request.params.id] || []);
});

app.post('/posts/:id/comments', async (request, response)=>{
    const commentId = randomBytes(4).toString('hex');
    const {content} = request.body;
    const comments = commentsByPostId[request.params.id] || [];
    const data = {id:commentId,content,status:'pending'};
    comments.push(data);
    commentsByPostId[request.params.id] = comments;
    await axios.post('http://localhost:4005/events',{
        type:'CommentCreated',
        data:{
            id:commentId,
            content,
            postId:request.params.id,
            status:'pending'
        }
    })
    response.status(201).send(comments);
})
app.post('/events', async (req,res)=>{
    console.log('Received Event', req.body.type);
    const {type, data} = req.body;
    if(type === 'CommentModerated'){
        const {postId, id, status, content} = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment =>{
            return comment.id === id;
        });
        comment.status = status;

        await axios.post('http://localhost:4005/events',{
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }


    res.send({});
})
app.listen(4001,()=>{
    console.log("Listening on 4001");
})