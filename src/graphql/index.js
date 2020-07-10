const { ApolloServer, gql } = require('apollo-server-koa');
const { resolve, join } = require('path');
const fs = require('fs');

// 负责在服务端启动时，收集所有数据实体，生成 Apollo Server 实例
const typeDefFileName = 'schema.js';
const resolverFileName = 'resolver.js';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

function generateTypeDefsAndResolvers() {
  const typeDefs = [linkSchema];
  const resolvers = {};
  // 返回默认的绝对路径
  const defaultPath = resolve(__dirname, '../components');

  const _generateAllComponentRecursive = (path = defaultPath) => {
    const list = fs.readdirSync(path);
    list.forEach((item) => {
      const resolverPath = join(path, item);
      const status = fs.statSync(resolverPath);
      const isDir = status.isDirectory();
      const isFile = status.isFile();

      if (isDir) {
        _generateAllComponentRecursive(resolverPath);
      } else if (isFile) {
        if (item === resolverFileName) {
          const resolversPerFile = require(resolverPath);
          Object.keys(resolversPerFile).forEach((k) => {
            if (!resolversPerFile.hasOwnProperty(k)) resolvers[k] = {};
            resolvers[k] = { ...resolvers[k], ...resolversPerFile[k] };
          });
        } else if (item === typeDefFileName) {
          const { schema } = require(resolverPath);
          typeDefs.push(schema);
        }
      }
    });
  };

  _generateAllComponentRecursive();

  return { typeDefs, resolvers };
}

const isProd = process.env.NODE_ENV === 'production';

const apolloServerOptions = {
  ...generateTypeDefsAndResolvers(),
  introspection: isProd, // 如果是生产环境，则关闭内省功能
  playground: isProd, // 如果是生产环境则关闭开发者功能
  mocks: true, // 开启mock，用于在功能未开发完的情况下，模拟假数据返回客户端
  formatError: (error) => {
    return {
      code: error.extensions.code,
      message: error.message,
    };
  }, // 定制化返回的错误响应体格式
};

module.exports = new ApolloServer({ ...apolloServerOptions });
