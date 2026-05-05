let posts = JSON.parse(localStorage.getItem("posts")) || [];

function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function renderPosts() {
  const postContainer = document.getElementById("posts");
  postContainer.innerHTML = "";

  posts.forEach((post, index) => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <h3>${post.title}</h3>
      <div class="date">${post.date}</div>
      <p>${post.content}</p>
      <button class="delete-btn" onclick="deletePost(${index})">Delete</button>
    `;

    postContainer.appendChild(div);
  });
}

function addPost() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("Please fill all fields");
    return;
  }

  const newPost = {
    title,
    content,
    date: new Date().toLocaleString()
  };

  posts.unshift(newPost);
  savePosts();
  renderPosts();

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}

function deletePost(index) {
  posts.splice(index, 1);
  savePosts();
  renderPosts();
}

// Load posts on page load
renderPosts();
