import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, Heart } from 'react-feather';

const TermsPage = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using FriendMatch, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: 'Description of Service',
      content: `FriendMatch is a location-based friendship platform that connects people based on shared interests and proximity. Our service includes profile creation, matching algorithms, messaging, and community features.`
    },
    {
      title: 'User Eligibility',
      content: `You must be at least 18 years old to use FriendMatch. By using our service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these terms.`
    },
    {
      title: 'User Accounts',
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your profile.`
    },
    {
      title: 'Acceptable Use',
      content: `You agree to use FriendMatch only for lawful purposes and in accordance with these terms. You must not use the service to harass, abuse, or harm others, or to post inappropriate or offensive content.`
    },
    {
      title: 'Privacy and Data',
      content: `Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our service, you consent to our data practices.`
    },
    {
      title: 'Content Guidelines',
      content: `You retain ownership of content you post, but grant us a license to use it. You must not post content that is illegal, harmful, threatening, abusive, or violates others' rights.`
    },
    {
      title: 'Prohibited Activities',
      content: `The following activities are strictly prohibited: impersonating others, creating fake profiles, spamming, attempting to gain unauthorized access, and any activity that could harm our service or other users.`
    },
    {
      title: 'Termination',
      content: `We may terminate or suspend your account at any time for violations of these terms. You may also terminate your account at any time by contacting our support team.`
    },
    {
      title: 'Limitation of Liability',
      content: `FriendMatch is provided "as is" without warranties. We are not liable for any damages arising from your use of our service, including but not limited to direct, indirect, incidental, or consequential damages.`
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our service. Continued use after changes constitutes acceptance of the new terms.`
    },
    {
      title: 'Contact Information',
      content: `If you have questions about these terms, please contact us at legal@friendmatch.com or through our support channels.`
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
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using FriendMatch. By using our service, 
              you agree to be bound by these terms and conditions.
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
              These terms were last updated on the date above. Please review them regularly for any changes.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed ml-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Important Notes */}
          <div className="mt-12 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Important Notes
            </h3>
            <ul className="text-yellow-700 space-y-2 ml-7">
              <li>• These terms constitute a legally binding agreement between you and FriendMatch</li>
              <li>• Violation of these terms may result in account suspension or termination</li>
              <li>• We recommend keeping a copy of these terms for your records</li>
              <li>• If you disagree with any part of these terms, please do not use our service</li>
            </ul>
          </div>

          {/* Agreement */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Agreement</h3>
            <p className="text-gray-700 mb-4">
              By using FriendMatch, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please discontinue use of our service.
            </p>
            <p className="text-gray-700">
              These terms are effective as of the date listed above and will remain in effect until modified or terminated.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>•</span>
            <a href="mailto:support@friendmatch.com" className="hover:text-blue-600 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;