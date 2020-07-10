const BookStatus = {
  DELETED: 1,
  NORMAL: 0,
};

const resolver = {
  BookStatus,
  Query: {
    book: (parent, args, context, info) => ({
      name: '时间简史',
      price: 55.2,
      status: BookStatus.NORMAL,
      created: 1199116800000,
    }),
  },
};

module.exports = resolver;
