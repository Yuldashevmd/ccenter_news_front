import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLocalStorageItem } from 'shared/services';

const baseEmail = import.meta.env.VITE_APP_EMAIL || "";
const basePassword = import.meta.env.VITE_APP_PASSWORD || "";


export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    if(baseEmail == email && basePassword == password) {
      setLocalStorageItem("isAuth", true);
      setLocalStorageItem("user", { email, password });
      setTimeout(() => setLoading(false), 2000);
      navigate('/');
    }
  };
  return (
    <main className="w-full h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center">
      <div className="w-full max-w-[30rem] bg-white p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Ccenter News</h3>
        <form onSubmit={onLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <button
              title="Login"
              type="submit"
              disabled={loading}
              className={`w-full py-2 cursor-pointer text-white font-semibold rounded-lg transition-colors duration-300
              bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
