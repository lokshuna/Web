document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts');
    const postForm = document.getElementById('post-form');

    let isEditing = false;
    let editingPostId = null; 

    const fetchPosts = async () => {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        renderPosts(posts);
    };

    const renderPosts = (posts) => {
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <div class="post-title">${post.title}</div>
                <div class="post-author">Автор: ${post.author}</div>
                <div class="post-description">${post.description}</div>
                <button onclick="deletePost(${post.id})">Видалити</button>
                <button onclick="editPost(${post.id}, '${post.title}', '${post.description}', '${post.author}')">Редагувати</button>
            `;
            postsContainer.appendChild(postDiv);
        });
    };

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const author = document.getElementById('author').value;

        if (isEditing && editingPostId !== null) {
            const response = await fetch(`/api/posts/${editingPostId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, author })
            });

            if (response.ok) {
                isEditing = false; 
                editingPostId = null;
                postForm.reset();
                fetchPosts();
            } else {
                alert('Сталася помилка при редагуванні поста.');
            }
        } else {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, author })
            });

            if (response.ok) {
                postForm.reset();
                fetchPosts();
            } else {
                alert('Сталася помилка при додаванні поста.');
            }
        }
    });

    window.editPost = (id, title, description, author) => {
        isEditing = true;
        editingPostId = id;

        document.getElementById('title').value = title;
        document.getElementById('description').value = description;
        document.getElementById('author').value = author;
    };

    window.deletePost = async (id) => {
        const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });

        if (response.ok) {
            fetchPosts();
        } else {
            alert('Не вдалося видалити пост.');
        }
    };

    fetchPosts(); 
});
