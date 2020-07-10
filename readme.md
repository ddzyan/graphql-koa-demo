参考资料：

1. https://juejin.im/post/5d5d2f9ef265da03c02c06ed#heading-25
2. https://graphql.cn/

## GraphQL 简介

### 是什么

GraphQL 是一种用于 API 的查询语言，对 API 中的数据提供一套易于理解的完整描述，使得客户端能够准确获得它需要的数据，没有任何冗余，也让 API 更容易随着时间推移而演进，还能构建强大的开发者工具（来自官网介绍）

### 有什么用

在传统 restful 接口开发上，一个功能的开发需要服务端开发人员定义好接口访问方式和返回的消息体结构，客户端再根据定义内容进行请求和获取数据。所有的接口服务端开发人员需要单独维护，在持续开发中不断更新和同步客户端开发人员。这当中存在如下问题：

1. 需要编写接口文档，并且进行单独保存
2. 在长期开发中需要保障接口文档的一致性
3. 根据不同版本维护多个 API 文档
4. 需要描述接口所有可能返回的值

现在可以通过客户端和服务端共享一份数据描述规范：

1. 数据描述规范也是代码的一部分，参与 API 功能
2. 数据描述规范本身就是文档，不需要单独编写，维护和迭代
3. 服务端所有的修改，数据描述规范也将发生变化，无需担心不一致问题
4. 数据描述规范可以体现应用的结构图，方便客户端快速理解

GraphQL 就是这样的一种数据描述规范

### 怎么用

GraphQL 的数据描述通过 schema 语法编写（schema Definition Language SDL）,特点如下：

```
type Query {
  book:Book
}

enum BookStatus {
  DELETED
  NORMAL
}

type Book {
  id:ID
  name:String
  prire:Float
  status:BookStatus
}
```

SDL 规定了三类入口，分别未：

1. Query 查询
2. Mutation 修改
3. Subscription 定义长链接(不常用)

SDL 基础数据类型：

1. Int 有符号 32 位整型
2. Float 有符号双精度浮点型
3. String UTF-8 字符
4. Boolean true/false
5. ID 唯一标识，经常用于重新获取一个对象或缓存的 KEY(重要)

## nodejs 接入 GraphQL

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
7. 使用第三方模块 dataloader 合并多次 I/O 处理
