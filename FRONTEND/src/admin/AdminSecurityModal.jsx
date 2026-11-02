import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, KeyRound, User, Eye, EyeOff, AlertCircle, CheckCircle2, X, RefreshCw } from 'lucide-react';
import api from '../utils/api';

export default function AdminSecurityModal({ isOpen, onClose, onCredentialsUpdated }) {
  const [currentUsername, setCurrentUsername] = useState('admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
      setError('');
      setSuccess('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Fetch current admin profile/username
      api.getAdminCredentials()
        .then((res) => {
          if (res?.data?.username) {
            setCurrentUsername(res.data.username);
            setNewUsername(res.data.username);
          }
        })
        .catch(() => {
          // Fallback from localStorage
          try {
            const cached = JSON.parse(localStorage.getItem('esyus_admin_user') || '{}');
            if (cached.username) {
              setCurrentUsername(cached.username);
              setNewUsername(cached.username);
            }
          } catch (e) {}
        });
    } else {
      setIsMounted(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please provide your valid current password to confirm authorization.');
      return;
    }

    if (!newUsername.trim()) {
      setError('New administrator username cannot be empty.');
      return;
    }

    if (newUsername.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        currentPassword: currentPassword.trim(),
        newUsername: newUsername.trim(),
        newPassword: newPassword ? newPassword.trim() : undefined
      };

      const res = await api.updateAdminCredentials(payload);

      if (res.success) {
        setSuccess('Administrator username and password updated successfully in MERN backend!');
        setCurrentUsername(res.data?.username || newUsername.trim());
        
        // Update stored user
        try {
          const userObj = JSON.parse(localStorage.getItem('esyus_admin_user') || '{}');
          userObj.username = res.data?.username || newUsername.trim();
          localStorage.setItem('esyus_admin_user', JSON.stringify(userObj));
        } catch (e) {}

        if (onCredentialsUpdated) {
          onCredentialsUpdated(res.data);
        }

        setTimeout(() => {
          handleClose();
        }, 1800);
      } else {
        setError(res.error || 'Failed to update credentials. Please verify your current password.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with backend database.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isMounted) return null;

  return (
    <div
      data-lenis-prevent="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out select-none ${
        isMounted && !isClosing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`w-full max-w-lg bg-[#fcfbf9] text-[var(--ink)] rounded-3xl border border-[var(--line)] shadow-2xl overflow-hidden relative transition-all duration-300 ease-out transform ${
          isMounted && !isClosing
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[var(--c1)] via-[var(--c3)] to-[var(--c1)]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-[var(--ink)] hover:bg-stone-200/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-[var(--soft)] border border-[var(--line)] flex items-center justify-center text-[var(--c1)] shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--c1)] font-bold">
                  Backend Security
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  Current: {currentUsername}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[var(--ink)] tracking-tight">
                Change Admin Username &amp; Password
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Update administrator credentials directly in the MERN database.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div className="font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="font-medium leading-relaxed">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Current Password (Mandatory Security Verification) */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span>Current Admin Password *</span>
                </span>
                <span className="text-[10px] font-mono text-amber-700 font-normal">
                  Required to verify identity
                </span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  required
                  autoFocus
                  className="w-full px-3 py-2 pr-10 rounded-xl bg-white border border-amber-300 text-xs text-[var(--ink)] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-3.5 space-y-3.5">
              {/* New Username */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  New Admin Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. admin or sayantan"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--c1)]/20 focus:border-[var(--c1)] transition-all font-mono"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  New Password <span className="text-[10px] font-normal text-stone-500 font-mono">(Leave blank to keep unchanged)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password..."
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--c1)]/20 focus:border-[var(--c1)] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              {newPassword && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password..."
                      required
                      className="w-full pl-9 pr-10 py-2 rounded-xl bg-[var(--soft)] border border-[var(--line)] text-xs text-[var(--ink)] placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--c1)]/20 focus:border-[var(--c1)] transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl border border-[var(--line)] text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-[var(--dark)] hover:bg-black text-[var(--bg)] text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--c1)]" />
                    <span>Saving to Backend...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--c1)]" />
                    <span>Update Credentials</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

