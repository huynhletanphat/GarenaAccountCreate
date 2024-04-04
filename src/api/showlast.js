const express = require("express");
const fs = require("fs");

const router = express.Router();

// Hàm giảm token cho một key cụ thể
const reduceTokenForKey = (key) => {
  const keyFilePath = "./src/data/key.json";
  fs.readFile(keyFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc dữ liệu từ tệp key.json:", err);
      return;
    }

    try {
      const keyData = JSON.parse(data);
      const foundKey = keyData.find((item) => item.key === key);
      if (foundKey && parseInt(foundKey.token) > 0) {
        foundKey.token = (parseInt(foundKey.token) - 1).toString();

        // Ghi lại dữ liệu key.json
        fs.writeFile(keyFilePath, JSON.stringify(keyData, null, 2), (err) => {
          if (err) {
            console.error("Lỗi khi ghi dữ liệu vào tệp key.json:", err);
          }
        });
      }
    } catch (parseError) {
      console.error(
        "Lỗi khi phân tích dữ liệu JSON từ tệp key.json:",
        parseError,
      );
    }
  });
};

// Middleware để kiểm tra key và giảm token (nếu cần)
router.use((req, res, next) => {
  const key = req.query.key;

  // Kiểm tra key hợp lệ
  if (!key) {
    return res.status(401).json({
      error: "Vui lòng cung cấp mã bảo mật!",
    });
  }

  // Đọc dữ liệu từ tệp key.json
  fs.readFile("./src/data/key.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc dữ liệu từ tệp key.json:", err);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi đọc dữ liệu." });
    }

    try {
      const keyData = JSON.parse(data);
      const validKey = keyData.find((item) => item.key === key);
      if (!validKey || parseInt(validKey.token) === 0) {
        return res.status(401).json({
          error: "Key không hợp lệ hoặc đã hết token!",
        });
      }

      // Nếu key hợp lệ và còn token, giảm token
      reduceTokenForKey(key);

      next();
    } catch (parseError) {
      console.error(
        "Lỗi khi phân tích dữ liệu JSON từ tệp key.json:",
        parseError,
      );
      res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý dữ liệu." });
    }
  });
});

// Route lấy thông tin tài khoản cuối cùng
router.get("/showlast", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./src/data/account.json", "utf-8"));
  const latestAccount = data[data.length - 1];

  res.json(latestAccount);
});

module.exports = router;
