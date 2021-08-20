"use strict";
const RateLimit = require("koa2-ratelimit").RateLimit;

module.exports = async (ctx, next) => {
  const message = {
    id: "Auth.form.error.ratelimit",
    message:
      "Too many attempts, you have exceeded the 3 requests per minute policy. Please try again in a minute.",
  };

  const limiter = RateLimit.middleware({
    interval: { min: 1 },
    max: 3, // limit each IP to 3 requests per a 1 minute interval
    prefixKey: `${ctx.request.path}:${ctx.request.ip}`,
    message,
  });

  return limiter(ctx, next);
};
