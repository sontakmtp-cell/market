import React from 'react';
import { Shield, CheckCircle2, Mail, Phone, CreditCard, Github, Linkedin } from 'lucide-react';

const VerificationBadges = ({ basicInfo, roleProfile, className = '' }) => {
  const badges = [];

  // Email verification
  if (basicInfo.emailVerified) {
    badges.push({
      id: 'email',
      icon: Mail,
      label: 'Email đã xác minh',
      color: 'text-green-600 bg-green-50',
      verified: true
    });
  }

  // Phone verification
  if (basicInfo.phoneVerified) {
    badges.push({
      id: 'phone',
      icon: Phone,
      label: 'Số điện thoại đã xác minh',
      color: 'text-blue-600 bg-blue-50',
      verified: true
    });
  }

  // Payment verification (for freelancers/clients)
  if (roleProfile?.paymentVerified) {
    badges.push({
      id: 'payment',
      icon: CreditCard,
      label: 'Thanh toán đã xác minh',
      color: 'text-purple-600 bg-purple-50',
      verified: true
    });
  }

  // Social media verification
  if (basicInfo.socialLinks?.github && basicInfo.githubVerified) {
    badges.push({
      id: 'github',
      icon: Github,
      label: 'GitHub đã xác minh',
      color: 'text-gray-600 bg-gray-50',
      verified: true
    });
  }

  if (basicInfo.socialLinks?.linkedin && basicInfo.linkedinVerified) {
    badges.push({
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn đã xác minh',
      color: 'text-blue-700 bg-blue-50',
      verified: true
    });
  }

  // KYC verification (Know Your Customer)
  if (basicInfo.kycVerified) {
    badges.push({
      id: 'kyc',
      icon: Shield,
      label: 'Danh tính đã xác minh',
      color: 'text-emerald-600 bg-emerald-50',
      verified: true,
      premium: true
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${badge.color} ${
            badge.premium ? 'ring-2 ring-emerald-200' : ''
          }`}
          title={badge.label}
        >
          <badge.icon className="h-3 w-3 mr-1" />
          {badge.premium && <Shield className="h-3 w-3 mr-1" />}
          <CheckCircle2 className="h-3 w-3" />
        </div>
      ))}
    </div>
  );
};

export default VerificationBadges;
