// Trong file runreg.js

const fs = require("fs");

const readAccountStream = () => {
  const data = JSON.parse(fs.readFileSync("./src/data/account.json", "utf-8"));
  let currentLine = 0;
  let previousSkin = null;

  const readLine = () => {
    if (currentLine >= data.length) {
      console.log("Đã đọc hết dữ liệu!");
      return;
    }

    const account = data[currentLine];
    const { account: username, password, skin } = account;

    if (previousSkin !== null) {
      console.log(
        `Thay đổi skin thành "${previousSkin}" cho tài khoản trước đó.`,
      );
    }

    console.log(`-------------------------------------------------`);
    console.log(`| **Tài khoản:** ${username} |`);
    console.log(`| **Mật khẩu:** ${password} |`);
    console.log(`| **Skin hiện tại:** ${skin} |`);
    console.log(`-------------------------------------------------`);

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(
      "Nhập skin mới hoặc từ khóa (hoặc Enter để giữ nguyên): ",
      (newSkin) => {
        if (newSkin) {
          account.skin = newSkin;
          previousSkin = newSkin;
          // Cập nhật dữ liệu vào tệp JSON
          fs.writeFileSync(
            "./src/data/account.json",
            JSON.stringify(data, null, 2),
          );
        }

        currentLine++;
        readLine();
      },
    );
  };

  readLine();
};

module.exports = readAccountStream; // Xuất hàm readAccountStream
