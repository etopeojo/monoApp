"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { createPasswordHash } = require("../../../utils");
const DB_NAME = "customer";

async function findOrCreateCustomer(email, cusData = "") {
  try {
    let customer = await strapi.query(DB_NAME).findOne({ email });
    if (customer) {
      return { ok: true, data: customer };
    } else {
      if (cusData !== "") {
        let data = {
          name: cusData.name,
          email,
          password: createPasswordHash(cusData.password),
        };
        let createResp = await strapi.query(DB_NAME).create(data);
        return { ok: true, data: createResp };
      } else {
        throw new Error("Cannot create customer with invalid data");
      }
    }
  } catch (error) {
    console.error("Error finding/creating customer");
    console.error(error);
    return { ok: false };
  }
}

async function findCustomerByEmail(email) {
  try {
    let customer = await strapi.query(DB_NAME).findOne({ email });
    if (customer) {
      return { ok: true, data: customer };
    } else {
      return { ok: false };
    }
  } catch (error) {
    console.error("Error finding customer by Id");
    console.error(error);
    return { ok: false };
  }
}

async function findCustomerById(id) {
  try {
    let customer = await strapi.query(DB_NAME).findOne({ _id: id });
    if (customer) {
      return { ok: true, data: customer };
    } else {
      return { ok: false };
    }
  } catch (error) {
    console.error("Error finding customer by Id");
    console.error(error);
    return { ok: false };
  }
}

module.exports = {
  findOrCreateCustomer,
  findCustomerById,
  findCustomerByEmail,
};
