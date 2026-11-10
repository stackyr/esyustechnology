/**
 * Universal Cloud Storage & Image Hosting Link Auto-Embedder (Backend)
 * Transforms Dropbox, Google Drive, Cloudinary, OneDrive, GitHub, Imgur, PostImages
 * into direct, raw embedded image URLs.
 */

export function normalizeEmbedImageUrl(url) {
  if (!url || typeof url !== 'string') return url || '';
  const str = url.trim();

  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    return str;
  }

  try {
    const parsed = new URL(str);
    const host = parsed.hostname.toLowerCase();

    // 1. Dropbox (dl=0 -> raw=1)
    if (host.includes('dropbox.com') || host.includes('dropboxusercontent.com')) {
      if (host === 'dl.dropboxusercontent.com' && !parsed.searchParams.has('dl')) {
        return str;
      }
      parsed.searchParams.delete('dl');
      parsed.searchParams.set('raw', '1');
      return parsed.toString();
    }

    // 2. Google Drive
    if (host.includes('drive.google.com')) {
      let fileId = null;
      const fileMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch) fileId = fileMatch[1];
      if (!fileId && parsed.searchParams.has('id')) fileId = parsed.searchParams.get('id');
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }

    // 3. GitHub blob
    if (host === 'github.com' && parsed.pathname.includes('/blob/')) {
      return `https://raw.githubusercontent.com${parsed.pathname.replace('/blob/', '/')}`;
    }

    // 4. Imgur
    if ((host === 'imgur.com' || host === 'm.imgur.com') &&
        !parsed.pathname.startsWith('/a/') &&
        !parsed.pathname.startsWith('/gallery/')) {
      const cleanPath = parsed.pathname.replace(/^\/+/, '');
      if (cleanPath && !cleanPath.includes('/')) {
        const id = cleanPath.split('.')[0];
        return `https://i.imgur.com/${id}.jpg`;
      }
    }

    // 5. Cloudinary: strip fl_attachment
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

    // 6. OneDrive
    if (host.includes('onedrive.live.com') && parsed.pathname.includes('/redir')) {
      parsed.pathname = parsed.pathname.replace('/redir', '/download');
      return parsed.toString();
    }

    // 7. PostImages
    if (host === 'postimg.cc') {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length === 1 && !parts[0].includes('.')) {
        return `https://i.postimg.cc/${parts[0]}/image.jpg`;
      }
    }

  } catch (err) {}

  return str;
}

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
