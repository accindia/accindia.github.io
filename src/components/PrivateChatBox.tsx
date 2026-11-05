import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  CheckCheck,
  Check,
  Sparkles,
  Paperclip,
  X,
  ExternalLink,
  Play,
  Download,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { PrivateMessage, Member } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { ensureSafeFirestoreSize } from '../utils/imageCompressor';

interface PrivateChatBoxProps {
  userAccId: string;
  currentUserRole: 'admin' | 'user';
  currentUserName: string;
  currentUserAccId: string;
  targetMember?: Member;
  className?: string;
}

export const PrivateChatBox: React.FC<PrivateChatBoxProps> = ({
  userAccId,
  currentUserRole,
  currentUserName,
  currentUserAccId,
  targetMember,
  className = '',
}) => {
  const [messages, setMessages] = useState<PrivateMessage[]>(() =>
    StorageService.getPrivateMessages(userAccId)
  );
  const [textInput, setTextInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeAttachType, setActiveAttachType] = useState<'image' | 'video' | 'link' | null>(null);

  // Attachment inputs
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaCaptionInput, setMediaCaptionInput] = useState('');
  const [linkTitleInput, setLinkTitleInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages from Firestore & local storage
  useEffect(() => {
    // Initial local load
    setMessages(StorageService.getPrivateMessages(userAccId));
    StorageService.markMessagesAsRead(userAccId, currentUserRole);

    // Subscribe to real-time Firestore updates
    const unsubscribe = FirestoreService.subscribeToPrivateMessages(userAccId, (cloudMsgs) => {
      if (cloudMsgs && cloudMsgs.length > 0) {
        setMessages(cloudMsgs);
        StorageService.markMessagesAsRead(userAccId, currentUserRole);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userAccId, currentUserRole]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    StorageService.sendPrivateMessage({
      userAccId,
      senderRole: currentUserRole,
      senderAccId: currentUserAccId,
      senderName: currentUserName,
      text: textInput.trim(),
      mediaType: 'text',
    });

    setTextInput('');
    setMessages(StorageService.getPrivateMessages(userAccId));
  };

  const handleSendAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAttachType) return;

    let finalMediaUrl = mediaUrlInput.trim();

    if (activeAttachType === 'image' && previewImage) {
      finalMediaUrl = previewImage;
    }

    if (!finalMediaUrl && activeAttachType !== 'link') {
      alert('कृपया फोटो या वीडियो का वैध लिंक या फ़ाइल दें!');
      return;
    }

    if (activeAttachType === 'link' && !mediaUrlInput.trim()) {
      alert('कृपया वैध वेब लिंक दर्ज करें!');
      return;
    }

    StorageService.sendPrivateMessage({
      userAccId,
      senderRole: currentUserRole,
      senderAccId: currentUserAccId,
      senderName: currentUserName,
      text: mediaCaptionInput.trim() || (activeAttachType === 'image' ? '📷 फोटो' : activeAttachType === 'video' ? '🎥 वीडियो' : '🔗 लिंक'),
      mediaType: activeAttachType,
      mediaUrl: activeAttachType !== 'link' ? finalMediaUrl : undefined,
      mediaCaption: mediaCaptionInput.trim(),
      linkUrl: activeAttachType === 'link' ? mediaUrlInput.trim() : undefined,
      linkTitle: linkTitleInput.trim() || mediaUrlInput.trim(),
    });

    // Reset attachment form
    setActiveAttachType(null);
    setShowAttachMenu(false);
    setMediaUrlInput('');
    setMediaCaptionInput('');
    setLinkTitleInput('');
    setPreviewImage(null);
    setMessages(StorageService.getPrivateMessages(userAccId));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल इमेज/फोटो फाइल (PNG, JPG, JPEG) चुनें।');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const compressed = await ensureSafeFirestoreSize(dataUrl, 900, 0.7);
        setPreviewImage(compressed);
        setActiveAttachType('image');
      } catch {
        setPreviewImage(dataUrl);
        setActiveAttachType('image');
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className={`flex flex-col h-[520px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl ${className}`}>
      {/* Telegram-style Top Header */}
      <div className="bg-[#17212b] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#229ed9] to-[#0088cc] text-white flex items-center justify-center font-bold text-sm shadow-md">
              {currentUserRole === 'admin'
                ? (targetMember?.fullName?.[0] || 'U')
                : 'ACC'}
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#17212b] absolute bottom-0 right-0" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm">
                {currentUserRole === 'admin'
                  ? `${targetMember?.fullName || 'सदस्य'} (${userAccId})`
                  : 'ACC आधिकारिक एडमिन हेल्पडेस्क'}
              </h4>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2 py-0.5 rounded-full border border-sky-400/30">
                100% PRIVATE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentUserRole === 'admin'
                ? `सीधा 1-to-1 चैट • ${targetMember?.mobile || ''} • ${targetMember?.plan || ''} Plan`
                : 'सीधे एडमिन से संदेश, वीडियो व फोटो प्राप्त करें एवं अपनी समस्याएं भेजें'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ऑनलाइन
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {messages.length} संदेश
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0e1621] bg-opacity-95">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h5 className="font-bold text-white text-sm">अभी कोई संदेश नहीं है</h5>
            <p className="text-xs max-w-xs text-slate-400">
              {currentUserRole === 'admin'
                ? 'इस छात्र को अपना पहला संदेश, Real App लिंक, फोटो या वीडियो भेजें।'
                : 'एडमिन टीम से जुड़ें। आप यहाँ अपनी रसीद, प्रश्न या कोई भी सवाल सीधे भेज सकते हैं।'}
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderRole === currentUserRole;
            const ytEmbed = m.mediaType === 'video' && m.mediaUrl ? getYouTubeEmbedUrl(m.mediaUrl) : null;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md relative space-y-1.5 ${
                    isMe
                      ? 'bg-gradient-to-r from-[#2b5278] to-[#1e3b56] text-white rounded-br-xs border border-sky-600/30'
                      : 'bg-[#182533] text-slate-100 rounded-bl-xs border border-slate-700/60'
                  }`}
                >
                  {/* Sender Name Header */}
                  <div className="flex items-center justify-between gap-3 text-[10px] pb-1 border-b border-white/10">
                    <span className={`font-bold ${isMe ? 'text-sky-300' : 'text-amber-400'}`}>
                      {m.senderName} {isMe ? '(आप)' : ''}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px]">
                      {new Date(m.timestamp).toLocaleTimeString('hi-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* MEDIA TYPE: IMAGE */}
                  {m.mediaType === 'image' && m.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 mt-1">
                      <img
                        src={m.mediaUrl}
                        alt="Shared Photo"
                        onClick={() => setFullscreenImage(m.mediaUrl || null)}
                        className="w-full max-h-60 object-contain cursor-pointer hover:opacity-95 transition"
                      />
                    </div>
                  )}

                  {/* MEDIA TYPE: VIDEO */}
                  {m.mediaType === 'video' && m.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black mt-1">
                      {ytEmbed ? (
                        <iframe
                          src={ytEmbed}
                          title="Video Player"
                          className="w-full h-44 sm:h-52 border-0"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={m.mediaUrl}
                          controls
                          className="w-full max-h-52 object-contain"
                        />
                      )}
                    </div>
                  )}

                  {/* MEDIA TYPE: LINK */}
                  {m.mediaType === 'link' && m.linkUrl && (
                    <a
                      href={m.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition mt-1"
                    >
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="font-bold text-xs text-sky-300 truncate">
                          {m.linkTitle || m.linkUrl}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-auto" />
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {m.linkUrl}
                      </span>
                    </a>
                  )}

                  {/* Message Text Content */}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {m.text}
                  </p>

                  {/* Read Receipts */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-0.5">
                    {isMe && (
                      <span title={m.isRead ? 'पढ़ा गया' : 'भेजा गया'}>
                        {m.isRead ? (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Form Modal / Drawer */}
      {activeAttachType && (
        <div className="bg-[#17212b] border-t border-slate-700 p-3 animate-fadeIn space-y-2">
          <div className="flex items-center justify-between text-xs text-white">
            <span className="font-bold flex items-center gap-1.5 text-sky-400">
              {activeAttachType === 'image' && <ImageIcon className="w-4 h-4" />}
              {activeAttachType === 'video' && <Video className="w-4 h-4" />}
              {activeAttachType === 'link' && <LinkIcon className="w-4 h-4" />}
              <span>
                {activeAttachType === 'image' ? 'फोटो / स्क्रीनशॉट भेजें' : activeAttachType === 'video' ? 'वीडियो शेयर करें (YouTube / MP4)' : 'वेब लिंक शेयर करें'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveAttachType(null);
                setPreviewImage(null);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSendAttachment} className="space-y-2">
            {activeAttachType === 'image' && (
              <div className="space-y-1.5">
                {previewImage ? (
                  <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-600 bg-black">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={mediaUrlInput}
                      onChange={(e) => setMediaUrlInput(e.target.value)}
                      placeholder="फोटो का वेब URL पेस्ट करें (https://...)"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold shrink-0"
                    >
                      डिवाइस से चुनें
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeAttachType === 'video' && (
              <input
                type="url"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                placeholder="YouTube वीडियो लिंक या MP4 URL दर्ज करें (https://...)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                required
              />
            )}

            {activeAttachType === 'link' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={linkTitleInput}
                  onChange={(e) => setLinkTitleInput(e.target.value)}
                  placeholder="लिंक का शीर्षक (उदा. Real App APK Download)"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  required
                />
                <input
                  type="url"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="वेब URL (https://...)"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                  required
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={mediaCaptionInput}
                onChange={(e) => setMediaCaptionInput(e.target.value)}
                placeholder="कैप्शन या साथ में संदेश लिखें (वैकल्पिक)..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>भेजें</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Input Action Bar */}
      <div className="bg-[#17212b] border-t border-slate-700/80 p-2.5 shrink-0">
        <form onSubmit={handleSendText} className="flex items-center gap-2">
          {/* Attach Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-2 rounded-xl transition ${
                showAttachMenu
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="मीडिया या लिंक संलग्न करें"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Quick Attach Popup Menu */}
            {showAttachMenu && (
              <div className="absolute bottom-12 left-0 w-44 bg-[#1f2c38] border border-slate-700 rounded-xl p-1.5 shadow-xl space-y-1 z-30 animate-scaleUp">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachType('image');
                    setShowAttachMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 hover:bg-slate-700/70 text-slate-200 text-xs rounded-lg flex items-center gap-2 text-left font-semibold"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>फोटो / स्क्रीनशॉट</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachType('video');
                    setShowAttachMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 hover:bg-slate-700/70 text-slate-200 text-xs rounded-lg flex items-center gap-2 text-left font-semibold"
                >
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>वीडियो लिंक</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAttachType('link');
                    setShowAttachMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 hover:bg-slate-700/70 text-slate-200 text-xs rounded-lg flex items-center gap-2 text-left font-semibold"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>वेब लिंक / APK</span>
                </button>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Text Input */}
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              currentUserRole === 'admin'
                ? `संदेश लिखें (${targetMember?.fullName || 'सदस्य'} को)...`
                : 'एडमिन को अपना सवाल या संदेश लिखें...'
            }
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-medium"
          />

          {/* 3D Send Button */}
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-4 py-2 bg-gradient-to-b from-[#229ed9] via-[#0088cc] to-[#006699] hover:from-[#2eb0ee] hover:to-[#005580] disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-[0_2px_0_#004466] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">भेजें</span>
          </button>
        </form>
      </div>

      {/* Fullscreen Lightbox for Images */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={fullscreenImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
