"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Copy,
  Share2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  Send,
  Globe,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ShareMenu = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: "Check out this product!",
          url,
        });
      } catch (error: unknown) {
        let errorMessage = "Sharing canceled or failed.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      }
    } else {
      toast.info("Native sharing not supported.");
    }
  };

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      title + " " + url
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(url)}`,
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className={`${className ?? ""}`}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Share2 className="h-7 w-7 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-3">
          <div className="font-medium">Share this product</div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              title="Copy Link"
              className="cursor-pointer"
            >
              <Copy className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(socialLinks.facebook, "_blank")}
              title="Facebook"
              className="cursor-pointer"
            >
              <Facebook className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(socialLinks.twitter, "_blank")}
              title="Twitter"
              className="cursor-pointer"
            >
              <Twitter className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(socialLinks.whatsapp, "_blank")}
              title="WhatsApp"
              className="cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(socialLinks.telegram, "_blank")}
              title="Telegram"
              className="cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(socialLinks.email, "_blank")}
              title="Email"
              className="cursor-pointer"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="w-full flex items-center gap-2 cursor-pointer"
            >
              <Globe className="h-4 w-4" />
              Native Share
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ShareMenu;
