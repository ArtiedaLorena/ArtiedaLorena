import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Heart, MapPin, MessageCircle } from 'react-feather';

const NotFoundPage = () => {
  const quickLinks = [
    {
      icon: Home,
      title: 'Go Home',
      description: 'Return to the main page',
      link: '/',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Search,
      title: 'Discover People',
      description: 'Find new friends nearby',
      link: '/discover',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Heart,
      title: 'View Matches',
      description: 'See your current matches',
      link: '/matches',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: MessageCircle,
      title: 'Messages',
      description: 'Check your conversations',
      link: '/messages',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Large 404 Text */}
            <div className="text-9xl font-bold text-gray-200 select-none">
              404
            </div>
            
            {/* Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off to find new friends. 
            Don't worry, we can help you get back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <Link
            to="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.link}
                  className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {link.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-6">
            If you're having trouble finding what you're looking for, our support team is here to help!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="mailto:support@friendmatch.com"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </a>
            
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Help Center
            </a>
            
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              FAQ
            </a>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border border-pink-200 max-w-md mx-auto">
          <p className="text-sm text-pink-800">
            <strong>Fun Fact:</strong> The 404 error was first introduced in 1990 by Tim Berners-Lee 
            while working on the World Wide Web at CERN. It's now one of the most famous error codes!
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 FriendMatch. Making friends, one connection at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;