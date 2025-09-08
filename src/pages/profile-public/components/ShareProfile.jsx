import React, { useState } from 'react';
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ShareProfile = ({ username, profileData, activeRole }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `${window.location.origin}/profile/${username}`;
  const { basicInfo } = profileData || {};
  
  const shareTitle = `Hồ sơ của ${basicInfo?.displayName || username} trên TechMarketplace`;
  const shareText = `Xem hồ sơ chuyên nghiệp của ${basicInfo?.displayName || username} tại TechMarketplace`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: profileUrl,
        });
        return;
      } catch (err) {
        // User cancelled or error occurred
      }
    }
    setShowShareMenu(!showShareMenu);
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      color: 'text-blue-600 hover:bg-blue-50'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`,
      color: 'text-sky-500 hover:bg-sky-50'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
      color: 'text-blue-700 hover:bg-blue-50'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${profileUrl}`)}`,
      color: 'text-gray-600 hover:bg-gray-50'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${profileUrl}`)}`,
      color: 'text-green-600 hover:bg-green-50'
    }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleWebShare}
        className="flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        Chia sẻ
      </Button>

      {showShareMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">
              Chia sẻ hồ sơ
            </h3>
            
            {/* Copy Link */}
            <div className="mb-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 text-left"
              >
                <Copy className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {copied ? 'Đã sao chép!' : 'Sao chép liên kết'}
                </span>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="space-y-1">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors ${link.color}`}
                    onClick={() => setShowShareMenu(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="text-sm">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default ShareProfile;