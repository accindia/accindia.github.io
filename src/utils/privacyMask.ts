import { Member } from '../types';

/**
 * Universal Privacy & Masking Utilities for ACC Profiles & Digital ID Cards
 * Follows the user rule:
 * "Sirf User ID (ACC ID) public rahega baki sab private ya masked rkh sakta hai"
 */

export function maskPhone(phone?: string | number): string {
  const clean = String(phone || '').replace(/\D/g, '');
  if (clean.length < 4) return '+91 98••••••10';
  const start = clean.slice(0, 2);
  const end = clean.slice(-2);
  return `+91 ${start}••••••${end}`;
}

export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 'm*****@acc.in';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0] || 'm'}****@${domain}`;
  }
  return `${local.slice(0, 2)}****@${domain}`;
}

export function maskName(fullName?: string): string {
  if (!fullName) return 'सदस्य';
  const parts = fullName.trim().split(/\s+/);
  return parts
    .map((p) => {
      if (p.length <= 2) return p;
      return `${p[0]}${'*'.repeat(Math.min(4, p.length - 1))}`;
    })
    .join(' ');
}

export function maskSponsorId(sponsorId?: string): string {
  if (!sponsorId) return 'ACC249****';
  const clean = sponsorId.trim();
  if (clean.length <= 6) return clean;
  return `${clean.slice(0, 6)}****`;
}

export function maskUsername(username?: string): string {
  if (!username) return '@user****';
  const clean = username.startsWith('@') ? username.slice(1) : username;
  if (clean.length <= 3) return `@${clean[0]}****`;
  return `@${clean.slice(0, 2)}****`;
}

/**
 * Returns formatted member display properties based on their PrivacySettings
 * isViewerSelf: if the viewer is looking at their own profile, they see unmasked data or a preview
 */
export function getMemberPrivacyDisplay(member: Member, isViewerSelf: boolean = false) {
  const p = member.privacySettings || {};

  // Profile Picture:
  // Default is public (show real avatar) unless showProfilePic is explicitly false
  const isProfilePicPublic = p.showProfilePic !== false;
  const avatarUrl = isViewerSelf || isProfilePicPublic ? member.avatarUrl : undefined;

  // Full Name:
  // Default is public unless showFullNamePublic is explicitly false
  const isNamePublic = p.showFullNamePublic !== false;
  const displayName = isViewerSelf || isNamePublic ? member.fullName : maskName(member.fullName);

  // Mobile:
  // Default is masked (showMobile === true to show full)
  const isMobilePublic = Boolean(p.showMobile);
  const displayMobile = isViewerSelf || isMobilePublic ? `+91 ${member.mobile}` : maskPhone(member.mobile);

  // Email:
  // Default is masked (showEmail === true to show full)
  const isEmailPublic = Boolean(p.showEmail);
  const displayEmail = isViewerSelf || isEmailPublic ? member.email : maskEmail(member.email);

  // Sponsor ID:
  // Default is public unless showSponsorId is explicitly false
  const isSponsorPublic = p.showSponsorId !== false;
  const displaySponsorId = isViewerSelf || isSponsorPublic ? (member.sponsorId || 'ACC249ADMIN01') : maskSponsorId(member.sponsorId);
  const displaySponsorName = isViewerSelf || isSponsorPublic ? (member.sponsorName || 'ACC Sponsor') : maskName(member.sponsorName || 'ACC Sponsor');

  // Username:
  // Default is public unless showUsername is explicitly false
  const isUsernamePublic = p.showUsername !== false;
  const rawUsername = member.username || member.accId;
  const displayUsername = isViewerSelf || isUsernamePublic ? `@${rawUsername.replace(/^@/, '')}` : maskUsername(rawUsername);

  // ACC ID is ALWAYS 100% public (as specifically instructed by user)
  const displayAccId = member.accId;

  return {
    isProfilePicPublic,
    avatarUrl,
    isNamePublic,
    displayName,
    isMobilePublic,
    displayMobile,
    isEmailPublic,
    displayEmail,
    isSponsorPublic,
    displaySponsorId,
    displaySponsorName,
    isUsernamePublic,
    displayUsername,
    displayAccId,
  };
}
