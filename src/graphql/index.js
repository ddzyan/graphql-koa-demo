const { ApolloServer, gql } = require('apollo-server-koa');
const { resolve, join } = require('path');
const fs = require('fs');

const allCustomDirectives = require('./directives');
const allCustomScalars = require('./scalars');

const defaultTypeFileName = 'schema.js';
const defaultResolverFileName = 'resolver.js';
const defaultPath = resolve(__dirname, '../components');
// FIELD_DEFINITION 代表此命令只作用于具体某个字段
const linkSchema = gql`
  scalar Date

  directive @auth on FIELD_DEFINITION

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

// 递归产生所有组件
const generateAllComponentRecursive = () => {
  const typeDefs = [linkSchema];
  const resolvers = { ...allCustomScalars };

  const _generateAllComponentRecursive = (path = defaultPath) => {
    const list = fs.readdirSync(path);
    list.forEach((item) => {
      const resolverPath = path + '/' + item;
      const status = fs.statSync(resolverPath);
      const isDir = status.isDirectory();
      const isFile = status.isFile();

      if (isDir) {
        _generateAllComponentRecursive(resolverPath);
      } else if (isFile) {
        if (item === defaultResolverFileName) {
          const resolversPerFile = require(resolverPath);
          Object.keys(resolversPerFile).forEach((key) => {
            if (!resolversPerFile.hasOwnProperty(key)) resolvers[key] = {};
            resolvers[key] = { ...resolvers[key], ...resolversPerFile[key] };
          });
        } else if (item === defaultTypeFileName) {
          const { schema } = require(resolverPath);
          typeDefs.push(schema);
        }
      }
    });
  };

  _generateAllComponentRecursive();

  return { typeDefs, resolvers };
};

const isProd = process.env.NODE_ENV === 'production';
const apolloOptions = {
  ...generateAllComponentRecursive(),
  schemaDirectives: { ...allCustomDirectives },
  introspection: !isProd, // 如果是生产环境，则关闭内省功能
  playground: !isProd, // 如果是生产环境则关闭开发者功能
  mocks: false, // 开启mock，用于在功能未开发完的情况下，模拟假数据返回客户端
  context: ({ ctx }) => ({ ctx }),
  formatError: (error) => {
    return {
      code: error.extensions.code,
      message: error.message,
    };
  }, // 定制化返回的错误响应体格式
};

module.exports = new ApolloServer(apolloOptions);
