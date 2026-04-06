/**
 * translations.js — Module: UI | Flash Sale Project
 * Dictionary of localized strings for Multi-language support (Vi/En).
 */

export const translations = {
  vi: {
    // Navigation
    nav_home: "Trang Chủ",
    nav_admin: "Quản Trị",
    nav_login: "Đăng Nhập",
    nav_logout: "Đăng Xuất",
    nav_myTickets: "Vé của tôi",

    // Events Page
    events_title: "Sự Kiện Flash Sale",
    events_hot_title: "SỰ KIỆN HOT",
    events_all_title: "DANH SÁCH SỰ KIỆN",
    events_no_hot: "[ KHÔNG_CÓ_SỰ_KIỆN_NỔI_BẬT ]",
    events_no_all: "[ KHÔNG_CÓ_SỰ_KIỆN_NÀO ]",
    events_loading: "ĐANG_TẢI_DỮ_LIỆU...",
    events_error_sync: "LỖI ĐỒNG BỘ HỆ THỐNG",
    events_reboot: "THỬ LẠI",
    events_stable: "TRẠNG THÁI: ỔN ĐỊNH",
    events_version: "PHIÊN BẢN v1.0.4",

    // Event Card
    card_date: "Ngày:",
    card_location: "Địa điểm:",
    card_tickets: "Vé còn lại:",
    card_sold_out: "HẾT VÉ",
    card_book_now: "ĐẶT VÉ NGAY",
    card_hot_badge: "HOT",
    card_id: "ID",
    card_tickets_sold: "Đã bán",
    card_left: "Còn",
    card_success: "THÀNH CÔNG",
    card_requesting: "ĐANG XỬ LÝ...",
    card_in_queue: "ĐANG CHỜ HÀNG...",
    card_tba: "Sắp ra mắt",

    // Admin Page
    admin_title: "Quản lý Sự kiện",
    admin_subtitle: "ADMIN_CONTROL_PANEL",
    admin_create_btn: "+ Tạo Sự Kiện Mới",
    admin_table_img: "Ảnh",
    admin_table_name: "Tên Sự Kiện",
    admin_table_loc: "Địa Điểm",
    admin_table_date: "Ngày Giờ",
    admin_table_tickets: "Vé (Đã bán/Tổng)",
    admin_table_status: "Trạng Thái",
    admin_table_actions: "Thao Tác",
    admin_edit_btn: "✏️ Sửa",
    admin_no_events: "// KHÔNG_CÓ_SỰ_KIỆN_NÀO — Hãy tạo sự kiện đầu tiên!",
    admin_success_create: "✅ Đã tạo sự kiện thành công!",
    admin_success_update: "✅ Đã cập nhật sự kiện thành công!",

    // Event Form
    form_create_title: "// TẠO SỰ KIỆN MỚI",
    form_edit_title: "// SỬA SỰ KIỆN",
    form_label_title: "TÊN SỰ KIỆN *",
    form_label_desc: "MÔ TẢ",
    form_label_date: "NGÀY GIỜ *",
    form_label_loc: "ĐỊA ĐIỂM",
    form_label_tickets: "TỔNG SỐ VÉ *",
    form_label_img: "URL ẢNH SỰ KIỆN",
    form_label_hot: "CHẾ ĐỘ HOT_MODE (ƯU TIÊN BANNER)",
    form_btn_save: "LƯU THAY ĐỔI",
    form_btn_create: "KHỞI TẠO SỰ KIỆN",
    form_btn_upload: "GIẢ LẬP UPLOAD",
    form_status_hot: "TRẠNG THÁI: HOT_MODE_ACTIVE",
    form_dirty_warn: "[ PHÁT_HIỆN_THAY_ĐỔI_CHƯA_LƯU ]",

    // Confirm Dialog
    confirm_title: "CẢNH BÁO: THAY ĐỔI CHƯA LƯU",
    confirm_body:
      "Bạn có những thay đổi chưa lưu trong biểu mẫu. Bạn có chắc chắn muốn thoát không?",
    confirm_stay: "Ở LẠI",
    confirm_discard: "RỜI ĐI",

    // My Tickets Page
    tickets_title: "VÉ CỦA TÔI",
    tickets_querying: "ĐANG_TRUY_VẤN_DỮ_LIỆU_CHUỖI...",
    tickets_empty: "BẠN_CHƯA_SỞ_HỮU_TÀI_SẢN_VÉ_NÀO",

    // Login Page
    login_subtitle: "Nền tảng săn vé sự kiện chịu tải cao",
    login_btn_google: "ĐĂNG NHẬP VỚI GOOGLE",
    login_secure_protocol: "GIAO THỨC XÁC THỰC BẢO MẬT",
    login_terminal:
      "> KHỞI TẠO GIAO THỨC XÁC THỰC... \n> TRUY CẬP HỆ THỐNG CHÍNH... \n> TRẠNG THÁI: ĐÃ MÃ HÓA \n> VUI LÒNG XÁC MINH DANH TÍNH_",
    login_encryption: "MÃ HÓA: AES-256",
    login_protocol: "GIAO THỨC: OAUTH_2.0",

    // Auth Callback Page
    auth_processing: "Đang xác thực danh tính...",
    auth_subtext: "Hệ thống đang kiểm tra chữ ký số của bạn. Vui lòng giữ kết nối.",
    auth_error_title: "LỖI XÁC THỰC",
    auth_error_btn: "QUAY LẠI ĐĂNG NHẬP",

    auth_error_no_token: "Không tìm thấy token xác thực trong URL",
    auth_error_token_fail: "Xác thực thất bại, vui lòng thử lại",

    // New keys for UI improvements
    card_login_required: "Vui lòng đăng nhập để tiếp tục",
    card_retry: "Thử lại",
    tickets_explore: "Khám phá sự kiện",
    tickets_status_confirmed: "Đã xác nhận",
    tickets_status_pending: "Đang xử lý",
    tickets_status_cancelled: "Đã hủy",
    events_create_first: "Tạo sự kiện đầu tiên"
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_admin: "Admin",
    nav_login: "Login",
    nav_logout: "Logout",
    nav_myTickets: "My Tickets",

    // Events Page
    events_title: "Flash Sale Events",
    events_hot_title: "HOT EVENTS",
    events_all_title: "EVENT GRID",
    events_no_hot: "[ NO_FEATURED_EVENTS_FOUND ]",
    events_no_all: "[ NO_EVENTS_SEQUENCED ]",
    events_loading: "LOADING_SYSTEM_DATA...",
    events_error_sync: "SYSTEM_SYNC_ERROR",
    events_reboot: "REBOOT",
    events_stable: "STATUS: STABLE",
    events_version: "VERSION v1.0.4",

    // Event Card
    card_date: "Date:",
    card_location: "Location:",
    card_tickets: "Tickets left:",
    card_sold_out: "SOLD OUT",
    card_book_now: "BOOK NOW",
    card_hot_badge: "HOT",
    card_id: "ID",
    card_tickets_sold: "Sold",
    card_left: "Left",
    card_success: "SUCCESS",
    card_requesting: "REQUESTING...",
    card_in_queue: "IN QUEUE...",
    card_tba: "TBA",

    // Admin Page
    admin_title: "Event Management",
    admin_subtitle: "ADMIN_CONTROL_PANEL",
    admin_create_btn: "+ Create New Event",
    admin_table_img: "Img",
    admin_table_name: "Event Name",
    admin_table_loc: "Location",
    admin_table_date: "Date & Time",
    admin_table_tickets: "Tickets (Sold/Total)",
    admin_table_status: "Status",
    admin_table_actions: "Actions",
    admin_edit_btn: "✏️ Edit",
    admin_no_events: "// NO_EVENTS_FOUND — Create your first event!",
    admin_success_create: "✅ Event created successfully!",
    admin_success_update: "✅ Event updated successfully!",

    // Event Form
    form_create_title: "// CREATE NEW EVENT",
    form_edit_title: "// EDIT EVENT",
    form_label_title: "EVENT TITLE *",
    form_label_desc: "DESCRIPTION",
    form_label_date: "DATE & TIME *",
    form_label_loc: "LOCATION",
    form_label_tickets: "TOTAL TICKETS *",
    form_label_img: "EVENT IMAGE URL",
    form_label_hot: "HOT_MODE (BANNER PRIORITY)",
    form_btn_save: "SAVE CHANGES",
    form_btn_create: "INITIALIZE EVENT",
    form_btn_upload: "SIMULATE UPLOAD",
    form_status_hot: "STATUS: HOT_MODE_ACTIVE",
    form_dirty_warn: "[ UN_SAVED_CHANGES_DETECTED ]",

    // Confirm Dialog
    confirm_title: "WARNING: UNSAVED CHANGES",
    confirm_body: "You have unsaved changes in the form. Are you sure you want to discard them?",
    confirm_stay: "STAY",
    confirm_discard: "DISCARD",

    // My Tickets Page
    tickets_title: "MY TICKETS",
    tickets_querying: "QUERYING_CHAIN_DATA...",
    tickets_empty: "NO_TICKET_ASSETS_OWNED_BY_USER",

    // Login Page
    login_subtitle: "High-performance flash sale ticketing platform",
    login_btn_google: "SIGN IN WITH GOOGLE",
    login_secure_protocol: "SECURE AUTHENTICATION PROTOCOL",
    login_terminal:
      "> INITIALIZING_AUTH_PROTOCOL... \n> ACCESSING_MAINFRAME... \n> STATUS: ENCRYPTED \n> PLEASE_IDENTIFY_YOURSELF_",
    login_encryption: "ENCRYPTION: AES-256",
    login_protocol: "PROTOCOL: OAUTH_2.0",

    // Auth Callback Page
    auth_processing: "Authenticating Identity...",
    auth_subtext: "System is verifying your digital signature. Please stay connected.",
    auth_error_title: "AUTHENTICATION_ERROR",
    auth_error_btn: "BACK_TO_LOGIN",

    auth_error_no_token: "No authentication token found in URL",
    auth_error_token_fail: "Authentication failed, please try again",

    // New keys for UI improvements
    card_login_required: "Please login to continue",
    card_retry: "Retry",
    tickets_explore: "Explore Events",
    tickets_status_confirmed: "Confirmed",
    tickets_status_pending: "Pending",
    tickets_status_cancelled: "Cancelled",
    events_create_first: "Create First Event"
  }
};
