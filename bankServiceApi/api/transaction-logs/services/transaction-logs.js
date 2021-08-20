"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const DB_NAME = "transaction-logs";

async function createTransactionLog(
  accountNo,
  transactionType,
  amount,
  transactionId
) {
  try {
    let doc = { accountNo, type: transactionType, amount, transactionId };
    await strapi.query(DB_NAME).create(doc);
    return;
  } catch (error) {
    console.error("Error creating new transaction log");
    console.error(error);
    throw new Error("Error creating new transaction log");
  }
}

async function getAccountTransactionLogs(accountNo) {
  try {
    let logs = await strapi.query(DB_NAME).find({ accountNo });
    return { ok: true, data: logs };
  } catch (error) {
    console.error("Error getting transaction log");
    console.error(error);
    throw new Error("Error getting transaction log");
  }
}
module.exports = { createTransactionLog, getAccountTransactionLogs };
