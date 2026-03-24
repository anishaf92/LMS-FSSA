// import heroImg from "../assets/hero.jpg";

function Hero() {
  return (
    <div className="flex items-center justify-between px-16 py-20">
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold mb-6">FSSA LMS</h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          FSSA LMS is a Learning Management System, designed to support
          structured learning and skill development.
        </p>

        <div className="flex gap-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full">
            View Courses
          </button>

          <button className="border border-blue-500 text-blue-500 px-6 py-2 rounded-full">
            How It Works
          </button>
        </div>
      </div>

      <div>
        <img
          src={"https://images.unsplash.com/photo-1522202176988-66273c2fd55f"}
          alt="hero"
          className="w-[475px] h-[450px] object-cover rounded-full"
        />
      </div>
    </div>
  );
}

export default Hero;