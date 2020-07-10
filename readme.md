## 简介

nodejs 使用 apollo 服务端模块 apollo-server-koa 实现 GraphQL 接口规范，并且实现项目目录工程化分类，易于理解和开发

apollo 包含 2 组用于客户端和服务端的开源模块，和一个强力的开发人员工具，方便开发人员接入，开发和运行 GraphQL API 应用

### 使用

```shell
yarn

yarn start
```

打开 http://127.0.0.1:4000/graphql 进行接口测试

### 项目实现内容

1. 使用 SDL (schema Difinition language) 编写数据描述规范
2. 定义对应的 resolver 解析器处理请求，并且返回 schema 预先定义好的响应体接口
3. 项目工程化，自动化加载 schema 和 resolver
4. 自定义 Scalar type
5. 自定义 directives
6. 通过透传 koa ctx 对象，在 GraphQL 中实现接口认证
