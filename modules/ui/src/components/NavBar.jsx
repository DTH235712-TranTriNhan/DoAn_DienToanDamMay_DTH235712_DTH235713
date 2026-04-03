import { Link } from 'react-router-dom';

const NavBar = ({ user }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Trang chủ */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600">
              EventHub
            </Link>
          </div>

          {/* Menu bên phải */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/my-tickets" 
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Vé của tôi
                </Link>
                
                {/* Thông tin User */}
                <div className="flex items-center space-x-2 border-l border-gray-300 pl-4">
                  <img
                    src={user.avatar || 'https://ui-avatars.com/api/?name=' + user.name}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>

                <button className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                Đăng nhập với Google
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default NavBar;       