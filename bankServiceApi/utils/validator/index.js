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
        if (number !== NaN) {
          return accountNo;
        } else {
          throw new Error("AccountNo can only be digits");
        }
      }),
  });

  return schema.validateAsync({ ...data });
}

module.exports = {
  customerSignupValidate,
  queryAccountNoValidate,
  openAdditionalValidate,
};
