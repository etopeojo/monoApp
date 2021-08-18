"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { generateAccountNumber } = require("../../../utils");
const DB_NAME = "bank-account";

const ACCOUNT_TYPES = {
  savings: "savings",
  current: "current",
  flexiSavings: "flexi-savings",
  superInvestors: "super-investors",
};

async function createAccount(email, accountType) {
  try {
    let customer = await strapi.services.customer.findCustomerByEmail(email);
    let accountNo = await generateAccountNumber(email);

    let data = {
      accountNo,
      customerId: customer.data.id,
      balance: 0,
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

module.exports = {
  ACCOUNT_TYPES,
  createAccount,
  getTotalAccountsCustomerOwns,
  queryAccountNo,
};
