import express from 'express';
import cors from 'cors';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { fileURLToPath } from 'node:url';
const app = express();
const md = new MarkdownIt();

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(__dirname, 'posts');

async function getPosts() {
    const fileNames = await fs.readdir(postsDirectory);
    const posts = [];
    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        const filePath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(filePath, 'utf8');
        const htmlContent = md.render(fileContents);

        posts.push( {
            id: fileName.replace('.md', ''),
            content: htmlContent,
        } );
    };

    return posts;
}

app.get('/api/posts', async (req, res) => {
    const posts = (await getPosts()).map(post => ({
        id: post.id,
        title: post.content.match(/<h1>(.*?)<\/h1>/)?.[1] || post.id,
    }));
    res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
    const {id} = req.params;
    const filePath = path.join(postsDirectory, `${id}.md`);

    const fileContents = await fs.readFile(filePath, 'utf8');
    const htmlContent = md.render(fileContents);
    res.json({
        id,
        content: htmlContent,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});