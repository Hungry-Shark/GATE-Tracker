import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '../icons/Icons';

const LandingPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays and loops
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Silently handle video play errors (browser autoplay policies)
        console.debug('Video autoplay prevented:', error);
      });
    }
  }, []);

  const navigate = (path: string) => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
          <source src="/bg-video/bg-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay with glowing orange accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/50">
              <span className="relative">
                G
                <span className="absolute -top-1 -right-1 text-xs">★</span>
              </span>
            </div>
            <span className="text-white font-bold text-xl">GATE Tracker</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('signup')}
              className="hidden sm:flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Create Account
            </button>
            <button
              onClick={() => navigate('login')}
              className="flex items-center gap-2 bg-transparent border border-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900/50 transition-all"
            >
              Sign In
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-white text-sm font-medium">
              BEST GATE PREP TOOL 2024
            </span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
            <span className="text-white">Redefining the Future of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              GATE
            </span>
            <span className="text-white"> Preparation</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Tracking
            </span>
            <span className="text-white"> and </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              Accountability
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Bridging cutting-edge technology and educational innovation, our next-generation GATE preparation tracker empowers students with greater control, progress tracking, and study efficiency.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('signup')}
              className="inline-flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-orange-500/20"
            >
              Join Now!
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('login')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all"
            >
              <ArrowRightIcon className="w-6 h-6 rotate-45" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Feature Cards Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Card 1: Track Progress */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all"
          >
            <h3 className="text-xl font-bold mb-2 text-white">Track Progress with Trust</h3>
            <p className="text-sm text-gray-400 mb-4">Assured that you maintain full authority over your study data</p>
            {/* Network Diagram */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-purple-400">
                T
              </div>
              <div className="w-1 h-8 bg-gradient-to-r from-purple-500 to-transparent"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold border-2 border-orange-400 shadow-lg shadow-orange-500/50">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="w-1 h-8 bg-gradient-to-r from-transparent to-purple-500"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold border-2 border-blue-400">
                X
              </div>
            </div>
          </motion.div>

          {/* Card 2: Personal Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all"
          >
            <h3 className="text-xl font-bold mb-2 text-white">Create Your Personal Study Dashboard</h3>
            {/* Card Visual */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="h-12 rounded-lg bg-gray-800/50 border border-gray-700 p-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <div className="flex-1"></div>
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-xs text-white">★</span>
                    </div>
                  </div>
                  <div className="mt-2 h-8 rounded bg-gray-800/50 border border-gray-700 p-2 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    <span className="text-xs text-gray-400">Student ID: 1x1391...q8i12</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Join System */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-6 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all"
          >
            <h3 className="text-xl font-bold mb-2 text-white">Join The Accountability System</h3>
            <p className="text-sm text-gray-400">
              Whether you're a student looking to harness the power of structured learning or an educator seeking to track student progress, our platform provides the tools you need.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-2">+1000 students</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Glowing Accent Lines (Decorative) */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 pointer-events-none z-0">
        <div className="absolute bottom-0 left-0 w-full h-full">
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-transparent via-orange-500/10 to-transparent transform -skew-x-12"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-transparent via-amber-500/10 to-transparent transform skew-x-12"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
