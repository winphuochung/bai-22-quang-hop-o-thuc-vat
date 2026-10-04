/**
 * Google Apps Script - Đồng Bộ Kết Quả Học Tập "Bài 22 Quang Hợp Ở Thực Vật"
 * Hướng dẫn cài đặt:
 * 1. Mở file Google Sheets: https://docs.google.com/spreadsheets/d/1PXoeDi6YVOr75HJEq1FhK3Xn0YdzcEyui3xV-CWvM04/edit?gid=0#gid=0
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script
 * 3. Xóa mã cũ và dán toàn bộ đoạn code này vào file Code.gs
 * 4. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment)
 * 5. Chọn loại: "Ứng dụng web" (Web app)
 *    - Mô tả: "LMS Quang Hop Sync API"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 6. Bấm "Triển khai" và sao chép Web App URL (dạng https://script.google.com/macros/s/.../exec)
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nếu sheet còn trống, tự động tạo hàng tiêu đề chuẩn
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian",
        "Họ và Tên",
        "Lớp",
        "Điểm Số (Thang 10)",
        "Số Câu Đúng",
        "Xếp Loại",
        "Trạng Thái"
      ]);
      // Định dạng hàng tiêu đề (Màu xanh rừng, chữ trắng, in đậm)
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#1b3a24");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp = data.time || new Date().toLocaleString("vi-VN");
    var name = data.name || "Học sinh";
    var sClass = data.class || "Lớp 7";
    var score = data.score || "0";
    var correctCount = data.correctCount ? (data.correctCount + "/20") : "0/20";
    var rank = data.rank || "Chưa xếp loại";
    var status = "Đã đồng bộ";

    // Thêm dòng kết quả của học sinh vào Google Sheets
    sheet.appendRow([
      timestamp,
      name,
      sClass,
      score,
      correctCount,
      rank,
      status
    ]);

    // Trả về JSON thành công kèm CORS Header
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu kết quả vào Google Sheets thành công!",
      timestamp: timestamp,
      name: name
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Google Apps Script API đang hoạt động bình thường!"
  })).setMimeType(ContentService.MimeType.JSON);
}
