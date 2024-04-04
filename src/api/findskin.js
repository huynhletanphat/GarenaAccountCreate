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

router.get("/find", (req, res) => {
  let { skin, key } = req.query;

  // Xử lý dấu cách trong skin
  if (skin) {
    skin = skin.replace(/%20/g, " "); // Thay thế tất cả %20 bằng khoảng trống
  }

  // Kiểm tra mã bảo mật
  if (!key) {
    return res.json({
      success: false,
      error: "Vui lòng cung cấp mã bảo mật",
    });
  }

  fs.readFile("./src/data/key.json", "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc dữ liệu từ tệp key.json:", err);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi đọc dữ liệu." });
    }

    try {
      const keyData = JSON.parse(data);
      const validKey = keyData.find((item) => item.key === key);
      if (!validKey || parseInt(validKey.token) === 0) {
        return res.json({
          success: false,
          error: "Key đã hết hạn",
        });
      }

      reduceTokenForKey(key);

      fs.readFile("./src/data/account.json", "utf8", (err, data) => {
        if (err) {
          console.error("Lỗi khi đọc dữ liệu từ tệp account.json:", err);
          return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi khi đọc dữ liệu." });
        }

        try {
          const accounts = JSON.parse(data);
          const foundAccounts = accounts.filter((account) =>
            account.skin.toLowerCase().includes(skin.toLowerCase()),
          );

          res.send(JSON.parse(JSON.stringify(foundAccounts)));
        } catch (parseError) {
          console.error(
            "Lỗi khi phân tích dữ liệu JSON từ tệp account.json:",
            parseError,
          );
          res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý dữ liệu." });
        }
      });
    } catch (parseError) {
      console.error(
        "Lỗi khi phân tích dữ liệu JSON từ tệp key.json:",
        parseError,
      );
      res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý dữ liệu." });
    }
  });
});

module.exports = router;
