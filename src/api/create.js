const express = require("express");
const fs = require("fs");
const moment = require("moment-timezone");
const path = require("path");

const router = express.Router();

// Đường dẫn tuyệt đối đến tệp key.json
const keyFilePath = path.resolve(__dirname, "../data/key.json");
let keyData = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

// Hàm giảm token cho một key cụ thể
const reduceTokenForKey = (key) => {
  const foundKey = keyData.find((item) => item.key === key);
  if (foundKey && parseInt(foundKey.token) > 0) {
    foundKey.token = (parseInt(foundKey.token) - 1).toString();
    fs.writeFileSync(keyFilePath, JSON.stringify(keyData, null, 2));
    return parseInt(foundKey.token);
  }
  return 0;
};

// Middleware để kiểm tra key và giảm token (nếu cần)
const checkAndReduceToken = (req, res, next) => {
  const key = req.query.key;

  // Kiểm tra key hợp lệ
  if (!key) {
    return res.status(401).json({
      error: "Vui lòng cung cấp mã bảo mật!",
    });
  }

  // Tìm key trong danh sách keyData
  const foundKey = keyData.find((item) => item.key === key);
  if (!foundKey) {
    return res.status(401).json({
      error: "Mã bảo mật không hợp lệ!",
    });
  }

  // Giảm token nếu còn hạn
  const remainingToken = reduceTokenForKey(key);
  if (remainingToken >= 0) {
    // Tiếp tục middleware
    next();
  } else {
    // Nếu token hết hạn, trả về lỗi
    return res.status(200).json({
      error: "Mã bảo mật đã hết token!",
    });
  }
};

// Hàm tạo chuỗi ngẫu nhiên
const generateRandomString = (length, characters) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Hàm tạo tài khoản ngẫu nhiên
const generateRandomAccount = () => {
  const account = `phatxyz${generateRandomString(3, "0123456789")}${generateRandomString(3, "abcdefghijklmnopqrstuvwxyz")}`;
  const password = `${generateRandomString(1, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")}${generateRandomString(6, "abcdefghijklmnopqrstuvwxyz")}${generateRandomString(3, "0123456789")}${generateRandomString(1, "?!")}`;
  const time = moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"); // Đặt múi giờ thành múi giờ Việt Nam
  return {
    account: account,
    password,
    skin: "no skin",
    time,
  };
};

// Hàm kiểm tra tài khoản đã tồn tại
const checkDuplicate = (account, data) => {
  return data.some((item) => item.account === account);
};

const saveAccountToJson = (account) => {
  try {
    let accounts = [];
    const accountFilePath = path.resolve(__dirname, "../data/account.json");
    if (fs.existsSync(accountFilePath)) {
      const fileData = fs.readFileSync(accountFilePath, "utf8");
      accounts = JSON.parse(fileData);
    }

    if (!checkDuplicate(account.account, accounts)) {
      accounts.push(account);
      fs.writeFileSync(accountFilePath, JSON.stringify(accounts, null, 2));
      return account;
    } else {
      console.log("Tài khoản đã tồn tại!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi:", error.message);
    return null;
  }
};

router.get("/create", checkAndReduceToken, (req, res) => {
  // Tạo tài khoản ngẫu nhiên và lưu vào JSON
  const account = generateRandomAccount();
  const savedAccount = saveAccountToJson(account);

  // Gửi phản hồi JSON
  if (savedAccount) {
    res.send(savedAccount);
  } else {
    res.json({
      success: false,
      error: "Lỗi khi tạo tài khoản",
    });
  }
});

module.exports = router;
