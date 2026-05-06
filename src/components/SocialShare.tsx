import { Share2, MessageCircle, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialShareProps {
  title: string;
  url?: string;
  description?: string;
}

const SocialShare = ({ title, url, description }: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareText = `Check out this event: ${title}${description ? ` — ${description}` : ''}`;

  const platforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Share2 className="w-4 h-4" />
        Share Event
      </div>
      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${platform.name}`}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground transition-premium ${platform.color} bg-secondary/30`}
          >
            <platform.icon className="w-4 h-4" />
          </a>
        ))}
        <button
          onClick={copyLink}
          title="Copy link"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-premium bg-secondary/30 ${
            copied ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
