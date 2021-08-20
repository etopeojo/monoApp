const seedrandom = require("seedrandom");
const { customRandom, customAlphabet } = require("nanoid");
const crypto = require("crypto");

async function generateAccountNumber(email) {
  const rng = seedrandom(
    `${email}${Date.now()}${customAlphabet("0123456789", 7)()}`
  );

  const nanoid = customRandom("0123456789", 10, (size) => {
    return new Uint8Array(size).map(() => 256 * rng());
  });

  return nanoid();
}

function createPasswordHash(password) {
  const hash = crypto.createHash("sha512");
  return hash.update(String(password)).digest("hex");
}

function generateRESTResponse(status, message, body = {}) {
  let response = {
    status,
    message,
  };

  if (Object.keys(body).length > 0) {
    response.data = body;
  }

  return response;
}

function generateRandomNumbers(numberlength = 12) {
  return customAlphabet("0123456789", numberlength)();
}
module.exports = {
  generateAccountNumber,
  createPasswordHash,
  generateRESTResponse,
  generateRandomNumbers,
};
