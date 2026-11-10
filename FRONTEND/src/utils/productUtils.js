/**
 * Helper to determine clean, accurate package filename and download metadata
 * Resolves .apk for Android and .exe for Windows systems
 */
export function resolveProductDownload(product) {
  if (!product) {
    return {
      filename: 'package',
      isAndroid: false,
      isWindows: true,
      label: 'Download Package',
      typeLabel: 'Package'
    };
  }

  const platformLower = (product.platform || '').toLowerCase();
  const isAndroid = platformLower.includes('android');
  const isWindows = platformLower.includes('windows') || platformLower.includes('desktop');

  let filename = (product.downloadFile || '').trim();

  // 1. Extract genuine filename from downloadUrl if present
  if (product.downloadUrl) {
    try {
      const urlObj = new URL(product.downloadUrl);
      const last = urlObj.pathname.split('/').filter(Boolean).pop();
      if (last && (last.endsWith('.apk') || last.endsWith('.exe') || last.endsWith('.zip') || last.endsWith('.msi'))) {
        filename = decodeURIComponent(last);
      }
    } catch (e) {
      // not a valid URL or relative path
    }
  }

  // 2. Sanitize extension based on platform
  if (isAndroid) {
    if (filename.toLowerCase().endsWith('.exe')) {
      filename = filename.replace(/\.exe$/i, '.apk');
    }
    if (!filename || (!filename.toLowerCase().endsWith('.apk') && !filename.toLowerCase().endsWith('.aab'))) {
      const cleanName = (product.name || 'App').replace(/\s+/g, '');
      filename = `${cleanName}.apk`;
    }
  } else {
    if (!filename) {
      const cleanName = (product.name || 'App').replace(/\s+/g, '');
      filename = `${cleanName}-Setup.exe`;
    }
  }

  const typeLabel = isAndroid ? 'Android APK' : isWindows ? 'Windows EXE' : 'Release Package';
  const label = isAndroid ? 'Download APK' : isWindows ? 'Download EXE' : 'Download Package';

  return {
    filename,
    isAndroid,
    isWindows,
    label,
    typeLabel
  };
}
