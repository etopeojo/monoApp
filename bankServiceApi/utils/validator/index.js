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

module.exports = { customerSignupValidate, queryAccountNoValidate };
