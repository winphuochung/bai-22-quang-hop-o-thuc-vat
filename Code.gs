/**
 * Code.gs — Web App KHTN 7 Bài 22 - Quang hợp ở thực vật
 * Nhận kết quả học sinh gửi từ web/app học tập và ghi vào
 * Google Sheets (tab "KetQua") trong Google Drive của Thầy.
 * File này do Muse tạo tự động bằng Apps Script API (dự án gắn với Sheet).
 */

const SHEET_NAME = "KetQua";

// Nhận kết quả từ web/app (POST)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    // Tạo dòng tiêu đề nếu Sheet còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời gian",
        "Họ tên học sinh",
        "Lớp",
        "Điểm (/10)",
        "Số câu đúng",
        "Chi tiết đáp án (Câu: đáp án HS/đáp án đúng)",
        "Thời gian làm bài"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.className || "",
      data.score ?? "",
      (data.correct ?? "") + "/10",
      data.detail || "",
      data.duration || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ result: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Mở link Web App trên trình duyệt để kiểm tra: phải thấy dòng này thì link mới sống.
function doGet() {
  return ContentService.createTextOutput(
    "Web App KHTN 7 - Bài 22 - Quang hợp ở thực vật đang hoạt động. Dùng POST để gửi kết quả."
  );
}
