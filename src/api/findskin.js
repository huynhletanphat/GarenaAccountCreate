const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/find", (req, res) => {
  let { skin, key } = req.query;

  // Xử lý dấu cách trong skin
  if (skin) {
    skin = skin.replace(/%20/g, " "); // Thay thế tất cả %20 bằng khoảng trống
  }

  // Kiểm tra mã bảo mật
  if (!key || key !== "tphatdeptrai") {
    return res.json({
      success: false,
      error: "Mã bảo mật không hợp lệ",
    });
  }

  // Đọc dữ liệu từ tệp account.json
  fs.readFile("./src/data/account.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc dữ liệu từ tệp account.json:", err);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi đọc dữ liệu." });
    }

    try {
      const accounts = JSON.parse(data);
      const foundAccounts = accounts.filter((account) =>
        account.skin.toLowerCase().includes(skin.toLowerCase()),
      );

      // Trả về các tài khoản có skin liên quan dưới dạng JSON
      res.send(JSON.parse(JSON.stringify(foundAccounts)));
    } catch (parseError) {
      console.error(
        "Lỗi khi phân tích dữ liệu JSON từ tệp account.json:",
        parseError,
      );
      res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý dữ liệu." });
    }
  });
});

module.exports = router;
