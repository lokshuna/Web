const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 1342;

let posts = [];

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const { title, description, author } = req.body;
    if (!title || !description || !author) {
        return res.status(400).json({ message: 'Всі поля обов’язкові!' });
    }
    const newPost = { id: Date.now(), title, description, author };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, author } = req.body;

    const postIndex = posts.findIndex(post => post.id == id);
    if (postIndex === -1) {
        return res.status(404).json({ message: 'Пост не знайдено' });
    }

    posts[postIndex] = { ...posts[postIndex], title, description, author };
    res.json(posts[postIndex]);
});

app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.filter(post => post.id != id);
    res.json({ message: 'Пост видалено' });
});

app.listen(PORT, () => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});