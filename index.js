const Koa = require('koa');
const apolloServer = require('./src/graphql');

const auth = require('./src/middlewares/auth');

const app = new Koa();

app.use(auth);

// koa 中间价加载必须在apolloServer挂载之前
apolloServer.applyMiddleware({ app });

app.listen(4000, () => {
  console.log(
    `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
  );
});

// curl 'http://localhost:4000/graphql' -H 'Content-Type: application/json' --data-binary '{"query":"{book{name price status}}"}'

// 发送纯二进制数据

// curl 'http://localhost:4000/graphql' -H 'Content-Type: application/json' --data-binary '{"query":"{hello}"}'
