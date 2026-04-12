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
    card_in_queue: "ĐANG CHỜ XỬ LÝ...",
    card_tba: "SẮP RA MẮT",
    card_price: "GIÁ VÉ",
    card_details: "CHI TIẾT",
    card_login_required: "Vui lòng đăng nhập để tiếp tục",
    card_retry: "THỬ LẠI",

    // Admin Page
    admin_title: "Quản lý Sự kiện",
    admin_subtitle: "ADMIN_CONTROL_PANEL",
    admin_create_btn: "+ Tạo Sự Kiện Mới",
    admin_table_img: "Ảnh",
    admin_table_name: "Tên Sự Kiện",
    admin_table_loc: "Địa Điểm",
    admin_table_price: "Giá Vé",
    admin_table_date: "Ngày Giờ",
    admin_table_tickets: "Vé (Đã bán/Tổng)",
    admin_table_status: "Trạng Thái",
    admin_table_actions: "Thao Tác",
    admin_edit_btn: "✏️ Sửa",
    admin_no_events: "// KHÔNG_CÓ_SỰ_KIỆN_NÀO — Hãy tạo sự kiện đầu tiên!",
    admin_success_create: "✅ Đã tạo sự kiện thành công!",
    admin_success_update: "✅ Đã cập nhật sự kiện thành công!",
    admin_success_delete: "✅ Đã xóa sự kiện thành công!",
    admin_btn_delete: "🗑️ Xóa",
    admin_confirm_delete_title: "XÁC NHẬN XÓA SỰ KIỆN",
    admin_confirm_delete_body: "Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác.",
    admin_delete_error: "Không thể xóa sự kiện. Vui lòng thử lại.",

    // Event Form
    form_create_title: "// TẠO SỰ KIỆN MỚI",
    form_edit_title: "// SỬA SỰ KIỆN",
    form_label_title: "TÊN SỰ KIỆN *",
    form_label_desc: "MÔ TẢ",
    form_label_date: "NGÀY GIỜ *",
    form_label_loc: "ĐỊA ĐIỂM",
    form_label_price: "GIÁ VÉ (VND) *",
    form_label_tickets: "TỔNG SỐ VÉ *",
    form_label_img: "URL ẢNH SỰ KIỆN",
    form_label_hot: "CHẾ ĐỘ HOT_MODE (ƯU TIÊN BANNER)",
    form_btn_save: "LƯU THAY ĐỔI",
    form_btn_create: "KHỞI TẠO SỰ KIỆN",
    form_btn_upload: "GIẢ LẬP UPLOAD",
    form_status_hot: "TRẠNG THÁI: HOT_MODE_ACTIVE",
    form_dirty_warn: "[ PHÁT_HIỆN_THAY_ĐỔI_CHƯA_LƯU ]",
    form_error_price: "Giá vé không được âm",

    // Confirm Dialog
    confirm_title: "CẢNH BÁO: THAY ĐỔI CHƯA LƯU",
    confirm_body:
      "Bạn có những thay đổi chưa lưu trong biểu mẫu. Bạn có chắc chắn muốn thoát không?",
    confirm_stay: "Ở LẠI",
    confirm_discard: "RỜI ĐI",
    confirm_cancel: "QUAY LẠI",
    confirm_confirm_delete: "XÁC NHẬN XÓA",

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
    tickets_explore: "Khám phá sự kiện",
    tickets_status_confirmed: "Đã xác nhận",
    tickets_status_pending: "Đang xử lý",
    tickets_status_cancelled: "Đã hủy",
    tickets_cancel: "HỦY VÉ",
    tickets_back: "QUAY LẠI DANH SÁCH VÉ",
    tickets_refresh: "LÀM MỚI",
    tickets_empty_msg: "BẠN CHƯA CÓ VÉ NÀO. HÃY SĂN VÉ NGAY!",
    tickets_back_home: "VỀ TRANG CHỦ",
    tickets_id: "JOB_ID",
    tickets_view_map: "XEM ĐỊA ĐIỂM",

    // Ticket Details Page
    details_nav_back: "QUAY LẠI",
    details_schedule: "LỊCH TRÌNH SỰ KIỆN",
    details_location_matrix: "VỊ TRÍ SỰ KIỆN / LOCATION MATRIX",
    details_about: "GIỚI THIỆU SỰ KIỆN",
    details_rules: "QUY TẮC THAM DỰ",
    details_security: "LƯU Ý BẢO MẬT VÉ",
    details_organizer: "NHÀ TỔ CHỨC",
    details_interaction: "TÙY CHỌN TƯƠNG TÁC",
    details_download_pdf: "TẢI PDF VÉ",
    details_google_maps: "MỞ GOOGLE MAPS",
    details_support: "LIÊN HỆ HỖ TRỢ",
    details_error_cancel: "ĐÃ XẢY RA LỖI KHI HỦY VÉ. VUI LÒNG THỬ LẠI SAU.",
    details_success_book: "YÊU CẦU ĐẶT VÉ ĐÃ ĐƯỢC GỬI! VUI LÒNG KIỂM TRA TRẠNG THÁI TRONG MỤC VÉ CỦA TÔI.",
    details_error_book: "KHÔNG THỂ THỰC HIỆN ĐẶT VÉ LÚC NÀY.",
    details_event_id: "EVENT_ID",
    details_status_live: "LIVE",
    details_booking_failed: "ĐẶT VÉ THẤT BẠI",
    details_msg_failed_hint: "Vui lòng chọn mã sự kiện khác hoặc tái khởi động yêu cầu.",
    details_alert_title: "THÔNG BÁO",
    details_alert_ok: "ĐÃ HIỂU",
    details_confirm_cancel_title: "CÁCH LY VÉ",
    details_confirm_cancel_msg: "Bạn đang yêu cầu hủy quyền truy cập vào sự kiện này. Quá trình này không thể thu hồi.",
    details_btn_confirm: "XÁC NHẬN HỦY",
    details_btn_stay: "QUAY LẠI",
    
    events_create_first: "Tạo sự kiện đầu tiên",
    
    // Event Status
    status_available: "CÒN VÉ",
    status_ended: "ĐÃ KẾT THÚC",
    status_sold_out: "HẾT VÉ",
    status_almost: "SẮP HẾT",
    
    // Admin specific labels
    admin_events_in_system: "SỰ KIỆN TRONG HỆ THỐNG",
    admin_label_date_time: "NGÀY & GIỜ",
    admin_label_tickets_sold: "VÉ ĐÃ BÁN",
    admin_breadcrumb_admin: "QUẢN TRỊ",
    admin_breadcrumb_events: "SỰ KIỆN",
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
    card_in_queue: "PENDING QUEUE...",
    card_tba: "TBA",
    card_price: "PRICE",
    card_details: "DETAILS",

    // Admin Page
    admin_title: "Event Management",
    admin_subtitle: "ADMIN_CONTROL_PANEL",
    admin_create_btn: "+ Create New Event",
    admin_table_img: "Img",
    admin_table_name: "Event Name",
    admin_table_loc: "Location",
    admin_table_price: "Price",
    admin_table_date: "Date & Time",
    admin_table_tickets: "Tickets (Sold/Total)",
    admin_table_status: "Status",
    admin_table_actions: "Actions",
    admin_edit_btn: "✏️ Edit",
    admin_no_events: "// NO_EVENTS_FOUND — Create your first event!",
    admin_success_create: "✅ Event created successfully!",
    admin_success_update: "✅ Event updated successfully!",
    admin_success_delete: "✅ Event deleted successfully!",
    admin_btn_delete: "🗑️ Delete",
    admin_confirm_delete_title: "CONFIRM DELETE EVENT",
    admin_confirm_delete_body: "Are you sure you want to delete this event? This action cannot be undone.",
    admin_delete_error: "Cannot delete event. Please try again.",

    // Event Form
    form_create_title: "// CREATE NEW EVENT",
    form_edit_title: "// EDIT EVENT",
    form_label_title: "EVENT TITLE *",
    form_label_desc: "DESCRIPTION",
    form_label_date: "DATE & TIME *",
    form_label_loc: "LOCATION",
    form_label_price: "TICKET PRICE (VND) *",
    form_label_tickets: "TOTAL TICKETS *",
    form_label_img: "EVENT IMAGE URL",
    form_label_hot: "HOT_MODE (BANNER PRIORITY)",
    form_btn_save: "SAVE CHANGES",
    form_btn_create: "INITIALIZE EVENT",
    form_btn_upload: "SIMULATE UPLOAD",
    form_status_hot: "STATUS: HOT_MODE_ACTIVE",
    form_dirty_warn: "[ UN_SAVED_CHANGES_DETECTED ]",
    form_error_price: "Price cannot be negative",

    // Confirm Dialog
    confirm_title: "WARNING: UNSAVED CHANGES",
    confirm_body: "You have unsaved changes in the form. Are you sure you want to discard them?",
    confirm_stay: "STAY",
    confirm_discard: "DISCARD",
    confirm_cancel: "CANCEL",
    confirm_confirm_delete: "YES, DELETE",

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
    tickets_explore: "Explore Events",
    tickets_status_confirmed: "Confirmed",
    tickets_status_pending: "Pending",
    tickets_status_cancelled: "Cancelled",
    tickets_cancel: "CANCEL TICKET",
    tickets_back: "BACK TO TICKETS",
    tickets_refresh: "REFRESH",
    tickets_empty_msg: "NO TICKETS FOUND. START BOOKING NOW!",
    tickets_back_home: "BACK TO HOME",
    tickets_id: "JOB_ID",
    tickets_view_map: "VIEW LOCATION",

    // Ticket Details Page
    details_nav_back: "BACK",
    details_schedule: "EVENT SCHEDULE",
    details_location_matrix: "EVENT LOCATION / LOCATION MATRIX",
    details_about: "ABOUT EVENT",
    details_rules: "ATTENDANCE RULES",
    details_security: "TICKET SECURITY",
    details_organizer: "ORGANIZER",
    details_interaction: "INTERACTION OPTIONS",
    details_download_pdf: "DOWNLOAD PDF",
    details_google_maps: "OPEN GOOGLE MAPS",
    details_support: "SUPPORT INFO",
    details_error_cancel: "AN ERROR OCCURRED WHILE CANCELING THE TICKET. PLEASE TRY AGAIN LATER.",
    details_success_book: "BOOKING REQUEST SENT! PLEASE CHECK STATUS IN MY TICKETS.",
    details_error_book: "CANNOT PERFORM BOOKING AT THIS TIME.",
    details_event_id: "EVENT_ID",
    details_status_live: "LIVE",
    details_booking_failed: "BOOKING FAILED",
    details_msg_failed_hint: "Please select another event or restart the request.",
    details_alert_title: "NOTIFICATION",
    details_alert_ok: "UNDERSTOOD",
    details_confirm_cancel_title: "VACCINATE TICKET",
    details_confirm_cancel_msg: "You are requesting to cancel access to this event. This process cannot be reversed.",
    details_btn_confirm: "CONFIRM CANCEL",
    details_btn_stay: "GO BACK",

    events_create_first: "Create First Event",

    // Event Status
    status_available: "AVAILABLE",
    status_ended: "ENDED",
    status_sold_out: "SOLD OUT",
    status_almost: "ALMOST FULL",

    // Admin specific labels
    admin_events_in_system: "EVENTS IN SYSTEM",
    admin_label_date_time: "DATE & TIME",
    admin_label_tickets_sold: "TICKETS SOLD",
    admin_breadcrumb_admin: "ADMIN",
    admin_breadcrumb_events: "EVENTS",
  }
};
