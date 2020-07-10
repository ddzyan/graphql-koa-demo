const DataLoader = require('dataloader'); // 合并请求

const foods = [
  { id: 1, name: 'milk' },
  { id: 2, name: 'apple' },
  { id: 3, name: 'fish' },
];

const cats = [
  { color: 'white', foodId: 1 },
  { color: 'red', foodId: 2 },
  { color: 'black', foodId: 3 },
];

const fakerIO = (arg) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(arg), 300);
  });

const getFoodByIds = async (ids) => {
  console.log('--- enter getFoodByIds ---', { ids });
  return fakerIO(foods.filter((food) => ids.includes(food.id)));
};

const foodLoader = new DataLoader(getFoodByIds);

const getFoodByIdBatching = (foodId) => foodLoader.load(foodId);

const resolvers = {
  Query: {
    cats: (parent, args, context, info) => cats,
  },
  Cat: {
    love: async (cat) => getFoodByIdBatching(cat.foodId),
  },
};

module.exports = resolvers;
