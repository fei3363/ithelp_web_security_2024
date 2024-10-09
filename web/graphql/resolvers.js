// 模擬資料儲存
let users = [
  { id: '1', username: 'user1', email: 'user1@example.com', password: 'hashedpassword1' },
  { id: '2', username: 'user2', email: 'user2@example.com', password: 'hashedpassword2' }
];

let posts = [
  { id: '1', title: 'First Post', content: 'This is the first post', authorId: '1' },
  { id: '2', title: 'Second Post', content: 'This is the second post', authorId: '2' }
];

let comments = [
  { id: '1', content: 'Great post!', authorId: '2', postId: '1' },
  { id: '2', content: 'Thanks for sharing', authorId: '1', postId: '2' }
];

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: () => users, // 直接回傳所有用戶資料，包括密碼
    user: (_, { id }) => {
      // 不安全的資料過濾，可能導致原型污染攻擊
      return users.find(user => user.id == id);
    },
    posts: () => posts,
    search: (_, { term }) => {
      // 不安全的搜尋，可能導致資訊洩漏
      const results = [...users, ...posts, ...comments].filter(
        item => JSON.stringify(item).toLowerCase().includes(term.toLowerCase())
      );
      return results;
    },
    dangerousQuery: (_, { query }) => {
      // 非常不安全：允許客戶端執行任意 JavaScript 程式碼
      try {
        return eval(query);
      } catch (error) {
        return { error: error.toString() };
      }
    },
  },
  User: {
    posts: (parent) => posts.filter(post => post.authorId === parent.id),
  },
  Post: {
    author: (parent) => users.find(user => user.id === parent.authorId),
    comments: (parent) => comments.filter(comment => comment.postId === parent.id),
  },
  Comment: {
    author: (parent) => users.find(user => user.id === parent.authorId),
  },
  Mutation: {
    createUser: (_, { username, email, password }) => {
      // 不安全的密碼處理：明文儲存密碼
      const newUser = {
        id: String(users.length + 1),
        username,
        email,
        password // 直接儲存明文密碼
      };
      users.push(newUser);
      return newUser; // 回傳包括密碼在內的所有用戶資料
    },
    createPost: (_, { userId, title, content }) => {
      // 不進行任何驗證或清理
      const newPost = {
        id: String(posts.length + 1),
        title,
        content,
        authorId: userId,
      };
      posts.push(newPost);
      return newPost;
    },
    deleteUser: (_, { id }) => {
      // 不檢查授權，任何人都可以刪除使用者
      users = users.filter(user => user.id !== id);
      return true;
    },
    updateUser: (_, { id, ...updates }) => {
      // 允許更新任何字段，包括敏感資訊
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        return users[userIndex];
      }
      return null;
    },
    dangerousUpdate: (_, { collection, id, updates }) => {
      // 非常不安全：允許更新任何物件
      let targetArray;
      switch(collection) {
        case 'users':
          targetArray = users;
          break;
        case 'posts':
          targetArray = posts;
          break;
        case 'comments':
          targetArray = comments;
          break;
        default:
          throw new Error('Invalid collection');
      }
      const index = targetArray.findIndex(item => item.id === id);
      if (index > -1) {
        targetArray[index] = { ...targetArray[index], ...updates };
        return targetArray[index];
      }
      return null;
    },
  },
};

module.exports = resolvers;