require("dotenv").config();

const parseIds = (envVar) => {
  const val = process.env[envVar];
  if (!val || !val.trim()) return [];
  return val
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "" && /^-?\d+$/.test(s))
    .map(Number);
};

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || "",
  ADMIN_IDS: parseIds("ADMIN_IDS"),
  USER_IDS: parseIds("USER_IDS"),
  GROUP_IDS: parseIds("GROUP_IDS"),

  validate() {
    if (!this.BOT_TOKEN) {
      throw new Error("❌  BOT_TOKEN не указан в .env файле!");
    }
    if (this.ADMIN_IDS.length === 0) {
      throw new Error(
        "❌  ADMIN_IDS не указан в .env файле! Укажите хотя бы один ID администратора.",
      );
    }
  },
};

module.exports = config;
