import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'react-feather';
import { toast } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error, expired
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() => {
    const verificationToken = searchParams.get('token');
    if (verificationToken) {
      setToken(verificationToken);
      verifyEmail(verificationToken);
    } else {
      // No token provided, show manual verification page
      setVerificationStatus('pending');
    }
  }, [searchParams]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const verifyEmail = async (verificationToken) => {
    setIsVerifying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here
      // const response = await fetch('/api/auth/verify-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: verificationToken })
      // });
      
      // Simulate success
      setVerificationStatus('success');
      toast.success('Email verified successfully!');
    } catch (error) {
      setVerificationStatus('error');
      toast.error('Failed to verify email');
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    setIsResending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your API here
      // const response = await fetch('/api/auth/resend-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: 'user@example.com' })
      // });
      
      toast.success('Verification email sent!');
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified Successfully!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your email has been verified. You can now access all features of the app.
            </p>
            
            <Link
              to="/login"
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              Continue to Login
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h1>
            
            <p className="text-gray-600 mb-6">
              We couldn't verify your email. The link may be invalid or expired.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => setVerificationStatus('pending')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <Link
                to="/login"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Link Expired
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your verification link has expired. Please request a new one.
            </p>
            
            <button
              onClick={resendVerification}
              disabled={isResending || countdown > 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Sending...</span>
                </div>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Verification Email'
              )}
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verify Your Email
            </h1>
            
            <p className="text-gray-600 mb-6">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
            
            {isVerifying ? (
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={resendVerification}
                  disabled={isResending || countdown > 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Sending...</span>
                    </div>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-5 h-5" />
                      <span>Resend Verification Email</span>
                    </div>
                  )}
                </button>
                
                <Link
                  to="/login"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            )}
            
            {/* Instructions */}
            <div className="mt-6 bg-blue-50 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-800 font-medium mb-2">What to do next:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your email inbox</li>
                <li>• Look for an email from our team</li>
                <li>• Click the verification link in the email</li>
                <li>• If you don't see it, check your spam folder</li>
              </ul>
            </div>
            
            {/* Troubleshooting */}
            <div className="mt-4 text-sm text-gray-500">
              <p>Didn't receive the email?</p>
              <div className="flex justify-center space-x-4 mt-2">
                <button
                  onClick={resendVerification}
                  disabled={isResending || countdown > 0}
                  className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  Resend email
                </button>
                <span>•</span>
                <Link to="/contact" className="text-blue-600 hover:text-blue-700">
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;