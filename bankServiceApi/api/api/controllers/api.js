"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { generateRESTResponse } = require("../../../utils");
const ACCOUNT_SERVICE = "bank-account";
const CUSTOMER_SERVICE = "customer";

async function newCustomerSignup(ctx) {
  let { email, name, password, accountType } = ctx.request.body;
  let signupCustomerResp = await strapi.services[
    CUSTOMER_SERVICE
  ].findOrCreateCustomer(email, { name: name.toUpperCase(), password });

  if (!signupCustomerResp.ok) {
    return ctx.throw(500, "Error setting up new customer");
  }

  let accountCreateResp = await strapi.services[ACCOUNT_SERVICE].createAccount(
    email,
    accountType
  );

  if (!accountCreateResp.ok) {
    return ctx.throw(500, "Error setting up new customer");
  }
  ctx.body = generateRESTResponse(200, "Account created successfully", {
    accountNumber: accountCreateResp.data.accountNo,
    accountName: signupCustomerResp.data.name,
    accountType: accountCreateResp.data.accountType,
    balance: accountCreateResp.data.balance,
    currency: "NGN",
  });
  return ctx;
}

async function openAdditionalAccount(ctx) {
  let { email, accountType } = ctx.request.body;
  let signupCustomerResp = await strapi.services[
    CUSTOMER_SERVICE
  ].findCustomerByEmail(email);

  if (!signupCustomerResp.ok) {
    return ctx.throw(500, "An error occured");
  }

  let accountCreateResp = await strapi.services[ACCOUNT_SERVICE].createAccount(
    email,
    accountType
  );

  if (!accountCreateResp.ok) {
    return ctx.throw(500, "Error creating account");
  }
  ctx.body = generateRESTResponse(200, "Account created successfully", {
    accountNumber: accountCreateResp.data.accountNo,
    accountName: signupCustomerResp.data.name,
    accountType: accountCreateResp.data.accountType,
    balance: accountCreateResp.data.balance,
    currency: "NGN",
  });
  return ctx;
}

async function getAccountTypes(ctx) {
  ctx.body = generateRESTResponse(200, "Account types fetched successfully", {
    accountTypes: strapi.services[ACCOUNT_SERVICE].ACCOUNT_TYPES,
  });

  return ctx;
}

async function queryAccountNo(ctx) {
  let { accountNo } = ctx.params;
  let queryResp = await strapi.services[ACCOUNT_SERVICE].queryAccountNo(
    accountNo
  );

  if (!queryResp.ok) {
    return ctx.throw(404, `No account exists with the accountNo ${accountNo}`);
  }

  ctx.body = generateRESTResponse(
    200,
    "Account information fetched successfully",
    queryResp.data
  );

  return ctx;
}

module.exports = {
  newCustomerSignup,
  openAdditionalAccount,
  getAccountTypes,
  queryAccountNo,
};
