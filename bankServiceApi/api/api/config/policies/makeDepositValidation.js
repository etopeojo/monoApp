"use strict";

/**
 * `makeDepositValidation` policy.
 */

const { makeDepositValidate } = require("../../../../utils/validator");

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In makeDepositValidate policy.");

  console.log(`Request:`, ctx.request.body);
  try {
    await makeDepositValidate(ctx.request.body);
  } catch (error) {
    if (error.details) {
      console.error(error.details);
      return ctx.unauthorized(error.details[0].message);
    }

    console.error(error);
    return ctx.unauthorized(`${error.message}`);
  }

  return await next();
};
