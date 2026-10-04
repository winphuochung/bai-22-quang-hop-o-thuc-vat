/**
 * ==========================================================================================
 * GOOGLE APPS SCRIPT - BẢNG ĐIỂM CHI TIẾT TỪNG CÂU BÀI 22: QUANG HỢP Ở THỰC VẬT
 * File Google Sheets liên kết:
 * https://docs.google.com/spreadsheets/d/1PXoeDi6YVOr75HJEq1FhK3Xn0YdzcEyui3xV-CWvM04/edit?gid=0#gid=0
 * 
 * TIÊU ĐỀ 28 CỘT CHUẨN XÁC THEO YÊU CẦU:
 * Thời Gian | Họ và Tên | Lớp | Tổng điểm | 
 * TN C1 | TN C2 | TN C3 | TN C4 | TN C5 | TN C6 | TN C7 | TN C8 | TN C9 | TN C10 | 
 * TN C11 | TN C12 | TN C13 | TN C14 | TN C15 | TN C16 | TN C17 | TN C18 | TN C19 | TN C20 | 
 * TL C1 | TL C2 | TL C3 | TL C4
 * ==========================================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Nếu trang tính còn trống, tự động tạo hàng tiêu đề bảng điểm chuẩn chi tiết 28 cột
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian",
        "Họ và Tên",
        "Lớp",
        "Tổng điểm",
        "TN C1",
        "TN C2",
        "TN C3",
        "TN C4",
        "TN C5",
        "TN C6",
        "TN C7",
        "TN C8",
        "TN C9",
        "TN C10",
        "TN C11",
        "TN C12",
        "TN C13",
        "TN C14",
        "TN C15",
        "TN C16",
        "TN C17",
        "TN C18",
        "TN C19",
        "TN C20",
        "TL C1",
        "TL C2",
        "TL C3",
        "TL C4"
      ]);
      
      // Định dạng giao diện tiêu đề: Xanh rừng tự nhiên #1b3a24, chữ trắng in đậm, căn giữa
      var headerRange = sheet.getRange(1, 1, 1, 28);
      headerRange.setBackground("#1b3a24");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setFontSize(10);
      
      // Đặt độ rộng các cột tối ưu
      sheet.setColumnWidth(1, 140); // Thời gian
      sheet.setColumnWidth(2, 180); // Họ và tên
      sheet.setColumnWidth(3, 80);  // Lớp
      sheet.setColumnWidth(4, 110); // Tổng điểm
      
      // Cột TN C1 đến TN C20
      for (var c = 5; c <= 24; c++) {
        sheet.setColumnWidth(c, 70);
      }
      // Cột TL C1 đến TL C4
      for (var l = 25; l <= 28; l++) {
        sheet.setColumnWidth(l, 80);
      }
    }

    // Đọc dữ liệu gửi lên từ Web App
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp  = data.time || new Date().toLocaleString("vi-VN");
    var name       = data.name || "Học sinh";
    var sClass     = data.class || "Lớp 7";
    var totalScore = data.totalScore !== undefined ? data.totalScore : (data.score || "0.0");

    // Lấy điểm từng câu trắc nghiệm TN C1..C20 (mỗi câu 0.5đ nếu đúng, 0đ nếu sai)
    var tnScores = [];
    for (var i = 1; i <= 20; i++) {
      var val = data["c" + i];
      tnScores.push(val !== undefined ? val : 0);
    }

    // Lấy điểm từng câu tự luận TL C1..C4
    var tl1 = data.tl1 !== undefined ? data.tl1 : 0;
    var tl2 = data.tl2 !== undefined ? data.tl2 : 0;
    var tl3 = data.tl3 !== undefined ? data.tl3 : 0;
    var tl4 = data.tl4 !== undefined ? data.tl4 : 0;

    // Dựng hàng dữ liệu đầy đủ 28 cột
    var rowData = [
      timestamp,
      name,
      sClass,
      totalScore
    ].concat(tnScores).concat([tl1, tl2, tl3, tl4]);

    // Ghi thêm dòng kết quả mới của học sinh vào cuối bảng
    sheet.appendRow(rowData);

    // Canh lề các cột kết quả cho ngay ngắn
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 28).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 2).setHorizontalAlignment("left"); // Họ và tên căn trái
    
    // Nổi bật cột Tổng điểm (Cột D)
    var totalCell = sheet.getRange(lastRow, 4);
    totalCell.setFontWeight("bold");
    totalCell.setFontSize(11);
    totalCell.setBackground("#fef3c7"); // Nền vàng nhạt nổi bật

    // Trả về kết quả thành công cho Web App
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu kết quả chi tiết từng câu của " + name + " vào Google Sheets thành công!",
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
    message: "Hệ thống Google Apps Script API Điểm Chi Tiết 28 Cột đang hoạt động bình thường!"
  })).setMimeType(ContentService.MimeType.JSON);
}
