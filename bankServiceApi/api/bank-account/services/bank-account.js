"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const {
  generateAccountNumber,
  generateRandomNumbers,
} = require("../../../utils");
const DB_NAME = "bank-account";
const TRANS_LOG_SERVICE = "transaction-logs";

const ACCOUNT_TYPES = {
  savings: "savings",
  current: "current",
  flexiSavings: "flexi-savings",
  superInvestors: "super-investors",
};

const TRANSACTION_TYPES = {
  deposit: "DEPOSIT",
  credit: "CREDIT",
  debit: "DEBIT",
  reversal: "REVERSAL",
};

async function createAccount(email, accountType) {
  try {
    let customer = await strapi.services.customer.findCustomerByEmail(email);
    let accountNo = await generateAccountNumber(email);

    let data = {
      accountNo,
      customerId: customer.data.id,
      balance: "0.00",
      accountType,
    };
    let createResp = await strapi.query(DB_NAME).create(data);

    return { ok: true, data: createResp };
  } catch (error) {
    console.error("Error generating new account");
    console.error(error);
    return { ok: false };
  }
}

async function getTotalAccountsCustomerOwns(customerId) {
  try {
    let accounts = await strapi.query(DB_NAME).find({ customerId });
    return { ok: true, totalAccounts: accounts.length, accounts };
  } catch (error) {
    console.error("Error getting total accounts tied to a customer");
    console.error(error);
    return { ok: false };
  }
}

async function updateAccountBalance(accountNo, amount) {
  try {
    await strapi
      .query(DB_NAME)
      .update({ accountNo }, { balance: Number(amount).toFixed(2).toString() });

    return;
  } catch (error) {
    console.error("Error updating account balance");
    console.error(error);
    throw new Error("Error updating account balance");
  }
}

async function queryAccountNo(accountNo) {
  try {
    let account = await strapi.query(DB_NAME).findOne({ accountNo });

    if (account) {
      let customer = await strapi.services.customer.findCustomerById(
        account.customerId
      );

      return {
        ok: true,
        data: {
          accountNo,
          accountType: account.accountType,
          accountName: customer.data.name,
        },
      };
    } else {
      throw new Error("Cannot find accountNo");
    }
  } catch (error) {
    console.error("Error querying account number");
    console.error(error);
    return { ok: false };
  }
}

async function getAccountBalance(accountNo) {
  try {
    let account = await strapi.query(DB_NAME).findOne({ accountNo });

    if (account) {
      return {
        ok: true,
        data: {
          accountNo,
          currentBalance: account.balance,
        },
      };
    } else {
      throw new Error("Cannot find accountNo");
    }
  } catch (error) {
    console.error("Error getting account balance");
    console.error(error);
    return { ok: false };
  }
}

async function fundDeposit(recipientAccountNo, amount) {
  try {
    let account = await strapi
      .query(DB_NAME)
      .findOne({ accountNo: recipientAccountNo });
    if (account) {
      let currentWalletBalance = Number(account.balance);
      let newBalance = currentWalletBalance + Number(amount);
      await updateAccountBalance(recipientAccountNo, newBalance.toString());

      await strapi.services[TRANS_LOG_SERVICE].createTransactionLog(
        recipientAccountNo,
        TRANSACTION_TYPES.deposit,
        Number(amount).toFixed(2).toString(),
        generateRandomNumbers()
      );

      return {
        ok: true,
        data: await strapi
          .query(DB_NAME)
          .findOne({ accountNo: recipientAccountNo }),
      };
    } else {
      throw new Error("Cannot find accountNo");
    }
  } catch (error) {
    console.error("Error depositing funds to account number");
    console.error(error);
    return { ok: false };
  }
}

async function initiateFundTransfer(
  sourceAccountNo,
  recipientAccountNo,
  amount
) {
  try {
    let sourceAccount = await strapi
      .query(DB_NAME)
      .findOne({ accountNo: sourceAccountNo });
    let recipientAccount = await strapi
      .query(DB_NAME)
      .findOne({ accountNo: recipientAccountNo });

    if (sourceAccount && recipientAccount) {
      let sourceCurrentWalletBalance = Number(sourceAccount.balance);
      let recipientCurrentWalletBalance = Number(recipientAccount.balance);

      let sourceNewBalance = sourceCurrentWalletBalance - Number(amount);
      let recipientNewBalance = recipientCurrentWalletBalance + Number(amount);

      await updateAccountBalance(sourceAccountNo, sourceNewBalance.toString());
      await updateAccountBalance(
        recipientAccountNo,
        recipientNewBalance.toString()
      );

      // Lodge source account transaction log
      await strapi.services[TRANS_LOG_SERVICE].createTransactionLog(
        sourceAccountNo,
        TRANSACTION_TYPES.debit,
        Number(amount).toFixed(2).toString(),
        generateRandomNumbers()
      );

      // Lodge source account transaction log
      await strapi.services[TRANS_LOG_SERVICE].createTransactionLog(
        recipientAccountNo,
        TRANSACTION_TYPES.credit,
        Number(amount).toFixed(2).toString(),
        generateRandomNumbers()
      );

      return {
        ok: true,
        data: {
          source: await strapi
            .query(DB_NAME)
            .findOne({ accountNo: sourceAccountNo }),
          recipient: await strapi
            .query(DB_NAME)
            .findOne({ accountNo: recipientAccountNo }),
        },
      };
    } else {
      throw new Error("Cannot find source or recipient's account number");
    }
  } catch (error) {
    console.error("Error transferring funds");
    console.error(error);

    return { ok: false };
  }
}

module.exports = {
  ACCOUNT_TYPES,
  createAccount,
  getTotalAccountsCustomerOwns,
  queryAccountNo,
  fundDeposit,
  initiateFundTransfer,
  getAccountBalance,
};
