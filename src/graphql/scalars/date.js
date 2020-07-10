const moment = require('moment');
const { Kind } = require('graphql/language');
const { GraphQLScalarType } = require('graphql');

const customScalarDate = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue: (value) => moment(value).valueOf(), // 客户端发给服务器
  serialize: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss:SSSS'), // 服务器发给客户端
  parseLiteral: (ast) =>
    ast.kind === Kind.INT ? Number.parseInt(ast.value, 10) : null,
});

module.exports = { Date: customScalarDate };
