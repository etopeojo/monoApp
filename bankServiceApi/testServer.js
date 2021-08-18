const strapiStart = require("strapi");

strapiStart().start(async () => {
  const { createPasswordHash, generateAccountNumber } = require("./utils");

  //   console.log(
  //     await strapi.services["bank-account"].createAccount("etopeojo@gmail.com")
  //   );

  //   console.log(
  //     await strapi.services["bank-account"].getTotalAccountsToCustomer(
  //       "611c8c89a62ecc6b7cc30d1d"
  //     )
  //   );

  //   console.log(
  //     await strapi.services["bank-account"].queryAccountNo("7833929594")
  //   );

  //   console.log(
  //     await strapi.services.customer.findOrCreateCustomer("etopeojo@gmail.com", {
  //       name: "Emmanuel",
  //       password: createPasswordHash("Emmanuel"),
  //     })
  //   );

  //   console.log(
  //     await strapi.services.customer.findCustomerById("611c8c89a62ecc6b7cc30d1d")
  //   );
});
