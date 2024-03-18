const express = require("express");
const fs = require("fs");

const router = express.Router();

// Middleware để kiểm tra key
router.use((req, res, next) => {
  const key = req.query.key;

  if (key !== "tphatdeptrai") {
    return res.status(401).json({
      error: "Key không hợp lệ!",
    });
  }

  next();
});

// Route lấy thông tin tài khoản
router.get("/showlast", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./src/data/account.json", "utf-8"));
  const latestAccount = data[data.length - 1];

  res.json(latestAccount);
});

module.exports = router;
