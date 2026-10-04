/**
 * ==========================================================================================
 * GOOGLE APPS SCRIPT - BẢNG ĐIỂM CHI TIẾT BÀI 22: QUANG HỢP Ở THỰC VẬT
 * File Google Sheets liên kết:
 * https://docs.google.com/spreadsheets/d/1PXoeDi6YVOr75HJEq1FhK3Xn0YdzcEyui3xV-CWvM04/edit?gid=0#gid=0
 * 
 * Thể hiện đầy đủ:
 * - Điểm Trắc Nghiệm (20 câu, số câu đúng)
 * - Điểm Tự Luận (4 câu và chi tiết từng câu C1, C2, C3, C4)
 * - Tổng Điểm (Thang 10 chuẩn)
 * ==========================================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nếu trang tính còn trống, tự động tạo hàng tiêu đề bảng điểm chuẩn chi tiết 9 cột
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian",
        "Họ và Tên",
        "Lớp",
        "Điểm Trắc Nghiệm",
        "Số Câu Đúng (MCQ)",
        "Điểm Tự Luận",
        "Chi Tiết Tự Luận",
        "TỔNG ĐIỂM (10.0)",
        "Xếp Loại"
      ]);
      
      // Định dạng giao diện tiêu đề: Xanh rừng tự nhiên #1b3a24, chữ trắng in đậm, căn giữa
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground("#1b3a24");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setFontSize(11);
      
      // Đặt độ rộng các cột tối ưu cho việc quan sát
      sheet.setColumnWidth(1, 140); // Thời gian
      sheet.setColumnWidth(2, 180); // Họ và tên
      sheet.setColumnWidth(3, 80);  // Lớp
      sheet.setColumnWidth(4, 140); // Điểm trắc nghiệm
      sheet.setColumnWidth(5, 140); // Số câu đúng
      sheet.setColumnWidth(6, 120); // Điểm tự luận
      sheet.setColumnWidth(7, 180); // Chi tiết tự luận (C1, C2, C3, C4)
      sheet.setColumnWidth(8, 140); // Tổng điểm
      sheet.setColumnWidth(9, 120); // Xếp loại
    }

    // Đọc dữ liệu gửi lên từ Web App
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp      = data.time || new Date().toLocaleString("vi-VN");
    var name           = data.name || "Học sinh";
    var sClass         = data.class || "Lớp 7";
    var mcqScore       = data.mcqScore !== undefined ? (data.mcqScore + "đ") : (data.score ? data.score + "đ" : "0.0đ");
    var mcqCorrect     = data.mcqCorrect !== undefined ? (data.mcqCorrect + "/20") : (data.correctCount ? data.correctCount + "/20" : "0/20");
    var essayScore     = data.essayScore !== undefined ? (data.essayScore + "đ") : "0.0đ";
    var essayBreakdown = data.essayBreakdown || "C1: 0 | C2: 0 | C3: 0 | C4: 0";
    var totalScore     = data.totalScore !== undefined ? data.totalScore : (data.score || "0.0");
    var rank           = data.rank || "Chưa xếp loại";

    // Ghi thêm dòng kết quả mới của học sinh vào cuối bảng
    sheet.appendRow([
      timestamp,
      name,
      sClass,
      mcqScore,
      mcqCorrect,
      essayScore,
      essayBreakdown,
      totalScore,
      rank
    ]);

    // Canh lề các cột kết quả cho ngay ngắn
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 9).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 2).setHorizontalAlignment("left"); // Họ và tên căn trái
    sheet.getRange(lastRow, 7).setHorizontalAlignment("left"); // Chi tiết C1-C4 căn trái
    
    // Nổi bật cột Tổng Điểm (Chữ in đậm màu hổ phách/xanh lá)
    var totalCell = sheet.getRange(lastRow, 8);
    totalCell.setFontWeight("bold");
    totalCell.setFontSize(11);

    // Trả về kết quả thành công cho Web App
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu kết quả chi tiết của " + name + " vào Google Sheets thành công!",
      timestamp: timestamp,
      totalScore: totalScore
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm kiểm tra trạng thái hoạt động của Web App
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "Hệ thống Google Apps Script API Điểm Chi Tiết đang hoạt động bình thường!"
  })).setMimeType(ContentService.MimeType.JSON);
}
