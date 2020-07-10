const BookStatus = {
  DELETED: 1,
  NORMAL: 0,
};

// 针对查询定义对应的同名解析器，返回schemal定义的响应体
const resolvers = {
  BookStatus,
  Query: {
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

module.exports = resolvers;
