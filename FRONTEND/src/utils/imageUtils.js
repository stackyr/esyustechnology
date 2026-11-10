/**
 * Universal Cloud Storage & Image Hosting Link Auto-Embedder
 * 
 * Automatically transforms share/preview links from Dropbox, Google Drive,
 * Cloudinary, OneDrive, GitHub, Imgur, PostImages, and more into direct,
 * high-speed embeddable raw image URLs.
 * 
 * If a link is already an embedded/direct link, it safely leaves it intact.
 */

export function normalizeEmbedImageUrl(url) {
  if (!url || typeof url !== 'string') return url || '';
  const str = url.trim();

  // If local path or data URL or empty, leave as-is
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    return str;
  }

  try {
    const parsed = new URL(str);
    const host = parsed.hostname.toLowerCase();

    // 1. Dropbox (dl=0 -> raw=1 or dl.dropboxusercontent.com)
    if (host.includes('dropbox.com') || host.includes('dropboxusercontent.com')) {
      if (host === 'dl.dropboxusercontent.com' && !parsed.searchParams.has('dl')) {
        return str;
      }
      // Preserve existing parameters (like rlkey) while ensuring raw=1
      parsed.searchParams.delete('dl');
      parsed.searchParams.set('raw', '1');
      return parsed.toString();
    }

    // 2. Google Drive (file/d/ID or open?id=ID -> direct Google edge image CDN)
    if (host.includes('drive.google.com')) {
      let fileId = null;
      const fileMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch) fileId = fileMatch[1];
      if (!fileId && parsed.searchParams.has('id')) fileId = parsed.searchParams.get('id');
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }

    // 3. GitHub (blob -> raw.githubusercontent.com)
    if (host === 'github.com' && parsed.pathname.includes('/blob/')) {
      return `https://raw.githubusercontent.com${parsed.pathname.replace('/blob/', '/')}`;
    }

    // 4. Imgur (page URL -> direct .jpg link)
    if ((host === 'imgur.com' || host === 'm.imgur.com') &&
        !parsed.pathname.startsWith('/a/') &&
        !parsed.pathname.startsWith('/gallery/')) {
      const cleanPath = parsed.pathname.replace(/^\/+/, '');
      if (cleanPath && !cleanPath.includes('/')) {
        const id = cleanPath.split('.')[0];
        return `https://i.imgur.com/${id}.jpg`;
      }
    }

    // 5. Cloudinary: strip force-download flags (fl_attachment) so it renders inline
    if (host.includes('cloudinary.com')) {
      let cleaned = str;
      if (cleaned.includes('/fl_attachment/')) {
        cleaned = cleaned.replace('/fl_attachment/', '/');
      }
      if (cleaned.includes('/fl_attachment,')) {
        cleaned = cleaned.replace('/fl_attachment,', '/');
      }
      return cleaned;
    }

    // 6. OneDrive (redir -> download)
    if (host.includes('onedrive.live.com') && parsed.pathname.includes('/redir')) {
      parsed.pathname = parsed.pathname.replace('/redir', '/download');
      return parsed.toString();
    }

    // 7. PostImages / Postimg
    if (host === 'postimg.cc') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length === 1 && !parts[0].includes('.')) {
        return `https://i.postimg.cc/${parts[0]}/image.jpg`;
      }
    }

  } catch (err) {
    // If URL parsing fails, return original
  }

  return str;
}

/**
 * Deep recursive object sanitizer: normalizes every image URL found in an object, array, or string
 */
export function deepNormalizeImageUrls(obj) {
  if (typeof obj === 'string') {
    return normalizeEmbedImageUrl(obj);
  }
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => deepNormalizeImageUrls(item));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      const keyLower = key.toLowerCase();
      const isImageField =
        keyLower.includes('image') ||
        keyLower.includes('logo') ||
        keyLower.includes('photo') ||
        keyLower.includes('avatar') ||
        keyLower.includes('banner') ||
        keyLower.includes('picture') ||
        keyLower.includes('icon');

      const isUrl = value.startsWith('http://') || value.startsWith('https://');

      if (isImageField || isUrl) {
        result[key] = normalizeEmbedImageUrl(value);
      } else {
        result[key] = value;
      }
    } else if (value && typeof value === 'object') {
      result[key] = deepNormalizeImageUrls(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Helper to display cloud provider badge if detected
 */
export function detectCloudProvider(url) {
  if (!url || typeof url !== 'string') return null;
  const lower = url.toLowerCase();
  if (lower.includes('dropbox.com') || lower.includes('dropboxusercontent.com')) return 'Dropbox (Auto-Embedded)';
  if (lower.includes('drive.google.com') || lower.includes('googleusercontent.com')) return 'Google Drive (Auto-Embedded)';
  if (lower.includes('cloudinary.com')) return 'Cloudinary (Direct)';
  if (lower.includes('github.com') || lower.includes('githubusercontent.com')) return 'GitHub (Raw)';
  if (lower.includes('imgur.com')) return 'Imgur (Direct)';
  if (lower.includes('onedrive.live.com') || lower.includes('1drv.ms')) return 'OneDrive (Direct)';
  return null;
}
