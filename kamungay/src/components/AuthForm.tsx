import { Link } from "react-router-dom";
export const LoginForm = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen ">
      <div className="w-[90%] max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        {/* Logo inside the box */}
        <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
          {/* Replace with your logo image */}
          <span className="text-gray-500 text-xl font-semibold">Logo</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export const SignUpForm = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-[90%] max-w-md bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        {/* Logo inside the box */}
        <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 mx-auto mb-6 flex items-center justify-center">
          {/* Replace with your logo image */}
          <span className="text-gray-500 text-xl font-semibold">Logo</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Sign Up
        </h2>

        <form className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">Phone</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-500">
                +63
              </span>
              <input
                type="tel"
                placeholder="9123456789"
                pattern="[0-9]{10}"
                maxLength={10}
                className="px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
