const express = require("express");
const fs = require("fs");
const moment = require("moment-timezone");

// Key được thiết lập trực tiếp trong mã
const key = "tphatdeptrai";

const generateRandomString = (length, characters) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

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

const checkDuplicate = (account, data) => {
  // Kiểm tra tài khoản đã tồn tại hay chưa trong mảng data
  return data.some((item) => item.account === account);
};

const saveAccountToJson = (account) => {
  try {
    // Đọc dữ liệu từ file JSON
    let accounts = [];
    if (fs.existsSync("./src/data/account.json")) {
      const fileData = fs.readFileSync("./src/data/account.json", "utf8");
      accounts = JSON.parse(fileData);
    }

    // Kiểm tra trùng lặp
    if (!checkDuplicate(account.account, accounts)) {
      accounts.push(account);

      // Ghi dữ liệu mới vào file JSON
      fs.writeFileSync(
        "./src/data/account.json",
        JSON.stringify(accounts, null, 2),
      );
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

const router = express.Router();

router.get("/create", (req, res) => {
  // Xác minh key hợp lệ
  if (req.query.key !== key) {
    return res.json({
      success: false,
      error: "Mã bảo mật không hợp lệ",
    });
  }

  // Tạo tài khoản ngẫu nhiên và lưu vào JSON
  const account = generateRandomAccount();
  const savedAccount = saveAccountToJson(account);

  // Gửi phản hồi JSON
  if (savedAccount) {
    // Trả về đối tượng mà không cần chuyển đổi
    res.send(savedAccount);
  } else {
    res.json({
      success: false,
      error: "Lỗi khi tạo tài khoản",
    });
  }
});

module.exports = router;
