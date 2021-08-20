"use strict";

/**
 * `getAccountStatementValidation` policy.
 */

const { getAccountStatementValidate } = require("../../../../utils/validator");

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In getAccountStatement policy.");

  delete ctx.params["0"];
  console.log(`Request:`, ctx.params);
  try {
    await getAccountStatementValidate(ctx.params);
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
