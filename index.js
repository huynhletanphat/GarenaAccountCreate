const express = require("express");
const {
  generateRandomAccount,
  saveAccountToJson,
} = require("./src/modules/create");
const readAccountStream = require("./src/modules/runreg"); // Đảm bảo bạn đã import đúng cách
const showlast = require("./src/api/showlast");
const create = require("./src/api/create");
const findskin = require("./src/api/findskin");

const app = express();

app.use("/v1", showlast);
app.use("/v1", create);
app.use("/v1", findskin);

app.listen(8080, () => {
  console.log("Server đang chạy trên cổng 8080!");
});

// Hàm chạy chương trình
function runProgram() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const runMode = () => {
    readline.question(
      `Vui lòng chọn chương trình muốn chạy:
        1. Random Tài khoản mật khẩu (không trùng với bất kì dữ liệu nào ở Garena account)
        2. Check Data Account reg
        3. Thoát chương trình\n`,
      (mode) => {
        if (mode === "1") {
          console.log("Chương trình Random Tài khoản mật khẩu đã được chọn.");
          const account = generateRandomAccount();
          saveAccountToJson(account);
          runMode();
        } else if (mode === "2") {
          console.log("Chương trình Check Data Account reg đã được chọn.");
          readAccountStream();
        } else if (mode === "3") {
          console.log("Kết thúc chương trình.");
          readline.close();
        } else {
          console.log("Chế độ không hợp lệ!");
          runMode();
        }
      },
    );
  };

  runMode();
}

// Gọi hàm chạy chương trình khi index.js được chạy trực tiếp
if (require.main === module) {
  runProgram();
}

module.exports = {
  runProgram,
};
