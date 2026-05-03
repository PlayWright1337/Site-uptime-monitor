const axios = require("axios");

const ping = async (url, timeoutMs = 10_000) => {
  const t0 = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: timeoutMs,
      validateStatus: () => true,
      maxRedirects: 5,
      headers: { "User-Agent": "SiteUptimeMonitorBot/1.0" },
    });

    const responseTime = Date.now() - t0;
    const isUp = response.status < 400;

    return {
      status: isUp ? "up" : "down",
      responseTime,
      httpStatus: response.status,
      error: isUp
        ? null
        : `HTTP ${response.status} ${response.statusText}`.trim(),
    };
  } catch (err) {
    const responseTime = Date.now() - t0;

    const errMap = {
      ECONNREFUSED: "Соединение отклонено",
      ENOTFOUND: "Хост не найден (DNS)",
      ETIMEDOUT: "Таймаут соединения",
      ECONNABORTED: "Таймаут соединения",
      ECONNRESET: "Соединение сброшено сервером",
      EHOSTUNREACH: "Хост недоступен",
      CERT_HAS_EXPIRED: "SSL-сертификат истёк",
      UNABLE_TO_VERIFY_LEAF_SIGNATURE: "Ошибка SSL-сертификата",
      ERR_TLS_CERT_ALTNAME_INVALID: "Некорректный SSL-сертификат",
    };

    const error =
      errMap[err.code] ||
      errMap[err.cause?.code] ||
      err.message ||
      "Неизвестная ошибка";

    return { status: "down", responseTime, httpStatus: null, error };
  }
};

module.exports = ping;
