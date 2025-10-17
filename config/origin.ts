export const originConfig = {
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(" ").map((origin) => origin.trim())
    : [],
};
