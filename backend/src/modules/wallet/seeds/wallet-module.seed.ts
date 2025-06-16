export const walletModuleSeeds = [
  {
    moduleName: '手動記帳錢包',
    moduleConfigFormat: {
      walletName: 'string',
      walletColor: 'string',
      initialBalance: 'number',
      description: 'string',
    },
    moduleCallURL: null,
  },
  {
    moduleName: '台新銀行',
    moduleConfigFormat: {
      accountNumber: 'string',
      password: 'string',
      branchCode: 'string',
    },
    moduleCallURL: 'https://api.taishin.com.tw',
  },
  {
    moduleName: '富邦銀行',
    moduleConfigFormat: {
      accountNumber: 'string',
      password: 'string',
      idNumber: 'string',
    },
    moduleCallURL: 'https://api.fubon.com.tw',
  },
  {
    moduleName: '幣安交易所',
    moduleConfigFormat: {
      apiKey: 'string',
      secretKey: 'string',
    },
    moduleCallURL: 'https://api.binance.com',
  },
  {
    moduleName: '悠遊卡',
    moduleConfigFormat: {
      cardNumber: 'string',
      authCode: 'string',
    },
    moduleCallURL: 'https://api.easycard.com.tw',
  },
];
