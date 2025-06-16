export const defaultTransactionCategories = [
  // 支出分類
  {
    type: 'expense',
    categories: [
      '餐飲',
      '交通',
      '購物',
      '娛樂',
      '醫療',
      '教育',
      '房租',
      '水電',
      '通訊',
      '保險',
      '投資',
      '其他支出',
    ],
  },
  // 收入分類
  {
    type: 'income',
    categories: [
      '薪資',
      '獎金',
      '投資收益',
      '兼職',
      '禮金',
      '退款',
      '其他收入',
    ],
  },
];

export const getDefaultCategories = (type?: 'income' | 'expense'): string[] => {
  if (type) {
    const categoryGroup = defaultTransactionCategories.find(group => group.type === type);
    return categoryGroup ? categoryGroup.categories : [];
  }
  
  // 返回所有分類
  return defaultTransactionCategories.reduce((all, group) => {
    return [...all, ...group.categories];
  }, [] as string[]);
};
