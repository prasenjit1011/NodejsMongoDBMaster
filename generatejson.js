const fs = require('fs');

const NUM_POSTS = 100;
const OUTPUT_FILE = './public/dummy_posts.json';

function generatePost(id) {
  return {
    id,
    title: `Dummy Post Title ${id}`,
    body: `This is the body of dummy post ${id}.`,
    userId: id % 1000 // simulate 1000 users
  };
}

function generatePosts() {
  const stream = fs.createWriteStream(OUTPUT_FILE);
  stream.write('[\n');

  for (let i = 1; i <= NUM_POSTS; i++) {
    const post = JSON.stringify(generatePost(i));
    stream.write(post + (i !== NUM_POSTS ? ',\n' : '\n'));
  }

  stream.write(']');
  stream.end(() => console.log(`Finished writing ${NUM_POSTS} posts to ${OUTPUT_FILE}`));
}

generatePosts();
