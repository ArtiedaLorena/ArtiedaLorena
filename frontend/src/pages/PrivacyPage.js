import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Bell } from 'react-feather';

const PrivacyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, complete your profile, or communicate with other users. This includes your name, email, photos, interests, location, and bio.`,
      icon: Database
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to provide, maintain, and improve our services, to process your requests, to communicate with you, and to ensure the safety and security of our platform.`,
      icon: Eye
    },
    {
      title: 'Information Sharing',
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.`,
      icon: Users
    },
    {
      title: 'Data Security',
      content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`,
      icon: Lock
    },
    {
      title: 'Location Services',
      content: `We collect location information to provide location-based matching services. You can control location sharing through your privacy settings and can disable location services at any time.`,
      icon: Shield
    },
    {
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can control cookie settings through your browser preferences.`,
      icon: Bell
    }
  ];

  const dataTypes = [
    {
      category: 'Profile Information',
      examples: ['Name, age, gender', 'Photos and bio', 'Interests and hobbies', 'Location data']
    },
    {
      category: 'Usage Information',
      examples: ['App interactions', 'Search queries', 'Messages sent/received', 'Matches and likes']
    },
    {
      category: 'Device Information',
      examples: ['Device type and model', 'Operating system', 'IP address', 'Browser information']
    },
    {
      category: 'Location Data',
      examples: ['GPS coordinates', 'City and country', 'Distance calculations', 'Location preferences']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Last Updated:</strong> January 15, 2024
            </p>
            <p className="text-sm text-blue-700 mt-1">
              This privacy policy was last updated on the date above. We may update this policy from time to time.
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              FriendMatch ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our mobile application and related services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using FriendMatch, you consent to the data practices described in this policy. If you do not agree with our policies 
              and practices, please do not use our service.
            </p>
          </div>

          {/* Data Types */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Information We Collect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataTypes.map((type, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{type.category}</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {type.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {section.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed ml-13">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Your Rights */}
          <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Your Privacy Rights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <h4 className="font-medium mb-2">Access and Control</h4>
                <ul className="space-y-1">
                  <li>• View and update your profile information</li>
                  <li>• Control your privacy settings</li>
                  <li>• Delete your account and data</li>
                  <li>• Opt out of certain communications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Data Protection</h4>
                <ul className="space-y-1">
                  <li>• Request a copy of your data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Restrict data processing</li>
                  <li>• Data portability</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Retention</h3>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes 
              outlined in this policy. When you delete your account, we will delete or anonymize your personal information 
              within 30 days, except where we are required to retain certain information for legal or legitimate business purposes.
            </p>
            <p className="text-gray-700">
              Some information may be retained in backup systems for a limited period to ensure service continuity and data recovery.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Third-Party Services</h3>
            <p className="text-yellow-700 mb-3">
              Our service may contain links to third-party websites or services. We are not responsible for the privacy practices 
              of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
            <p className="text-yellow-700">
              We may use third-party analytics and advertising services that collect information about your use of our service.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Children's Privacy</h3>
            <p className="text-red-700">
              FriendMatch is not intended for children under 18 years of age. We do not knowingly collect personal information 
              from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately.
            </p>
          </div>

          {/* International Transfers */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">International Data Transfers</h3>
            <p className="text-gray-700 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers 
              comply with applicable data protection laws and that your information receives adequate protection.
            </p>
            <p className="text-gray-700">
              If you are located in the European Economic Area (EEA), we ensure that your data is transferred in compliance with 
              GDPR requirements.
            </p>
          </div>

          {/* Contact Information */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Contact Us</h3>
            <p className="text-blue-700 mb-3">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="text-blue-700 space-y-1">
              <p><strong>Email:</strong> privacy@friendmatch.com</p>
              <p><strong>Address:</strong> 123 Friendship Street, Social City, SC 12345</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>•</span>
            <a href="mailto:privacy@friendmatch.com" className="hover:text-blue-600 transition-colors">
              Privacy Questions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;