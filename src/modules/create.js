const fs = require("fs");

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
  const time = new Date().toLocaleString(); // Hiển thị theo định dạng dd/MM/yyyy HH:mm:ss
  return {
    account: account,
    password,
    skin: "no skin",
    time,
  };
};

const checkDuplicate = (account, data) => {
  return data.some((item) => item.account === account);
};

const saveAccountToJson = (account) => {
  try {
    let accounts = [];
    if (fs.existsSync("./src/data/account.json")) {
      const fileData = fs.readFileSync("./src/data/account.json", "utf8");
      accounts = JSON.parse(fileData);
    }

    if (!checkDuplicate(account.account, accounts)) {
      accounts.push(account);

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

module.exports = {
  generateRandomAccount,
  saveAccountToJson,
};
