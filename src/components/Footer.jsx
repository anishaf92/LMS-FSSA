export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 px-6 md:px-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">FSSA</h2>
          <p className="text-sm leading-relaxed">
            An internal learning platform built for Freshworks STS Software Academy.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-md mb-3">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Courses</li>
            <li className="hover:text-white cursor-pointer">Support</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-md mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400">
        This platform is for Freshworks STS Software Academy students and coaches only.
      </div>
    </footer>
  );
}