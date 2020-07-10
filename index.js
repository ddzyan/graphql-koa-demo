const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

const isProd = process.env.NODE_ENV === 'production';

// SDL
const typeDefs = gql`
  type Query {
    book: Book
    hello: String
  }

  enum BookStatus {
    DELETED
    NORMAL
  }

  type Book {
    id: ID
    name: String
    price: Float
    status: BookStatus
  }
`;

const BookStatus = {
  DELETED: 1,
  NORMAL: 0,
};

// 针对查询定义对应的同名解析器，返回schemal定义的响应体
const resolvers = {
  BookStatus,
  Query: {
    hello: () => 'Hello world!',
    /**
     * parent 上一级对象，如果是根字段则位undifined
     * args 在 SDL 查询中传入的参数
     * context 上下文信息
     * info
     */
    book: (parent, args, context, info) => ({
      name: '时间简史',
      price: 55.2,
      status: BookStatus.NORMAL,
    }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: !isProd, // 如果是生产环境，则关闭内省功能
  playground: !isProd, // 如果是生产环境则关闭开发者功能
  mocks: true, // 开启mock，用于在功能未开发完的情况下，模拟假数据返回客户端
  formatError: (error) => {
    return {
      code: error.extensions.code,
      message: error.message,
    };
  }, // 定制化返回的错误响应体格式
});

const app = new Koa();

server.applyMiddleware({ app });

/* let count = 0;
app.use(async (ctx, next) => {
  count++;
  ctx.body = 'hello word!!' + count;
}); */

app.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});

// curl 'http://localhost:4000/graphql' -H 'Content-Type: application/json' --data-binary '{"query":"{book{name price status}}"}'

// 发送纯二进制数据

// curl 'http://localhost:4000/graphql' -H 'Content-Type: application/json' --data-binary '{"query":"{hello}"}'
