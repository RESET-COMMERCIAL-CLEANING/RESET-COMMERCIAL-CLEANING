// Generate default avatars when profile pictures are not available

export const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}` || '?';
};

export const getDefaultAvatarUrl = (name: string): string => {
  const [firstName = '', lastName = ''] = name.split(' ');
  const initials = getInitials(firstName, lastName);

  // Using UI Avatars service for generating initials-based avatars
  const encodedName = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encodedName}&background=0ea5e9&color=fff&bold=true&rounded=true`;
};

export const getAvatarUrl = (avatarUrl: string | undefined | null, fallbackName: string): string => {
  // If avatar URL exists and is not empty, use it
  if (avatarUrl && avatarUrl.trim()) {
    return avatarUrl;
  }
  // Otherwise, generate a default avatar based on name
  return getDefaultAvatarUrl(fallbackName);
};
