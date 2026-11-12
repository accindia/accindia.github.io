import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Send,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Sparkles,
  Paperclip,
  X,
  ExternalLink,
  Play,
  Eye,
  Bell,
  CheckCheck,
  Check,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Copy,
  Edit3,
  Calendar,
  Award,
  Crown,
  Heart,
  Smile,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  CreditCard,
  Lock,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import {
  Member,
  PrivateMessage,
  Friendship,
  ChatGroup,
  SocialNotification,
  AvatarFrameType,
  PrivacySettings,
} from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { AvatarWith3DFrame } from './AvatarWith3DFrame';
import { DigitalIdCard } from './DigitalIdCard';
import { ensureSafeFirestoreSize } from '../utils/imageCompressor';
import { getMemberPrivacyDisplay } from '../utils/privacyMask';

interface AccChatAndHelpHubProps {
  currentUser: Member;
  initialTargetMemberAccId?: string;
  initialTab?: 'chats' | 'friends' | 'groups' | 'profile' | 'notifications';
  onClose?: () => void;
  onNavigateToDashboard?: () => void;
}

export const AccChatAndHelpHub: React.FC<AccChatAndHelpHubProps> = ({
  currentUser,
  initialTargetMemberAccId,
  initialTab = 'chats',
  onClose,
  onNavigateToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'friends' | 'groups' | 'profile' | 'notifications'>(initialTab);

  // Active chat state
  const [selectedConversationKey, setSelectedConversationKey] = useState<string>('');
  const [selectedRecipientMember, setSelectedRecipientMember] = useState<Member | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);

  // Profile view state
  const [viewedMember, setViewedMember] = useState<Member>(currentUser);

  // Lists state
  const [allMembers, setAllMembers] = useState<Member[]>(() => StorageService.getMembers());
  const [messages, setMessages] = useState<PrivateMessage[]>(() => StorageService.getPrivateMessages());
  const [friendships, setFriendships] = useState<Friendship[]>(() => StorageService.getFriendships());
  const [groups, setGroups] = useState<ChatGroup[]>(() => StorageService.getChatGroups());
  const [notifications, setNotifications] = useState<SocialNotification[]>(() =>
    StorageService.getSocialNotifications(currentUser.accId)
  );

  // Input states
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendsSubTab, setFriendsSubTab] = useState<'friends' | 'requests' | 'sent' | 'find'>('friends');

  // Attachments modal
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [attachType, setAttachType] = useState<'image' | 'video' | 'link' | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaCaptionInput, setMediaCaptionInput] = useState('');
  const [linkTitleInput, setLinkTitleInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ID Card Modal State
  const [selectedIdCardMember, setSelectedIdCardMember] = useState<Member | null>(null);

  // Profile Modal State (Pop-up inside chat room without navigating away)
  const [viewedProfileModalMember, setViewedProfileModalMember] = useState<Member | null>(null);

  // User Profile & Digital ID Card Privacy Settings Modal State
  const [showChatPrivacyModal, setShowChatPrivacyModal] = useState<boolean>(false);
  const [chatPrivacyDraft, setChatPrivacyDraft] = useState<PrivacySettings>(() => currentUser.privacySettings || {
    showProfilePic: true,
    showFullNamePublic: true,
    showMobile: false,
    showWhatsapp: false,
    showEmail: false,
    showSponsorId: true,
    showUsername: true,
    showCity: true,
    showProfileLink: true,
    showPersonalQr: false,
  });
  const [isSavingChatPrivacy, setIsSavingChatPrivacy] = useState<boolean>(false);
  const [chatPrivacySuccessMsg, setChatPrivacySuccessMsg] = useState<string>('');

  // Create Group Modal
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupIcon, setNewGroupIcon] = useState('🏢');
  const [groupMemberFilter, setGroupMemberFilter] = useState<'friends' | 'all'>('friends');
  const [groupMemberSearch, setGroupMemberSearch] = useState('');
  const [selectedMemberAccIds, setSelectedMemberAccIds] = useState<string[]>([]);

  // Edit Username / Bio Modal
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState(currentUser.username || '');
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [profileActionMsg, setProfileActionMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Media lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Group Members Modal State
  const [groupMembersModalOpen, setGroupMembersModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick emojis
  const QUICK_EMOJIS = ['👍', '❤️', '🇮🇳', '👏', '🎉', '💰', '🔥', '🙏', '🚀', '💯'];

  // Refresh lists helper
  const reloadData = () => {
    const mems = StorageService.getMembers();
    setAllMembers(mems);
    setMessages(StorageService.getPrivateMessages());
    setFriendships(StorageService.getFriendships());
    setGroups(StorageService.getChatGroups());
    setNotifications(StorageService.getSocialNotifications(currentUser.accId));

    // Refresh viewed member if applicable
    if (viewedMember) {
      const refreshedViewed = mems.find((m) => m.accId.toUpperCase() === viewedMember.accId.toUpperCase());
      if (refreshedViewed) setViewedMember(refreshedViewed);
    }
  };

  // Helper to determine if user is Group Admin
  const isGroupAdmin = (group: ChatGroup | null, accId: string): boolean => {
    if (!group || !accId) return false;
    const cleanId = accId.trim().toUpperCase();
    if (group.creatorAccId?.toUpperCase() === cleanId) return true;
    const memberEntry = group.members?.find((m) => m.accId.toUpperCase() === cleanId);
    if (memberEntry && memberEntry.role === 'admin') return true;
    const fullMember = allMembers.find((m) => m.accId.toUpperCase() === cleanId);
    return fullMember?.role === 'admin';
  };

  // Helper to determine if user is Top Performer
  const isTopPerformer = (accId: string): boolean => {
    if (!accId) return false;
    const cleanId = accId.trim().toUpperCase();
    const mem = allMembers.find((m) => m.accId.toUpperCase() === cleanId);
    if (!mem) return false;
    if ((mem as any).isTopPerformer) return true;
    // Direct community achievements
    if ((mem.referralsCount || 0) >= 2 || (mem.totalEarnings || 0) >= 300 || (mem.rechargesCount || 0) >= 5) {
      return true;
    }
    // Top 3 performers in total volume (referrals + earnings)
    const sorted = [...allMembers].sort((a, b) => {
      const scoreA = (a.referralsCount || 0) * 150 + (a.totalEarnings || 0);
      const scoreB = (b.referralsCount || 0) * 150 + (b.totalEarnings || 0);
      return scoreB - scoreA;
    });
    const top3 = sorted.slice(0, 3).map((m) => m.accId.toUpperCase());
    return top3.includes(cleanId);
  };

  // Sync subscription
  useEffect(() => {
    const unsubscribeSync = subscribeToSync(() => {
      reloadData();
    });
    return () => unsubscribeSync();
  }, [currentUser.accId, viewedMember?.accId]);

  // Initial target setup
  useEffect(() => {
    if (initialTargetMemberAccId) {
      const target = allMembers.find((m) => m.accId.toUpperCase() === initialTargetMemberAccId.toUpperCase());
      if (target) {
        openDirectChatWithMember(target);
      }
    } else {
      // Default to sponsor chat if available
      if (currentUser.sponsorId) {
        const sponsor = allMembers.find((m) => m.accId.toUpperCase() === currentUser.sponsorId.toUpperCase());
        if (sponsor) {
          openDirectChatWithMember(sponsor);
        }
      }
    }
  }, [initialTargetMemberAccId]);

  // Scroll to bottom when conversation changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversationKey]);

  // Handle open direct chat
  const openDirectChatWithMember = (member: Member) => {
    setSelectedGroup(null);
    setSelectedRecipientMember(member);
    const channelKey = StorageService.getSponsorChannelKey(currentUser.accId, member.accId);
    setSelectedConversationKey(channelKey);
    setActiveTab('chats');
    StorageService.markChannelMessagesAsRead(channelKey, currentUser.accId);
    reloadData();
  };

  // Handle open group chat
  const openGroupChat = (group: ChatGroup) => {
    setSelectedRecipientMember(null);
    setSelectedGroup(group);
    setSelectedConversationKey(`group_${group.id}`);
    setActiveTab('chats');
  };

  // Handle visit profile: Opens the pop-up modal directly inside the chat room so the user never loses their active chat
  const openMemberProfileModal = async (member: Member) => {
    setViewedMember(member);
    setViewedProfileModalMember(member);
    if (member.accId.toUpperCase() !== currentUser.accId.toUpperCase()) {
      await StorageService.recordProfileView(member.accId, currentUser);
      reloadData();
    }
  };

  const handleVisitProfile = (member: Member) => {
    openMemberProfileModal(member);
  };

  // Save privacy settings directly from chat hub
  const handleSaveChatPrivacy = async () => {
    setIsSavingChatPrivacy(true);
    setChatPrivacySuccessMsg('');
    try {
      const updated = StorageService.updateMember(currentUser.accId, {
        privacySettings: chatPrivacyDraft,
      });
      await FirestoreService.updateMember(currentUser.accId, {
        privacySettings: chatPrivacyDraft,
      });
      if (updated) {
        currentUser.privacySettings = chatPrivacyDraft;
        reloadData();
      }
      setChatPrivacySuccessMsg('✓ प्राइवेसी सेटिंग्स सफलतापूर्वक सुरक्षित हो गईं!');
      setTimeout(() => {
        setChatPrivacySuccessMsg('');
        setShowChatPrivacyModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error saving chat privacy settings:', err);
    } finally {
      setIsSavingChatPrivacy(false);
    }
  };

  // Filter messages for current conversation
  const currentConversationMessages = messages
    .filter((m) => {
      if (selectedGroup) {
        return m.groupId === selectedGroup.id || m.userAccId === `group_${selectedGroup.id}`;
      }
      if (selectedRecipientMember && selectedConversationKey) {
        return (
          (m.userAccId || '').toUpperCase() === selectedConversationKey.toUpperCase() ||
          ((m.senderAccId || '').toUpperCase() === selectedRecipientMember.accId.toUpperCase() &&
            (m.recipientAccId || '').toUpperCase() === currentUser.accId.toUpperCase()) ||
          ((m.senderAccId || '').toUpperCase() === currentUser.accId.toUpperCase() &&
            (m.recipientAccId || '').toUpperCase() === selectedRecipientMember.accId.toUpperCase())
        );
      }
      return false;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    if (currentUser.chatMuted) {
      alert('⚠️ आपका चैट सिस्टम व्यवस्थापक द्वारा म्यूट किया गया है।');
      return;
    }

    if (selectedGroup) {
      // Group message
      StorageService.sendPrivateMessage({
        userAccId: `group_${selectedGroup.id}`,
        chatType: 'group',
        groupId: selectedGroup.id,
        senderRole: 'user',
        senderAccId: currentUser.accId,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatarUrl,
        text: messageText.trim(),
        mediaType: 'text',
      });
      setMessageText('');
      reloadData();
    } else if (selectedRecipientMember) {
      // Direct message
      const channelKey =
        selectedConversationKey || StorageService.getSponsorChannelKey(currentUser.accId, selectedRecipientMember.accId);

      StorageService.sendPrivateMessage({
        userAccId: channelKey,
        recipientAccId: selectedRecipientMember.accId,
        recipientName: selectedRecipientMember.fullName,
        chatType: 'member',
        senderRole: 'user',
        senderAccId: currentUser.accId,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatarUrl,
        text: messageText.trim(),
        mediaType: 'text',
      });

      // Send social notification to recipient
      StorageService.sendSocialNotification({
        recipientAccId: selectedRecipientMember.accId,
        senderAccId: currentUser.accId,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatarUrl,
        type: 'message',
        title: `💬 नया संदेश: ${currentUser.fullName}`,
        body: messageText.trim().length > 60 ? messageText.trim().substring(0, 57) + '...' : messageText.trim(),
        linkAction: {
          type: 'open_chat',
          targetId: currentUser.accId,
        },
      });

      setMessageText('');
      reloadData();
    }
  };

  // Send media attachment
  const handleSendAttachment = () => {
    if (currentUser.chatMuted) {
      alert('⚠️ आपका चैट सिस्टम म्यूट किया गया है।');
      return;
    }

    const channelKey = selectedGroup
      ? `group_${selectedGroup.id}`
      : selectedConversationKey || StorageService.getSponsorChannelKey(currentUser.accId, selectedRecipientMember?.accId || '');

    if (attachType === 'image') {
      const imgUrl = previewImage || mediaUrlInput.trim();
      if (!imgUrl) return;

      StorageService.sendPrivateMessage({
        userAccId: channelKey,
        recipientAccId: selectedGroup ? undefined : selectedRecipientMember?.accId,
        recipientName: selectedGroup ? selectedGroup.name : selectedRecipientMember?.fullName,
        chatType: selectedGroup ? 'group' : 'member',
        groupId: selectedGroup?.id,
        senderRole: 'user',
        senderAccId: currentUser.accId,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatarUrl,
        text: mediaCaptionInput.trim() || '📷 फोटो शेयर की गई',
        mediaType: 'image',
        mediaUrl: imgUrl,
        mediaCaption: mediaCaptionInput.trim(),
      });
    } else if (attachType === 'video') {
      if (!mediaUrlInput.trim()) return;

      StorageService.sendPrivateMessage({
        userAccId: channelKey,
        recipientAccId: selectedGroup ? undefined : selectedRecipientMember?.accId,
        recipientName: selectedGroup ? selectedGroup.name : selectedRecipientMember?.fullName,
        chatType: selectedGroup ? 'group' : 'member',
        groupId: selectedGroup?.id,
        senderRole: 'user',
        senderAccId: currentUser.accId,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatarUrl,
        text: mediaCaptionInput.trim() || '🎥 वीडियो शेयर किया गया',
        mediaType: 'video',
        videoUrl: mediaUrlInput.trim(),
        mediaCaption: mediaCaptionInput.trim(),
      });
    } else if (attachType === 'link') {
      if (!mediaUrlInput.trim()) return;

      StorageService.sendPrivateMessage({
        userAccId: channelKey,
        recipientAccId: selectedGroup ? undefined : selectedRecipientMember?.accId,
        recipientName: selectedGroup ? selectedGroup.name : selectedRecipientMember?.fullName,
        chatType: selectedGroup ? 'group' : 'member',
        groupId: selectedGroup?.id,
        senderRole: 'user',
        senderAccId: currentUser.accId,
        senderName: currentUser.fullName,
        senderAvatar: currentUser.avatarUrl,
        text: linkTitleInput.trim() || mediaUrlInput.trim(),
        mediaType: 'link',
        linkUrl: mediaUrlInput.trim(),
        linkTitle: linkTitleInput.trim() || 'शेयर किया गया लिंक',
      });
    }

    setAttachModalOpen(false);
    setAttachType(null);
    setMediaUrlInput('');
    setMediaCaptionInput('');
    setLinkTitleInput('');
    setPreviewImage(null);
    reloadData();
  };

  // Image file upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const raw = ev.target?.result as string;
        try {
          const compressed = await ensureSafeFirestoreSize(raw, 700, 0.7);
          setPreviewImage(compressed);
        } catch {
          setPreviewImage(raw);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Group
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      alert('कृपया ग्रुप का नाम दर्ज करें');
      return;
    }
    const fullGroupName = newGroupIcon ? `${newGroupIcon} ${newGroupName.trim()}` : newGroupName.trim();
    const created = StorageService.createChatGroup(
      fullGroupName,
      newGroupDesc,
      currentUser,
      selectedMemberAccIds
    );
    setCreateGroupModalOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
    setSelectedMemberAccIds([]);
    setGroupMemberSearch('');
    reloadData();
    openGroupChat(created);
  };

  // Save Username & Bio
  const handleSaveProfileChanges = () => {
    setProfileActionMsg(null);
    let success = true;

    if (usernameInput.trim() && usernameInput.trim() !== (currentUser.username || '')) {
      const res = StorageService.updateMemberUsername(currentUser.accId, usernameInput.trim());
      if (!res.success) {
        setProfileActionMsg({ text: res.message, error: true });
        return;
      }
    }

    if (bioInput.trim() !== (currentUser.bio || '')) {
      StorageService.updateMember(currentUser.accId, { bio: bioInput.trim() });
    }

    setProfileActionMsg({ text: '✅ आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!', error: false });
    setTimeout(() => {
      setEditProfileModalOpen(false);
      setProfileActionMsg(null);
      reloadData();
    }, 1200);
  };

  // Unread counts
  const unreadMessagesCount = StorageService.getUserUnreadMessageCount(currentUser.accId);
  const unreadNotificationsCount = StorageService.getUnreadNotificationsCount(currentUser.accId);
  const pendingFriendRequests = friendships.filter(
    (f) => f.status === 'pending' && f.user2AccId.toUpperCase() === currentUser.accId.toUpperCase()
  );

  // My friends list
  const myFriends = StorageService.getFriendsList(currentUser.accId);

  // Suggested members (downlines, uplines, and others)
  const suggestedMembers = allMembers.filter(
    (m) =>
      m.accId.toUpperCase() !== currentUser.accId.toUpperCase() &&
      !myFriends.some((f) => f.accId.toUpperCase() === m.accId.toUpperCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BRANDED HEADER (ACC CHAT & HELP)                        */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/30 px-3 sm:px-6 py-2.5 sm:py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="पीछे जाएं"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-base sm:text-lg">🇮🇳</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black font-display tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 bg-clip-text text-transparent">
                  ACC MEMBER CHAT
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase">
                  Live Network
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
                सुरक्षित सदस्य संवाद, स्पॉन्सर चैट, ग्रुप्स एवं मित्र नेटवर्क
              </p>
            </div>
          </div>

          {/* User Mini Profile & Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Button */}
            <button
              onClick={() => {
                setActiveTab('notifications');
                StorageService.markAllNotificationsAsRead(currentUser.accId);
                reloadData();
              }}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 transition-all border border-slate-700/60"
              title="सूचनाएं (Notifications)"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* My Profile Quick Button */}
            <button
              onClick={() => openMemberProfileModal(currentUser)}
              className="flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 transition-all text-left cursor-pointer"
              title="मेरी प्रोफ़ाइल एवं प्राइवेसी सेटिंग्स"
            >
              <AvatarWith3DFrame
                avatarUrl={currentUser.avatarUrl}
                name={currentUser.fullName}
                frame={currentUser.avatarFrame || 'acc_medallion'}
                size="sm"
                showBadge={false}
              />
              <div className="hidden md:block leading-tight">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-amber-300 font-mono">
                  @{currentUser.username || currentUser.accId}
                </p>
              </div>
            </button>

            {/* Top-Right Corner Prominent Close Button */}
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else if (onNavigateToDashboard) onNavigateToDashboard();
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white font-black text-xs shadow-md border border-red-400/50 transition-all cursor-pointer shrink-0 active:scale-95"
              title="चैट बंद करें और डैशबोर्ड पर जाएं"
              aria-label="चैट बंद करें"
            >
              <X className="w-4 h-4 text-white" />
              <span className="hidden xs:inline">बंद करें</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Navigation Tabs Bar                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'chats'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>चैट (Chats)</span>
            {unreadMessagesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'friends'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>मित्र व नेटवर्क</span>
            {pendingFriendRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black">
                {pendingFriendRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'groups'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>ग्रुप्स (Groups)</span>
          </button>

          <button
            onClick={() => handleVisitProfile(currentUser)}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>प्रोफ़ाइल व व्यूज</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              StorageService.markAllNotificationsAsRead(currentUser.accId);
              reloadData();
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>सूचनाएं</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN BODY CONTENT TABS                                     */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 flex flex-col overflow-hidden">
        {/* ============================================================= */}
        {/* TAB 1: CHATS (1-ON-1 & GROUPS)                                */}
        {/* ============================================================= */}
        {activeTab === 'chats' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 h-[calc(100vh-140px)] min-h-[500px]">
            {/* Conversations Sidebar (Left) */}
            <div
              className={`${
                selectedConversationKey ? 'hidden md:flex' : 'flex'
              } md:col-span-4 lg:col-span-3 flex-col bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl`}
            >
              {/* Search Bar */}
              <div className="p-3 border-b border-slate-800/80">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="नाम, @username या ACC ID खोजें..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Pinned Quick Channels */}
              <div className="p-2 space-y-1.5 border-b border-slate-800/60 bg-slate-950/40">
                {/* 1. Direct Sponsor Chat Button */}
                {currentUser.sponsorId && (
                  <button
                    onClick={() => {
                      const sp = allMembers.find((m) => m.accId.toUpperCase() === currentUser.sponsorId.toUpperCase());
                      if (sp) openDirectChatWithMember(sp);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all ${
                      selectedRecipientMember?.accId.toUpperCase() === currentUser.sponsorId.toUpperCase()
                        ? 'bg-amber-500/20 border border-amber-500/60 text-amber-200'
                        : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-xs text-slate-950 shadow">
                        👑
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-white flex items-center gap-1">
                          <span>स्पॉन्सर से सीधी बात</span>
                          <span className="text-[10px] text-amber-400">★</span>
                        </p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {currentUser.sponsorName || currentUser.sponsorId}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      1-क्लिक
                    </span>
                  </button>
                )}

                {/* 2. Official Group */}
                {groups.length > 0 && (
                  <button
                    onClick={() => openGroupChat(groups[0])}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all ${
                      selectedGroup?.id === groups[0].id
                        ? 'bg-amber-500/20 border border-amber-500/60 text-amber-200'
                        : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-xs text-slate-950 shadow">
                        🇮🇳
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-white truncate max-w-[130px]">
                          {groups[0].name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {groups[0].members.length} सदस्य
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                      ग्रुप
                    </span>
                  </button>
                )}
              </div>

              {/* Members Conversation List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <p className="px-2 py-1 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                  सदस्य एवं मित्र (Conversations)
                </p>

                {allMembers
                  .filter((m) => m.accId.toUpperCase() !== currentUser.accId.toUpperCase())
                  .filter((m) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      m.fullName.toLowerCase().includes(q) ||
                      m.accId.toLowerCase().includes(q) ||
                      (m.username || '').toLowerCase().includes(q)
                    );
                  })
                  .map((member) => {
                    const isSelected = selectedRecipientMember?.accId.toUpperCase() === member.accId.toUpperCase();
                    const unread = StorageService.getUserUnreadMessageCount(member.accId);

                    return (
                      <button
                        key={member.accId}
                        onClick={() => openDirectChatWithMember(member)}
                        className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 border border-amber-500/60'
                            : 'hover:bg-slate-800/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <AvatarWith3DFrame
                            avatarUrl={member.avatarUrl}
                            name={member.fullName}
                            frame={member.avatarFrame || 'acc_medallion'}
                            size="sm"
                            showBadge={false}
                          />
                          <div className="min-w-0 leading-tight">
                            <p className="text-xs font-bold text-white truncate">
                              {member.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              @{member.username || member.accId}
                            </p>
                          </div>
                        </div>

                        {unread > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">
                            {unread}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Chat Box (Right) */}
            <div
              className={`${
                !selectedConversationKey ? 'hidden md:flex' : 'flex'
              } md:col-span-8 lg:col-span-9 flex-col bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl`}
            >
              {selectedConversationKey ? (
                <>
                  {/* Chat Conversation Top Header */}
                  <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setSelectedConversationKey('')}
                        className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      {selectedGroup ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-base text-slate-950 shadow-md">
                            {selectedGroup.name.match(/^[\p{Emoji}\u200d]+/u)?.[0] || '🏢'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-black text-white">{selectedGroup.name}</h3>
                              {isGroupAdmin(selectedGroup, currentUser.accId) && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-700 to-indigo-700 text-purple-100 border border-purple-400/50 shadow-xs">
                                  <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                                  <span>You're Admin</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                              <span>👥 {selectedGroup.members.length} सदस्य</span>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">
                                👑 एडमिन: {selectedGroup.creatorName}
                              </span>
                            </p>
                          </div>
                        </div>
                      ) : selectedRecipientMember ? (
                        <div className="flex items-center gap-2.5">
                          <AvatarWith3DFrame
                            avatarUrl={selectedRecipientMember.avatarUrl}
                            name={selectedRecipientMember.fullName}
                            frame={selectedRecipientMember.avatarFrame || 'acc_medallion'}
                            size="sm"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-black text-white">
                                {selectedRecipientMember.fullName}
                              </h3>
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                                @{selectedRecipientMember.username || selectedRecipientMember.accId}
                              </span>
                            </div>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              <span>ऑनलाइन • ACC {selectedRecipientMember.plan} Member</span>
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Chat Actions */}
                    <div className="flex items-center gap-2">
                      {selectedGroup && (
                        <button
                          type="button"
                          onClick={() => setGroupMembersModalOpen(true)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          title="ग्रुप सदस्यों की सूची व बैज देखें"
                        >
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>सदस्य ({selectedGroup.members.length})</span>
                        </button>
                      )}

                      {selectedRecipientMember && (
                        <>
                          <button
                            onClick={() => handleVisitProfile(selectedRecipientMember)}
                            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">प्रोफ़ाइल देखें</span>
                          </button>

                          <button
                            onClick={() => {
                              const res = StorageService.sendFriendRequest(currentUser, selectedRecipientMember.accId);
                              alert(res.message);
                              reloadData();
                            }}
                            className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1 transition-colors"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">मित्र बनाएं</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Messages Bubble Area */}
                  <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-slate-950/70 to-slate-900/90">
                    {/* Welcome Banner */}
                    <div className="text-center py-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>सुरक्षित एन्क्रिप्टेड चैट • ACC MEMBER CHAT</span>
                      </div>
                    </div>

                    {currentConversationMessages.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 space-y-2">
                        <MessageCircle className="w-12 h-12 mx-auto text-slate-600" />
                        <p className="text-sm font-semibold text-slate-400">कोई संदेश नहीं है।</p>
                        <p className="text-xs">बातचीत शुरू करने के लिए नीचे नमस्ते लिखकर भेजें!</p>
                      </div>
                    ) : (
                      currentConversationMessages.map((msg) => {
                        const isMe = msg.senderAccId.toUpperCase() === currentUser.accId.toUpperCase();
                        const isMsgSenderAdmin = isGroupAdmin(selectedGroup, msg.senderAccId);
                        const isMsgSenderTopPerformer = isTopPerformer(msg.senderAccId);

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                          >
                            {/* Group Sender Info & Badges */}
                            {selectedGroup && (
                              <div
                                className={`flex flex-wrap items-center gap-1.5 px-2 mb-0.5 ${
                                  isMe ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                {!isMe ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const senderObj = allMembers.find(
                                        (m) => m.accId.toUpperCase() === msg.senderAccId.toUpperCase()
                                      );
                                      if (senderObj) handleVisitProfile(senderObj);
                                    }}
                                    className="font-bold text-xs text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 cursor-pointer transition"
                                  >
                                    <span>{msg.senderName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      (@{allMembers.find((m) => m.accId.toUpperCase() === msg.senderAccId.toUpperCase())?.username || msg.senderAccId})
                                    </span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400">
                                    आप (You)
                                  </span>
                                )}

                                {/* Color-coded Unique 'Group Admin' Badge */}
                                {isMsgSenderAdmin && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-purple-100 border border-purple-400/50 shadow-[0_0_10px_rgba(147,51,234,0.35)] shrink-0"
                                    title="ग्रुप एडमिन (Group Administrator)"
                                  >
                                    <Crown className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
                                    <span>Group Admin</span>
                                  </span>
                                )}

                                {/* Color-coded Unique 'Top Performer' Badge */}
                                {isMsgSenderTopPerformer && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-slate-950 border border-yellow-200 shadow-[0_0_12px_rgba(245,158,11,0.45)] shrink-0 font-display"
                                    title="कम्युनिटी टॉप परफॉर्मर (Top Performer)"
                                  >
                                    <Flame className="w-3 h-3 text-red-600 fill-red-600 shrink-0 animate-bounce" />
                                    <span>Top Performer</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md ${
                                isMe
                                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-medium rounded-tr-none'
                                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none'
                              }`}
                            >
                              {/* Photo Media */}
                              {msg.mediaType === 'image' && msg.mediaUrl && (
                                <div className="mb-2 rounded-xl overflow-hidden cursor-pointer">
                                  <img
                                    src={msg.mediaUrl}
                                    alt="Shared Photo"
                                    onClick={() => setLightboxImage(msg.mediaUrl!)}
                                    className="max-h-60 w-full object-cover rounded-lg hover:scale-105 transition-transform"
                                  />
                                </div>
                              )}

                              {/* Video Media */}
                              {msg.mediaType === 'video' && msg.videoUrl && (
                                <div className="mb-2 rounded-xl overflow-hidden bg-black/60 p-1 border border-white/10">
                                  <div className="flex items-center gap-2 p-2">
                                    <Play className="w-5 h-5 text-amber-400" />
                                    <a
                                      href={msg.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-amber-300 underline font-bold truncate"
                                    >
                                      {msg.mediaCaption || 'वीडियो लिंक देखें (क्लिक करें)'}
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* Link Preview */}
                              {msg.mediaType === 'link' && msg.linkUrl && (
                                <a
                                  href={msg.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block mb-2 p-2.5 rounded-xl bg-black/30 border border-white/20 hover:border-amber-400 transition-colors"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1 truncate">
                                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                      <span>{msg.linkTitle || 'साझा लिंक'}</span>
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                  </div>
                                  <span className="text-[10px] text-slate-300/80 truncate block mt-0.5">
                                    {msg.linkUrl}
                                  </span>
                                </a>
                              )}

                              {/* Message Text */}
                              <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">
                                {msg.text}
                              </p>

                              {/* Message Footer Time & Tick */}
                              <div
                                className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                                  isMe ? 'text-slate-900/80 font-bold' : 'text-slate-400'
                                }`}
                              >
                                <span>
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {isMe && <CheckCheck className="w-3 h-3 text-slate-950" />}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Emojis Bar */}
                  <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setMessageText((prev) => prev + emoji)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-sm transition-transform active:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Message Input Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-2 sm:p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
                  >
                    {/* Attachment Button */}
                    <button
                      type="button"
                      onClick={() => setAttachModalOpen(true)}
                      className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                      title="फोटो, वीडियो या लिंक जोड़ें"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    {/* Text Input */}
                    <input
                      type="text"
                      placeholder="संदेश लिखें (Type a message)..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-md"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-2xl shadow-inner">
                    💬
                  </div>
                  <h3 className="text-base font-bold text-white">कोई बातचीत चुनी नहीं गई है</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    बाईं ओर से किसी भी सदस्य, अपने स्पॉन्सर या ग्रुप पर क्लिक करके सुरक्षित लाइव चैट शुरू करें।
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: FRIENDS & NETWORK (FACEBOOK-STYLE SOCIAL GRAPH)        */}
        {/* ============================================================= */}
        {activeTab === 'friends' && (
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
            {/* Friends Sub-navigation & Group Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setFriendsSubTab('friends')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    friendsSubTab === 'friends'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  मेरे मित्र ({myFriends.length})
                </button>

                <button
                  onClick={() => setFriendsSubTab('requests')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    friendsSubTab === 'requests'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  अनुरोध ({pendingFriendRequests.length})
                </button>

                <button
                  onClick={() => setFriendsSubTab('find')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    friendsSubTab === 'find'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  नए सदस्य खोजें व जोड़ें ({suggestedMembers.length})
                </button>
              </div>

              {/* Direct Group Creation with Friends */}
              <button
                onClick={() => {
                  setSelectedMemberAccIds(myFriends.map((f) => f.accId));
                  setGroupMemberFilter('friends');
                  setCreateGroupModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shrink-0 cursor-pointer transition active:scale-98"
                title="सभी या चुने हुए दोस्तों के साथ नया कम्युनिटी ग्रुप बनाएं"
              >
                <Users className="w-3.5 h-3.5" />
                <span>👥 दोस्तों के साथ ग्रुप बनाएं</span>
              </button>
            </div>

            {/* Sub-tab 1: My Friends */}
            {friendsSubTab === 'friends' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {myFriends.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
                      <UserPlus className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                      <p className="text-sm font-bold text-slate-300">अभी कोई मित्र नहीं जुड़ा है।</p>
                      <p className="text-xs text-slate-400 mt-1">
                        "नए सदस्य खोजें" टैब पर जाकर अपनी टीम व साथियों को मित्र अनुरोध भेजें!
                      </p>
                    </div>
                  ) : (
                    myFriends.map((friend) => (
                      <div
                        key={friend.accId}
                        className="bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between gap-3 shadow-md transition-all group"
                      >
                        {/* Clickable User Card to visit Profile */}
                        <button
                          type="button"
                          onClick={() => handleVisitProfile(friend)}
                          className="flex items-center gap-3 text-left min-w-0 flex-1 hover:opacity-90 transition cursor-pointer"
                          title="प्रोफ़ाइल देखने हेतु क्लिक करें"
                        >
                          <div className="shrink-0 group-hover:scale-105 transition-transform">
                            <AvatarWith3DFrame
                              avatarUrl={friend.avatarUrl}
                              name={friend.fullName}
                              frame={friend.avatarFrame || 'acc_medallion'}
                              size="md"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                                {friend.fullName}
                              </h4>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </div>
                            <p className="text-xs text-amber-300 font-mono truncate">
                              @{friend.username || friend.accId}
                            </p>
                            <span className="text-[10px] text-slate-400 block truncate">
                              ACC {friend.plan} Member • 👁️ {friend.profileViews || 0} Views
                            </span>
                          </div>
                        </button>

                        <div className="flex flex-col gap-1.5 shrink-0">
                          {/* View Digital ID Card */}
                          <button
                            type="button"
                            onClick={() => setSelectedIdCardMember(friend)}
                            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[11px] flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                            title={`${friend.fullName} का प्रमाणित डिजिटल ID कार्ड देखें`}
                          >
                            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                            <span>🪪 ID कार्ड</span>
                          </button>

                          {/* Direct Chat */}
                          <button
                            type="button"
                            onClick={() => openDirectChatWithMember(friend)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>चैट</span>
                          </button>

                          {/* Remove Friend */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`क्या आप ${friend.fullName} को मित्र सूची से हटाना चाहते हैं?`)) {
                                StorageService.removeFriend(currentUser.accId, friend.accId);
                                reloadData();
                              }
                            }}
                            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 text-[10px] font-bold transition-colors text-center cursor-pointer"
                          >
                            हटाएं
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 2: Friend Requests */}
            {friendsSubTab === 'requests' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pendingFriendRequests.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800 p-6">
                    <Check className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-bold text-slate-300">कोई नया मित्र अनुरोध नहीं है।</p>
                  </div>
                ) : (
                  pendingFriendRequests.map((req) => {
                    const requester = allMembers.find(
                      (m) => m.accId.toUpperCase() === req.user1AccId.toUpperCase()
                    );
                    if (!requester) return null;

                    return (
                      <div
                        key={req.id}
                        className="bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-amber-500/40 flex items-center justify-between gap-3 shadow-md"
                      >
                        {/* Clickable Requester to view Profile */}
                        <button
                          type="button"
                          onClick={() => handleVisitProfile(requester)}
                          className="flex items-center gap-3 text-left min-w-0 flex-1 hover:opacity-90 transition cursor-pointer"
                          title="प्रोफ़ाइल देखने हेतु क्लिक करें"
                        >
                          <AvatarWith3DFrame
                            avatarUrl={requester.avatarUrl}
                            name={requester.fullName}
                            frame={requester.avatarFrame || 'acc_medallion'}
                            size="md"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate hover:text-amber-300">
                              {requester.fullName}
                            </h4>
                            <p className="text-xs text-amber-300 font-mono truncate">
                              @{requester.username || requester.accId}
                            </p>
                            <span className="text-[10px] text-slate-400">अनुरोध भेजा गया</span>
                          </div>
                        </button>

                        <div className="flex flex-col gap-1.5 shrink-0">
                          {/* Check Digital ID Card before accepting */}
                          <button
                            type="button"
                            onClick={() => setSelectedIdCardMember(requester)}
                            className="px-2.5 py-1 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[10.5px] flex items-center justify-center gap-1 shadow-xs transition"
                            title="आईडी कार्ड सत्यापित करें"
                          >
                            <CreditCard className="w-3 h-3 text-amber-300" />
                            <span>🪪 ID कार्ड</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                StorageService.acceptFriendRequest(req.id, currentUser);
                                reloadData();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>स्वीकारें</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                StorageService.declineFriendRequest(req.id);
                                reloadData();
                              }}
                              className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 text-xs font-bold cursor-pointer"
                            >
                              मना करें
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Sub-tab 3: Find & Add Members (दोस्त जोड़ें) */}
            {friendsSubTab === 'find' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestedMembers.map((member) => {
                    const status = StorageService.getFriendshipStatus(currentUser.accId, member.accId);

                    return (
                      <div
                        key={member.accId}
                        className="bg-slate-900/90 rounded-2xl p-3.5 sm:p-4 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 shadow-md transition-all group"
                      >
                        {/* Clickable Profile Navigation */}
                        <button
                          type="button"
                          onClick={() => handleVisitProfile(member)}
                          className="flex items-center gap-3 min-w-0 flex-1 text-left hover:opacity-90 transition cursor-pointer"
                          title="प्रोफ़ाइल देखने हेतु क्लिक करें"
                        >
                          <div className="shrink-0 group-hover:scale-105 transition-transform">
                            <AvatarWith3DFrame
                              avatarUrl={member.avatarUrl}
                              name={member.fullName}
                              frame={member.avatarFrame || 'acc_medallion'}
                              size="md"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300 transition-colors">
                              {member.fullName}
                            </h4>
                            <p className="text-xs text-amber-300 font-mono truncate">
                              @{member.username || member.accId}
                            </p>
                            <span className="text-[10px] text-slate-400 block truncate">
                              ACC {member.plan} Member
                            </span>
                          </div>
                        </button>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                          {/* View Digital ID Card Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedIdCardMember(member)}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1 transition shadow-2xs cursor-pointer"
                            title={`${member.fullName} का डिजिटल 🆔 कार्ड देखें`}
                          >
                            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                            <span>🪪 ID कार्ड</span>
                          </button>

                          {status === 'accepted' ? (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>मित्र हैं</span>
                            </span>
                          ) : status === 'pending_sent' ? (
                            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-1">
                              <span>अनुरोध भेजा</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const res = StorageService.sendFriendRequest(currentUser, member.accId);
                                alert(res.message);
                                reloadData();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center gap-1 cursor-pointer transition shadow-xs"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>मित्र बनाएं</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: GROUPS (COMMUNITY GROUPS & GROUP CHATS)                */}
        {/* ============================================================= */}
        {activeTab === 'groups' && (
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
            {/* Top Bar with Create Group Button */}
            <div className="flex items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>ACC कम्युनिटी ग्रुप्स</span>
                </h3>
                <p className="text-xs text-slate-400">
                  अपनी टीम, डाउनलाइन्स और साथियों के साथ ग्रुप बनाकर फोटो, वीडियो व अपडेट शेयर करें।
                </p>
              </div>

              <button
                onClick={() => setCreateGroupModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>नया ग्रुप बनाएं</span>
              </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 shadow-md hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl text-slate-950 font-bold shadow-md shrink-0">
                      🏢
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-black text-white truncate">{group.name}</h4>
                        {isGroupAdmin(group, currentUser.accId) && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-purple-700 to-indigo-700 text-purple-100 border border-purple-400/50 shadow-xs">
                            <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                            <span>Admin</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{group.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-300 font-bold">
                          👥 {group.members.length} सदस्य
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-500/30">
                          <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                          <span>एडमिन: {group.creatorName}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openGroupChat(group)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>ग्रुप चैट में जाएं</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: MEMBER PROFILE & PROFILE VIEWS (FACEBOOK-STYLE)         */}
        {/* ============================================================= */}
        {activeTab === 'profile' && viewedMember && (
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
            {/* Facebook-style Profile Card */}
            <div className="bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              {/* Cover Gradient / Photo */}
              <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-900 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white font-black text-xs flex items-center gap-1">
                    <span>🇮🇳</span> ACC Official Member
                  </span>
                </div>
              </div>

              {/* Profile Details Bar */}
              <div className="px-4 sm:px-8 pb-6 relative">
                {/* Avatar with 3D Frame Overlapping Cover */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <AvatarWith3DFrame
                      avatarUrl={viewedMember.avatarUrl}
                      name={viewedMember.fullName}
                      frame={viewedMember.avatarFrame || 'acc_medallion'}
                      size="xl"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                          {viewedMember.fullName}
                        </h2>
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      </div>

                      <p className="text-xs sm:text-sm text-amber-300 font-mono font-bold">
                        @{viewedMember.username || viewedMember.accId}
                      </p>

                      <p className="text-xs text-slate-300">
                        {viewedMember.qualification || 'अचीवर्स क्लब सक्रिय सदस्य'} • {viewedMember.city || 'भारत'}
                      </p>
                    </div>
                  </div>

                  {/* Profile Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Digital ID Card Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedIdCardMember(viewedMember)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md border border-blue-400/30 cursor-pointer transition active:scale-98"
                      title={`${viewedMember.fullName} का प्रमाणित डिजिटल ID कार्ड देखें`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                      <span>🪪 डिजिटल ID कार्ड</span>
                    </button>

                    {viewedMember.accId.toUpperCase() === currentUser.accId.toUpperCase() ? (
                      <button
                        onClick={() => setEditProfileModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>प्रोफ़ाइल व @username एडिट करें</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => openDirectChatWithMember(viewedMember)}
                          className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>मैसेज भेजें</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = StorageService.sendFriendRequest(currentUser, viewedMember.accId);
                            alert(res.message);
                            reloadData();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                          <span>मित्र बनाएं</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile View Counter Highlight Banner */}
                <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-transparent border border-amber-500/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg">
                      👁️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>प्रोफ़ाइल व्यूज (Profile Views Tracker)</span>
                        <span className="text-[10px] text-emerald-400">● लाइव</span>
                      </p>
                      <p className="text-[11px] text-slate-300">
                        इस प्रोफ़ाइल को अब तक कुल{' '}
                        <strong className="text-amber-300 font-bold text-sm">
                          {viewedMember.profileViews || 0}
                        </strong>{' '}
                        सदस्यों ने देखा है।
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow">
                    {viewedMember.profileViews || 0} Views
                  </span>
                </div>

                {/* User Bio */}
                {viewedMember.bio && (
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 mb-4">
                    <p className="italic leading-relaxed">"{viewedMember.bio}"</p>
                  </div>
                )}

                {/* Info Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">ACC 🆔</span>
                    <span className="font-mono font-bold text-amber-300">{viewedMember.accId}</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">प्लान सिस्टम</span>
                    <span className="font-bold text-emerald-400">ACC {viewedMember.plan}</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">स्पॉन्सर</span>
                    <span className="font-bold text-white truncate block">
                      {viewedMember.sponsorName || viewedMember.sponsorId}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">ज्वाइनिंग दिनांक</span>
                    <span className="font-bold text-slate-300">
                      {viewedMember.createdAt ? new Date(viewedMember.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>

                {/* Recent Profile Visitors (Only shown for own profile or public summary) */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>हाल ही में प्रोफ़ाइल देखने वाले सदस्य (Recent Visitors)</span>
                  </h4>

                  {Array.isArray(viewedMember.profileVisitors) && viewedMember.profileVisitors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {viewedMember.profileVisitors.map((visitor, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <AvatarWith3DFrame
                              avatarUrl={visitor.visitorAvatar}
                              name={visitor.visitorName}
                              size="sm"
                              showBadge={false}
                            />
                            <div>
                              <p className="text-xs font-bold text-white truncate max-w-[120px]">
                                {visitor.visitorName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {visitor.visitorAccId}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] text-amber-300/80">
                            {new Date(visitor.visitedAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      अभी कोई विजिटर डेटा नहीं है। जैसे ही कोई सदस्य इस प्रोफ़ाइल को देखेगा, यहां सूची दिखेगी।
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 5: SOCIAL NOTIFICATIONS                                  */}
        {/* ============================================================= */}
        {activeTab === 'notifications' && (
          <div className="flex-1 flex flex-col space-y-3 overflow-y-auto max-w-3xl mx-auto w-full">
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>सूचनाएं (Notifications)</span>
              </h3>

              <button
                onClick={() => {
                  StorageService.markAllNotificationsAsRead(currentUser.accId);
                  reloadData();
                }}
                className="text-xs text-amber-300 hover:underline font-bold"
              >
                सभी पढ़ा हुआ चिह्नित करें
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Bell className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-300">कोई नई सूचना नहीं है।</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    StorageService.markNotificationAsRead(notif.id);
                    if (notif.linkAction?.type === 'open_chat') {
                      const target = allMembers.find(
                        (m) => m.accId.toUpperCase() === notif.linkAction!.targetId.toUpperCase()
                      );
                      if (target) openDirectChatWithMember(target);
                    } else if (notif.linkAction?.type === 'view_profile') {
                      const target = allMembers.find(
                        (m) => m.accId.toUpperCase() === notif.linkAction!.targetId.toUpperCase()
                      );
                      if (target) handleVisitProfile(target);
                    } else if (notif.linkAction?.type === 'open_group') {
                      const grp = groups.find((g) => g.id === notif.linkAction!.targetId);
                      if (grp) openGroupChat(grp);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                    notif.isRead
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                      : 'bg-slate-900 border-amber-500/50 shadow-md text-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-lg">
                    {notif.type === 'message'
                      ? '💬'
                      : notif.type === 'friend_request'
                      ? '👥'
                      : notif.type === 'friend_accept'
                      ? '🎉'
                      : notif.type === 'profile_view'
                      ? '👀'
                      : '🔔'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(notif.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{notif.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. ATTACHMENT MODAL (PHOTO / VIDEO / LINK)                    */}
      {/* ------------------------------------------------------------- */}
      {attachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-amber-400" />
                <span>मीडिया या लिंक साझा करें</span>
              </h3>
              <button
                onClick={() => {
                  setAttachModalOpen(false);
                  setAttachType(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attach Type Selector */}
            {!attachType ? (
              <div className="grid grid-cols-3 gap-3 py-4">
                <button
                  onClick={() => setAttachType('image')}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex flex-col items-center gap-2 text-center transition-all hover:border-amber-400"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white">फोटो (Photo)</span>
                </button>

                <button
                  onClick={() => setAttachType('video')}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex flex-col items-center gap-2 text-center transition-all hover:border-amber-400"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white">वीडियो (Video)</span>
                </button>

                <button
                  onClick={() => setAttachType('link')}
                  className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex flex-col items-center gap-2 text-center transition-all hover:border-amber-400"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white">लिंक (Link)</span>
                </button>
              </div>
            ) : attachType === 'image' ? (
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-4 text-center cursor-pointer transition-colors"
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                  ) : (
                    <div className="space-y-1">
                      <ImageIcon className="w-8 h-8 mx-auto text-amber-400" />
                      <p className="text-xs font-bold text-slate-200">गैलरी / कैमरे से फोटो चुनें</p>
                      <p className="text-[10px] text-slate-500">क्लिक करके फोटो अपलोड करें</p>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="फोटो का कैप्शन (वैकल्पिक)..."
                  value={mediaCaptionInput}
                  onChange={(e) => setMediaCaptionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setAttachType(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    पीछे
                  </button>
                  <button
                    onClick={handleSendAttachment}
                    disabled={!previewImage && !mediaUrlInput.trim()}
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black disabled:opacity-40"
                  >
                    फोटो भेजें
                  </button>
                </div>
              </div>
            ) : attachType === 'video' ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="वीडियो लिंक (YouTube, Drive, MP4 URL)..."
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />

                <input
                  type="text"
                  placeholder="वीडियो का शीर्षक या विवरण..."
                  value={mediaCaptionInput}
                  onChange={(e) => setMediaCaptionInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setAttachType(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    पीछे
                  </button>
                  <button
                    onClick={handleSendAttachment}
                    disabled={!mediaUrlInput.trim()}
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black disabled:opacity-40"
                  >
                    वीडियो भेजें
                  </button>
                </div>
              </div>
            ) : attachType === 'link' ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="लिंक URL (https://...)..."
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />

                <input
                  type="text"
                  placeholder="लिंक का शीर्षक (उदा. जॉइनिंग लिंक, ट्रेनिंग वीडियो)..."
                  value={linkTitleInput}
                  onChange={(e) => setLinkTitleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setAttachType(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    पीछे
                  </button>
                  <button
                    onClick={handleSendAttachment}
                    disabled={!mediaUrlInput.trim()}
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black disabled:opacity-40"
                  >
                    लिंक भेजें
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. CREATE GROUP MODAL (WITH FRIENDS FILTERING & ICONS)         */}
      {/* ------------------------------------------------------------- */}
      {createGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-sm">
                  👥
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    नया कम्युनिटी ग्रुप बनाएं
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    दोस्तों व टीम सदस्यों के साथ ग्रुप चैट और मीडिया शेयर करें
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateGroupModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto pr-1">
              {/* Group Icon Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  ग्रुप आइकन चुनें (Group Icon)
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['👥', '🚀', '💎', '👑', '🏢', '💼', '🤝', '🌟', '🔥', '🏆', '⚡', '🎯', '🇮🇳'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewGroupIcon(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition shrink-0 cursor-pointer ${
                        newGroupIcon === emoji
                          ? 'bg-amber-500 text-slate-950 scale-110 shadow-md ring-2 ring-amber-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  ग्रुप का नाम <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    {newGroupIcon}
                  </span>
                  <input
                    type="text"
                    placeholder="उदा. ACC चैंपियंस लीडर्स क्लब"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Group Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  ग्रुप का उद्देश्य / नियम (Description)
                </label>
                <textarea
                  placeholder="ग्रुप के विषय, उद्देश्य व दैनिक अपडेट्स का संक्षिप्त विवरण..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Member Selection Tabs & Actions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    ग्रुप में सदस्य जोड़ें ({selectedMemberAccIds.length} चयनित)
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const targetList = groupMemberFilter === 'friends' ? myFriends : allMembers.filter((m) => m.accId.toUpperCase() !== currentUser.accId.toUpperCase());
                        setSelectedMemberAccIds(targetList.map((m) => m.accId));
                      }}
                      className="text-amber-400 hover:underline font-bold"
                    >
                      सभी चुनें
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMemberAccIds([])}
                      className="text-slate-400 hover:underline"
                    >
                      हटाएं
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGroupMemberFilter('friends')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      groupMemberFilter === 'friends'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    ⭐ मेरे मित्र ({myFriends.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroupMemberFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      groupMemberFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    🌐 सभी सदस्य ({allMembers.filter((m) => m.accId.toUpperCase() !== currentUser.accId.toUpperCase()).length})
                  </button>
                </div>

                {/* Member Search input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={groupMemberSearch}
                    onChange={(e) => setGroupMemberSearch(e.target.value)}
                    placeholder="नाम या ACC ID से खोजें..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Member List with Checkboxes */}
                <div className="max-h-44 overflow-y-auto space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {(() => {
                    const sourceList = groupMemberFilter === 'friends'
                      ? myFriends
                      : allMembers.filter((m) => m.accId.toUpperCase() !== currentUser.accId.toUpperCase());
                    
                    const filtered = sourceList.filter((m) => {
                      if (!groupMemberSearch.trim()) return true;
                      const q = groupMemberSearch.trim().toLowerCase();
                      return (
                        m.fullName.toLowerCase().includes(q) ||
                        m.accId.toLowerCase().includes(q) ||
                        (m.username && m.username.toLowerCase().includes(q))
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <p className="text-center py-4 text-xs text-slate-500">
                          {groupMemberFilter === 'friends'
                            ? 'कोई मित्र नहीं मिला। पहले "नए सदस्य खोजें" से दोस्त जोड़ें।'
                            : 'कोई सदस्य नहीं मिला।'}
                        </p>
                      );
                    }

                    return filtered.map((m) => {
                      const isSelected = selectedMemberAccIds.includes(m.accId);
                      return (
                        <label
                          key={m.accId}
                          className={`flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                            isSelected ? 'bg-amber-500/15 border border-amber-500/40' : 'bg-slate-900/60 hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMemberAccIds([...selectedMemberAccIds, m.accId]);
                                } else {
                                  setSelectedMemberAccIds(selectedMemberAccIds.filter((id) => id !== m.accId));
                                }
                              }}
                              className="rounded text-amber-500 focus:ring-0 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">{m.fullName}</span>
                              <span className="text-[10px] text-amber-300 font-mono block">@{m.username || m.accId}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md font-bold shrink-0">
                            ACC {m.plan}
                          </span>
                        </label>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCreateGroup}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer transition active:scale-98"
              >
                {newGroupIcon} नया ग्रुप बनाएं ({selectedMemberAccIds.length} सदस्य शामिल)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. EDIT USERNAME & BIO MODAL                                  */}
      {/* ------------------------------------------------------------- */}
      {editProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>प्रोफ़ाइल व @username कस्टमाइज़ करें</span>
              </h3>
              <button onClick={() => setEditProfileModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileActionMsg && (
              <div
                className={`p-2.5 rounded-xl text-xs font-bold ${
                  profileActionMsg.error
                    ? 'bg-red-950/60 border border-red-500/40 text-red-300'
                    : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                }`}
              >
                {profileActionMsg.text}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  आपका अद्वितीय @username (Unique Social Handle)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="vikas_kumar99"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  इस यूजरनेम से कोई भी सदस्य आपकी प्रोफ़ाइल सीधे खोज व देख सकता है।
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  बायो / स्थिति (Status / Bio)
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="अपने बारे में कुछ शब्द लिखें..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSaveProfileChanges}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-md"
              >
                परिवर्तन सहेजें (Save Changes)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. LIGHTBOX FULLSCREEN IMAGE VIEWER                           */}
      {/* ------------------------------------------------------------- */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-pointer"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen Preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. GROUP MEMBERS MODAL (WITH ADMIN & TOP PERFORMER BADGES)    */}
      {/* ------------------------------------------------------------- */}
      {groupMembersModalOpen && selectedGroup && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {selectedGroup.name.match(/^[\p{Emoji}\u200d]+/u)?.[0] || '🏢'}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {selectedGroup.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    कुल {selectedGroup.members.length} सदस्य जुड़े हैं • ग्रुप विवरण व बैज
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGroupMembersModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges Legend Bar */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-around gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 text-purple-100 border border-purple-400/50 shadow-xs">
                  <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>Group Admin</span>
                </span>
                <span className="text-[10.5px] text-slate-400">ग्रुप व्यवस्थापक</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-slate-950 border border-yellow-200 shadow-xs">
                  <Flame className="w-3 h-3 text-red-600 fill-red-600 animate-bounce" />
                  <span>Top Performer</span>
                </span>
                <span className="text-[10.5px] text-slate-400">शीर्ष अचीवर</span>
              </div>
            </div>

            {/* Members Roster List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedGroup.members.map((memRef) => {
                const fullMem = allMembers.find((m) => m.accId.toUpperCase() === memRef.accId.toUpperCase());
                const isAdmin = isGroupAdmin(selectedGroup, memRef.accId);
                const isTop = isTopPerformer(memRef.accId);

                return (
                  <div
                    key={memRef.accId}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (fullMem) {
                          setGroupMembersModalOpen(false);
                          handleVisitProfile(fullMem);
                        }
                      }}
                      className="flex items-center gap-3 text-left min-w-0 flex-1 hover:opacity-90 transition cursor-pointer"
                    >
                      <AvatarWith3DFrame
                        avatarUrl={fullMem?.avatarUrl}
                        name={memRef.name}
                        frame={fullMem?.avatarFrame || 'acc_medallion'}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-white truncate">
                            {memRef.name}
                          </h4>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-purple-700 to-indigo-700 text-purple-100 border border-purple-400/50 shadow-xs">
                              <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                              <span>Admin</span>
                            </span>
                          )}
                          {isTop && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 border border-yellow-200 shadow-xs">
                              <Flame className="w-2.5 h-2.5 text-red-600 fill-red-600 animate-bounce" />
                              <span>Top</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-amber-300 font-mono truncate">
                          @{fullMem?.username || memRef.accId}
                        </p>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {fullMem ? `ACC ${fullMem.plan} • ₹${fullMem.totalEarnings || 0} कमाई` : 'सक्रिय सदस्य'}
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {fullMem && (
                        <button
                          type="button"
                          onClick={() => {
                            setGroupMembersModalOpen(false);
                            setSelectedIdCardMember(fullMem);
                          }}
                          className="px-2 py-1 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[10.5px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                          title="डिजिटल ID कार्ड देखें"
                        >
                          <CreditCard className="w-3 h-3 text-amber-300" />
                          <span className="hidden sm:inline">ID कार्ड</span>
                        </button>
                      )}

                      {memRef.accId.toUpperCase() !== currentUser.accId.toUpperCase() && fullMem && (
                        <button
                          type="button"
                          onClick={() => {
                            setGroupMembersModalOpen(false);
                            openDirectChatWithMember(fullMem);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10.5px] flex items-center gap-1 shadow-xs transition cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>चैट</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. DIGITAL ID CARD VIEWER MODAL                               */}
      {/* ------------------------------------------------------------- */}
      {selectedIdCardMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border-2 border-amber-500/50 p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  🪪
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {selectedIdCardMember.fullName} का प्रमाणित डिजिटल ID कार्ड
                  </h3>
                  <p className="text-[11px] text-amber-300 font-mono">
                    ACC 🆔: {selectedIdCardMember.accId} • {selectedIdCardMember.plan} Plan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedIdCardMember;
                    setSelectedIdCardMember(null);
                    handleVisitProfile(target);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>प्रोफ़ाइल देखें</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIdCardMember(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[80vh]">
              <DigitalIdCard
                member={selectedIdCardMember}
                onClose={() => setSelectedIdCardMember(null)}
                isSponsorCard={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. MEMBER PROFILE POP-UP MODAL (INSIDE ACTIVE CHAT)           */}
      {/* ------------------------------------------------------------- */}
      {viewedProfileModalMember && (() => {
        const isSelf = viewedProfileModalMember.accId.toUpperCase() === currentUser.accId.toUpperCase();
        const privacy = getMemberPrivacyDisplay(viewedProfileModalMember, isSelf);
        const isTargetAdmin = isGroupAdmin(selectedGroup, viewedProfileModalMember.accId);
        const isTargetTop = isTopPerformer(viewedProfileModalMember.accId);
        const isAlreadyFriend = myFriends.some(
          (f) => f.accId.toUpperCase() === viewedProfileModalMember.accId.toUpperCase()
        );

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
            onClick={() => setViewedProfileModalMember(null)}
          >
            <div
              className="relative w-[95vw] sm:w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/70 p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-4 my-auto text-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-xs">
                    👤
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {isSelf ? 'मेरी कम्युनिटी प्रोफ़ाइल' : 'सदस्य प्रोफ़ाइल'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      सुरक्षित सदस्य विवरण व डिजिटल पहचान
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewedProfileModalMember(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="बंद करें"
                  aria-label="प्रोफ़ाइल पॉप-अप बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Avatar & Verification Section */}
              <div className="flex items-center gap-3.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="relative shrink-0">
                  <AvatarWith3DFrame
                    avatarUrl={privacy.avatarUrl}
                    name={privacy.displayName}
                    frame={viewedProfileModalMember.avatarFrame || 'acc_medallion'}
                    size="md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">
                      {privacy.displayName}
                    </h4>

                    {/* Admin Badge */}
                    {isTargetAdmin && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-purple-700 to-indigo-700 text-purple-100 border border-purple-400/50 shadow-xs">
                        <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                        <span>Admin</span>
                      </span>
                    )}

                    {/* Top Performer Badge */}
                    {isTargetTop && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 border border-yellow-200 shadow-xs">
                        <Flame className="w-2.5 h-2.5 text-red-600 fill-red-600 animate-bounce" />
                        <span>Top Performer</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-amber-300 font-mono">
                    {privacy.displayUsername}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      {viewedProfileModalMember.plan} Plan
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">सत्यापित सक्रिय सदस्य ✓</span>
                  </div>
                </div>
              </div>

              {/* CRITICAL RULE: Prominent Permanent Public ACC ID Banner */}
              <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-500/60 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-inner">
                <div className="min-w-0">
                  <span className="text-[9.5px] uppercase font-black tracking-wider text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>OFFICIAL ACC MEMBER 🆔 (सार्वजनिक)</span>
                  </span>
                  <p className="font-mono font-black text-base sm:text-lg text-amber-400 tracking-wider truncate">
                    {privacy.displayAccId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(privacy.displayAccId);
                    alert(`ACC सदस्य ID (${privacy.displayAccId}) कॉपी हो गई!`);
                  }}
                  className="px-2.5 py-1.5 bg-amber-500/30 hover:bg-amber-500/40 text-amber-300 rounded-xl border border-amber-500/50 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                  title="सदस्य ID कॉपी करें"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Masked / Protected Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block font-medium">स्पॉन्सर आईडी (Sponsor):</span>
                  <span className="font-mono text-slate-200 text-[10.5px] font-semibold truncate block">
                    {privacy.displaySponsorId}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block font-medium">स्पॉन्सर नाम (Name):</span>
                  <span className="text-slate-200 text-[10.5px] font-semibold truncate block">
                    {privacy.displaySponsorName}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block font-medium">मोबाइल नंबर (Mobile):</span>
                  <span className="font-mono text-slate-200 text-[10.5px] font-semibold truncate block">
                    {privacy.displayMobile}
                  </span>
                </div>

                <div className="min-w-0">
                  <span className="text-[9.5px] text-slate-400 block font-medium">ईमेल आईडी (Email):</span>
                  <span className="font-mono text-slate-200 text-[10.5px] font-semibold truncate block">
                    {privacy.displayEmail}
                  </span>
                </div>
              </div>

              {/* Bio / Status */}
              {viewedProfileModalMember.bio && (
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 italic">
                  "{viewedProfileModalMember.bio}"
                </div>
              )}

              {/* Action Buttons: Digital ID Card, Direct Chat, Privacy Settings */}
              <div className="space-y-2 pt-1">
                {/* 1. Digital ID Card Popup Button */}
                <button
                  type="button"
                  onClick={() => {
                    const mem = viewedProfileModalMember;
                    setViewedProfileModalMember(null);
                    setSelectedIdCardMember(mem);
                  }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-xl shadow-md border border-blue-400/40 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  <span>🪪 डिजिटल ID कार्ड देखें (View Digital ID Card)</span>
                </button>

                {/* 2. Direct 1-on-1 Chat Button (if not viewing self) */}
                {!isSelf && (
                  <button
                    type="button"
                    onClick={() => {
                      const mem = viewedProfileModalMember;
                      setViewedProfileModalMember(null);
                      openDirectChatWithMember(mem);
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>💬 बातचीत शुरू करें (Start 1-on-1 Chat)</span>
                  </button>
                )}

                {/* 3. Friend Request Button (if not self and not friends) */}
                {!isSelf && !isAlreadyFriend && (
                  <button
                    type="button"
                    onClick={() => {
                      const res = StorageService.sendFriendRequest(currentUser, viewedProfileModalMember.accId);
                      alert(res.message);
                      reloadData();
                    }}
                    className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/40 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>मित्र अनुरोध भेजें (Send Friend Request)</span>
                  </button>
                )}

                {/* 4. Privacy Settings Quick Button (if viewing own profile) */}
                {isSelf && (
                  <button
                    type="button"
                    onClick={() => {
                      setChatPrivacyDraft(currentUser.privacySettings || {
                        showProfilePic: true,
                        showFullNamePublic: true,
                        showMobile: false,
                        showWhatsapp: false,
                        showEmail: false,
                        showSponsorId: true,
                        showUsername: true,
                        showCity: true,
                        showProfileLink: true,
                        showPersonalQr: false,
                      });
                      setShowChatPrivacyModal(true);
                    }}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm rounded-xl border border-amber-500/50 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>🔒 प्रोफ़ाइल व 🆔 कार्ड गोपनीयता सेटिंग्स</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ------------------------------------------------------------- */}
      {/* 10. CHAT & ID CARD PRIVACY SETTINGS MODAL                     */}
      {/* ------------------------------------------------------------- */}
      {showChatPrivacyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setShowChatPrivacyModal(false)}
        >
          <div
            className="relative w-[95vw] sm:w-full max-w-md bg-white rounded-3xl border-2 border-amber-500/70 p-4 sm:p-6 shadow-2xl space-y-4 my-auto text-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  🔒
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    गोपनीयता सेटिंग्स (Privacy Settings)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    प्रोफ़ाइल व डिजिटल ID कार्ड पर क्या सार्वजनिक रखना है
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowChatPrivacyModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Permanent Public Rule Banner */}
            <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong className="text-amber-950 block">📌 सुरक्षा नियम (Rule):</strong>
              केवल आपकी <strong>ACC सदस्य आईडी ({currentUser.accId})</strong> हमेशा सार्वजनिक रहेगी। बाकी सभी विवरण (फोटो, नाम, मोबाइल, ईमेल, स्पॉन्सर आईडी, यूज़रनेम) आप अपनी इच्छानुसार प्राइवेट या मास्क रख सकते हैं।
            </div>

            {chatPrivacySuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{chatPrivacySuccessMsg}</span>
              </div>
            )}

            {/* Toggles Container */}
            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 text-xs">
              {/* 1. Profile Picture */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">प्रोफ़ाइल फ़ोटो दिखाएं (Show Photo)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर सुरक्षित ACC प्रतीक दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showProfilePic !== false}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showProfilePic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* 2. Full Name */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">पूरा नाम सार्वजनिक करें (Show Full Name)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर मास्क नाम दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showFullNamePublic !== false}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showFullNamePublic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 3. Sponsor ID */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">स्पॉन्सर आईडी दिखाएं (Show Sponsor ID)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर ACC249**** दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showSponsorId !== false}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showSponsorId: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* 4. Username */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">यूज़रनेम दिखाएं (Show Username @handle)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर @us**** दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showUsername !== false}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showUsername: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              {/* 5. Mobile */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">मोबाइल नंबर दिखाएं (Show Mobile)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर +91 98••••••10 दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showMobile}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showMobile: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2874f0]"></div>
                </label>
              </div>

              {/* 6. Email */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">ईमेल आईडी दिखाएं (Show Email)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर m*****@acc.in दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showEmail}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showEmail: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {/* 7. WhatsApp Chat */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">WhatsApp डायरेक्ट चैट (Direct WhatsApp)</span>
                  <p className="text-[10px] text-slate-500">अन्य सदस्य सीधे WhatsApp पर संपर्क कर सकेंगे।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showWhatsapp}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showWhatsapp: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* 8. City & State */}
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">स्थान / शहर दिखाएं (Show City)</span>
                  <p className="text-[10px] text-slate-500">बंद रहने पर केवल 'भारत (India)' दिखेगा।</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={chatPrivacyDraft.showCity !== false}
                    onChange={(e) => setChatPrivacyDraft({ ...chatPrivacyDraft, showCity: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowChatPrivacyModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSaveChatPrivacy}
                disabled={isSavingChatPrivacy}
                className="px-5 py-2 bg-[#2874f0] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer text-xs"
              >
                {isSavingChatPrivacy ? 'सुरक्षित कर रहे हैं...' : 'सेटिंग्स सहेजें ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
