import React from 'react';
import { User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon, ShieldCheck, Cloud, Loader2 } from 'lucide-react';
import { signInWithGoogle, logOut } from '../lib/firebase';

interface AuthProfileBadgeProps {
  user: User | null;
  isLoading?: boolean;
}

export const AuthProfileBadge: React.FC<AuthProfileBadgeProps> = ({ user, isLoading }) => {
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign-in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141f33] border border-[#d4af37]/30 text-xs text-[#a4bbd6]">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
        <span className="hidden sm:inline">جارٍ المزامنة...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141f33] border border-[#d4af37]/40 shadow-sm">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-6 h-6 rounded-full border border-[#d4af37]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs font-bold">
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
          )}
          <div className="hidden lg:block text-right">
            <p className="text-[11px] font-bold text-white leading-tight">
              {user.displayName || 'مسافر ملكي'}
            </p>
            <p className="text-[9px] text-[#71cf88] flex items-center gap-1 font-semibold">
              <Cloud className="w-2.5 h-2.5" />
              <span>مزامنة سحابية نشطة</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          title="تسجيل الخروج"
          className="p-2 rounded-xl bg-[#141f33] hover:bg-red-950/40 text-neutral-400 hover:text-red-300 border border-neutral-800 hover:border-red-500/40 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b2a45] to-[#141f33] hover:from-[#223659] hover:to-[#1b2a45] border border-[#d4af37]/40 text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer hover:border-[#d4af37]"
      title="تسجيل الدخول باستخدام Google لحفظ رحلاتك سحابياً"
    >
      <LogIn className="w-4 h-4 text-[#d4af37]" />
      <span className="hidden sm:inline">تسجيل الدخول (Google)</span>
      <span className="sm:hidden">دخول</span>
    </button>
  );
};
