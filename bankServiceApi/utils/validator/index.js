const joi = require("joi");

const CUSTOMER_SERVICE = "customer";
const BANK_ACCOUNT_SERVICE = "bank-account";

async function customerSignupValidate(data) {
  const schema = joi.object({
    name: joi.string().min(5).max(32).required(),
    email: joi
      .string()
      .email()
      .required()
      .trim()
      .external(async (email) => {
        let customerExist = await strapi.services[
          CUSTOMER_SERVICE
        ].findCustomerByEmail(email);

        console.log(customerExist);

        if (customerExist.ok) {
          throw new Error(`A customer exists with the email address ${email}`);
        } else {
          return email;
        }
      }),
    password: joi.string().required(),
    accountType: joi
      .string()
      .required()
      .valid(
        ...Object.values(strapi.services[BANK_ACCOUNT_SERVICE].ACCOUNT_TYPES)
      ),
  });

  return schema.validateAsync({ ...data });
}

async function openAdditionalValidate(data) {
  const schema = joi.object({
    email: joi
      .string()
      .email()
      .required()
      .trim()
      .external(async (email) => {
        let customerExist = await strapi.services[
          CUSTOMER_SERVICE
        ].findCustomerByEmail(email);

        if (customerExist.ok) {
          return email;
        } else {
          throw new Error(`The customer (${email}) does not exist`);
        }
      }),
    accountType: joi
      .string()
      .required()
      .valid(
        ...Object.values(strapi.services[BANK_ACCOUNT_SERVICE].ACCOUNT_TYPES)
      )
      .external(async (type) => {
        let customer = await strapi.services[
          CUSTOMER_SERVICE
        ].findCustomerByEmail(data.email);
        let totalAccountDetails = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].getTotalAccountsCustomerOwns(customer.data.id);

        if (totalAccountDetails.totalAccounts === 4) {
          throw new Error("Customer cannot own more than 4 accounts");
        }

        for (let account of totalAccountDetails.accounts) {
          if (type === account.accountType) {
            throw new Error(
              `Customer already has an account of type '${type}'`
            );
          }
        }

        return type;
      }),
  });

  return schema.validateAsync({ ...data });
}

async function queryAccountNoValidate(data) {
  const schema = joi.object({
    accountNo: joi
      .string()
      .required()
      .min(10)
      .message("accountNo length must be 10 characters long")
      .max(10)
      .message("accountNo length must be 10 characters long")
      .external((accountNo) => {
        let number = Number(accountNo);
        if (number) {
          return accountNo;
        } else {
          throw new Error("AccountNo can only be digits");
        }
      }),
  });

  return schema.validateAsync({ ...data });
}

async function getAccountBalanceValidate(data) {
  const schema = joi.object({
    accountNo: joi
      .string()
      .required()
      .min(10)
      .message("accountNo length must be 10 characters long")
      .max(10)
      .message("accountNo length must be 10 characters long")
      .external(async (accountNo) => {
        let number = Number(accountNo);

        if (!number) {
          throw new Error("AccountNo can only be digits");
        }

        let accountDetails = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].queryAccountNo(accountNo);

        if (accountDetails.ok) {
          return accountNo;
        } else {
          throw new Error(`Account Number '${accountNo} does not exist'`);
        }
      }),
  });

  return schema.validateAsync({ ...data });
}

async function getAccountStatementValidate(data) {
  const schema = joi.object({
    accountNo: joi
      .string()
      .required()
      .min(10)
      .message("accountNo length must be 10 characters long")
      .max(10)
      .message("accountNo length must be 10 characters long")
      .external(async (accountNo) => {
        let number = Number(accountNo);

        if (!number) {
          throw new Error("AccountNo can only be digits");
        }

        let accountDetails = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].queryAccountNo(accountNo);

        if (accountDetails.ok) {
          return accountNo;
        } else {
          throw new Error(`Account Number '${accountNo} does not exist'`);
        }
      }),
  });

  return schema.validateAsync({ ...data });
}

async function makeDepositValidate(data) {
  const schema = joi.object({
    accountNo: joi
      .string()
      .required()
      .min(10)
      .message("accountNo length must be 10 characters long")
      .max(10)
      .message("accountNo length must be 10 characters long")
      .external(async (accountNo) => {
        let number = Number(accountNo);

        if (!number) {
          throw new Error("AccountNo can only be digits");
        }

        let accountDetails = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].queryAccountNo(accountNo);

        if (accountDetails.ok) {
          return accountNo;
        } else {
          throw new Error(`Account Number '${accountNo} does not exist'`);
        }
      }),
    amount: joi
      .number()
      .min(10)
      .message("A mininum of N10 can be deposited")
      .max(1000000)
      .message("Only N1,000,000 can be deposited at a time")
      .required(),
  });

  return schema.validateAsync({ ...data });
}

async function makeTransferValidate(data) {
  const schema = joi.object({
    sourceAccountNo: joi
      .string()
      .required()
      .min(10)
      .message("accountNo length must be 10 characters long")
      .max(10)
      .message("accountNo length must be 10 characters long")
      .external(async (accountNo) => {
        let number = Number(accountNo);

        if (!number) {
          throw new Error("AccountNo can only be digits");
        }

        let accountDetails = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].queryAccountNo(accountNo);

        if (accountDetails.ok) {
          return accountNo;
        } else {
          throw new Error(`Account Number '${accountNo} does not exist'`);
        }
      }),
    recipientAccountNo: joi
      .string()
      .required()
      .min(10)
      .message("accountNo length must be 10 characters long")
      .max(10)
      .message("accountNo length must be 10 characters long")
      .external(async (accountNo) => {
        let number = Number(accountNo);

        if (!number) {
          throw new Error("AccountNo can only be digits");
        }

        let accountDetails = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].queryAccountNo(accountNo);

        if (accountDetails.ok) {
          return accountNo;
        } else {
          throw new Error(`Account Number '${accountNo} does not exist'`);
        }
      }),
    amount: joi
      .number()
      .min(10)
      .message("A mininum of N10 can be transfered")
      .max(1000000)
      .message("Only N1,000,000 can be transfered at a time")
      .required()
      .external(async (amount) => {
        let sourceAccountBalance = await strapi.services[
          BANK_ACCOUNT_SERVICE
        ].getAccountBalance(data.sourceAccountNo);

        if (sourceAccountBalance.ok) {
          if (
            Number(sourceAccountBalance.data.currentBalance) >= Number(amount)
          ) {
            return amount;
          } else {
            throw new Error(
              "Source account does not have sufficient funds to complete this transaction"
            );
          }
        } else {
          throw new Error("Something went wrong");
        }
      }),
  });

  return schema.validateAsync({ ...data });
}

module.exports = {
  customerSignupValidate,
  queryAccountNoValidate,
  getAccountBalanceValidate,
  openAdditionalValidate,
  makeDepositValidate,
  makeTransferValidate,
  getAccountStatementValidate,
};
