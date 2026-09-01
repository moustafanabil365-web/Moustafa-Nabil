import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Plus, Trash2, ThumbsUp, Send, X, 
  Sparkles, Calendar, User, Share2, RefreshCw, Check, Clock, ShieldCheck
} from 'lucide-react';
import { GeneratedPlan, CollaboratorComment } from '../types';

interface CollaboratorNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: GeneratedPlan;
  onUpdatePlan?: (updated: GeneratedPlan) => void;
  selectedDay?: number;
  selectedActivityKey?: string;
  selectedActivityTitle?: string;
}

const AVATAR_OPTIONS = ['🧭', '✈️', '🌍', '📸', '🎒', '🏖️', '⛰️', '☕', '🎨', '🚀'];
const USER_NAME_KEY = 'smarttravel_collaborator_nickname_v1';
const USER_AVATAR_KEY = 'smarttravel_collaborator_avatar_v1';
const USER_ID_KEY = 'smarttravel_user_uuid_v1';

export const CollaboratorNotesDrawer: React.FC<CollaboratorNotesDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
  selectedDay,
  selectedActivityKey,
  selectedActivityTitle,
}) => {
  // User identity state
  const [authorName, setAuthorName] = useState<string>(() => {
    return localStorage.getItem(USER_NAME_KEY) || 'رحالة مميز';
  });
  const [authorAvatar, setAuthorAvatar] = useState<string>(() => {
    return localStorage.getItem(USER_AVATAR_KEY) || '🧭';
  });
  const [userId] = useState<string>(() => {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  });

  // Comments state
  const [comments, setComments] = useState<CollaboratorComment[]>(
    plan.collaboratorComments || []
  );
  const [newText, setNewText] = useState('');
  const [targetDay, setTargetDay] = useState<number | ''>(selectedDay || '');
  const [targetActivity, setTargetActivity] = useState<string>(selectedActivityTitle || '');
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync with plan props
  useEffect(() => {
    if (plan.collaboratorComments) {
      setComments(plan.collaboratorComments);
    }
  }, [plan.collaboratorComments]);

  // Set initial selected values when opened with specific day/activity
  useEffect(() => {
    if (selectedDay) {
      setTargetDay(selectedDay);
    }
    if (selectedActivityTitle) {
      setTargetActivity(selectedActivityTitle);
    }
  }, [selectedDay, selectedActivityTitle]);

  // Fetch latest comments from server
  const fetchComments = async () => {
    const shareId = plan.shareId || plan.id;
    if (!shareId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/shared-trips/${shareId}/comments`);
      if (res.ok) {
        const data = await res.json();
        if (data.comments && Array.isArray(data.comments)) {
          setComments(data.comments);
          if (onUpdatePlan) {
            onUpdatePlan({
              ...plan,
              collaboratorComments: data.comments,
            });
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch collaborator comments from server, using local store:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, plan.shareId, plan.id]);

  if (!isOpen) return null;

  // Handle Author Name/Avatar save
  const handleUpdateName = (val: string) => {
    setAuthorName(val);
    localStorage.setItem(USER_NAME_KEY, val);
  };

  const handleUpdateAvatar = (val: string) => {
    setAuthorAvatar(val);
    localStorage.setItem(USER_AVATAR_KEY, val);
  };

  // Add Comment / Note
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    setIsSubmitting(true);
    const shareId = plan.shareId || plan.id || 'local-trip';

    const payload = {
      authorName: authorName.trim() || 'رفيق سفر',
      authorAvatar,
      text: newText.trim(),
      dayNumber: targetDay !== '' ? Number(targetDay) : undefined,
      activityKey: selectedActivityKey || undefined,
      activityTitle: targetActivity.trim() || undefined,
    };

    try {
      const res = await fetch(`/api/shared-trips/${shareId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = [data.comment, ...comments];
        setComments(updated);
        if (onUpdatePlan) {
          onUpdatePlan({
            ...plan,
            collaboratorComments: updated,
          });
        }
      } else {
        // Fallback local addition
        const localComment: CollaboratorComment = {
          id: `cmt-${Date.now()}`,
          shareId,
          ...payload,
          voteScore: 0,
          votedUserIds: [],
          createdAt: new Date().toISOString(),
        };
        const updated = [localComment, ...comments];
        setComments(updated);
        if (onUpdatePlan) {
          onUpdatePlan({
            ...plan,
            collaboratorComments: updated,
          });
        }
      }

      setNewText('');
      setTargetActivity('');
    } catch (err) {
      console.error('Error adding comment:', err);
      // Local fallback
      const localComment: CollaboratorComment = {
        id: `cmt-${Date.now()}`,
        shareId,
        ...payload,
        voteScore: 0,
        votedUserIds: [],
        createdAt: new Date().toISOString(),
      };
      const updated = [localComment, ...comments];
      setComments(updated);
      if (onUpdatePlan) {
        onUpdatePlan({
          ...plan,
          collaboratorComments: updated,
        });
      }
      setNewText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Upvote on comment
  const handleVote = async (commentId: string) => {
    const shareId = plan.shareId || plan.id;
    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const hasVoted = c.votedUserIds?.includes(userId);
          const newVoters = hasVoted
            ? (c.votedUserIds || []).filter((u) => u !== userId)
            : [...(c.votedUserIds || []), userId];
          const newScore = hasVoted ? Math.max(0, (c.voteScore || 0) - 1) : (c.voteScore || 0) + 1;
          return { ...c, voteScore: newScore, votedUserIds: newVoters };
        }
        return c;
      })
    );

    if (shareId) {
      try {
        await fetch(`/api/shared-trips/${shareId}/comments/${commentId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
      } catch (e) {
        console.warn('Vote sync error:', e);
      }
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    const shareId = plan.shareId || plan.id;
    const updated = comments.filter((c) => c.id !== commentId);
    setComments(updated);
    if (onUpdatePlan) {
      onUpdatePlan({ ...plan, collaboratorComments: updated });
    }

    if (shareId) {
      try {
        await fetch(`/api/shared-trips/${shareId}/comments/${commentId}`, {
          method: 'DELETE',
        });
      } catch (e) {
        console.warn('Delete comment error:', e);
      }
    }
  };

  // Share collaborator link
  const handleCopyCollaboratorLink = async () => {
    const shareUrl = `${window.location.origin}?shared=${plan.shareId || plan.id}&collab=true`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  // Filtered comments list
  const filteredComments = comments.filter((c) => {
    if (filterDay === 'all') return true;
    return c.dayNumber === filterDay;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-[#111111] border-r border-[#d4af37]/30 h-full flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">ملاحظات ونقاشات رفقاء السفر</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                  تخطيط جماعي
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                أضف اقتراحات وملاحظات وتصويتات على أنشطة {plan.destination} مع فريق الرحلة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchComments}
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="تحديث التعليقات"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#d4af37]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Identity Pill Bar & Invite Friends Button */}
        <div className="p-4 bg-[#141414] border-b border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between gap-2">
            {/* User Nickname & Emoji Picker */}
            <div className="flex items-center gap-2 bg-[#1c1c1c] px-3 py-1.5 rounded-xl border border-neutral-700 flex-1">
              <select
                value={authorAvatar}
                onChange={(e) => handleUpdateAvatar(e.target.value)}
                className="bg-transparent text-base cursor-pointer focus:outline-none"
              >
                {AVATAR_OPTIONS.map((emoji) => (
                  <option key={emoji} value={emoji} className="bg-neutral-900 text-white">
                    {emoji}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={authorName}
                onChange={(e) => handleUpdateName(e.target.value)}
                placeholder="اسمك المستعار..."
                className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full font-medium"
              />
            </div>

            {/* Quick Share to Invite Buddies */}
            <button
              onClick={handleCopyCollaboratorLink}
              className="px-3.5 py-2 rounded-xl bg-[#222222] hover:bg-[#2a2a2a] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors flex-shrink-0"
              title="نسخ رابط دعوة الرفقاء"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم النسخ!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>دعوة رفاق الرحلة</span>
                </>
              )}
            </button>
          </div>

          {/* Filter Pills (All Days or Specific Day) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-neutral-400 flex-shrink-0 ml-1">تصفية:</span>
            <button
              onClick={() => setFilterDay('all')}
              className={`px-3 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer flex-shrink-0 ${
                filterDay === 'all'
                  ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              كافة الملاحظات ({comments.length})
            </button>
            {Array.from({ length: plan.durationDays }, (_, i) => i + 1).map((d) => {
              const count = comments.filter((c) => c.dayNumber === d).length;
              return (
                <button
                  key={d}
                  onClick={() => setFilterDay(d)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer flex-shrink-0 ${
                    filterDay === d
                      ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  اليوم {d} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comments Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredComments.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-neutral-500 space-y-2 border border-dashed border-neutral-800 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-neutral-600 mb-1" />
              <p className="text-sm font-bold text-neutral-400">لا توجد ملاحظات أو اقتراحات بعد</p>
              <p className="text-xs text-neutral-500 max-w-xs">
                كن أول من يضيف ملاحظة أو فكرة نشاط أو اقتراح مطعم ليراها باقي رفقاء الرحلة!
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => {
              const hasVoted = comment.votedUserIds?.includes(userId);
              return (
                <div
                  key={comment.id}
                  className="bg-[#181818] border border-neutral-800/90 rounded-xl p-3.5 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  {/* Author & Day Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{comment.authorAvatar || '🧭'}</span>
                      <span className="text-xs font-bold text-white">{comment.authorName}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(comment.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.dayNumber && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-[#d4af37] border border-neutral-700">
                          🗓️ اليوم {comment.dayNumber}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="حذف الملاحظة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Activity Title if attached */}
                  {comment.activityTitle && (
                    <div className="text-[11px] text-amber-300 font-medium bg-[#222222] px-2.5 py-1 rounded-lg border border-neutral-700/50 inline-block">
                      📌 بخصوص: {comment.activityTitle}
                    </div>
                  )}

                  {/* Text */}
                  <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap">
                    {comment.text}
                  </p>

                  {/* Vote / Reactions Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
                    <button
                      onClick={() => handleVote(comment.id)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        hasVoted
                          ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/50 font-bold'
                          : 'bg-[#202020] text-neutral-400 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.voteScore || 0} موافقون</span>
                    </button>

                    <span className="text-[10px] text-neutral-500">
                      {comment.votedUserIds?.length ? `${comment.votedUserIds.length} تفاعل` : 'لا تفاعلات بعد'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form at Bottom */}
        <form onSubmit={handleAddComment} className="p-4 bg-[#161616] border-t border-neutral-800 space-y-2.5">
          <div className="flex items-center gap-2">
            <select
              value={targetDay}
              onChange={(e) => setTargetDay(e.target.value ? Number(e.target.value) : '')}
              className="bg-[#202020] text-neutral-200 border border-neutral-700 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="">ملاحظة عامة لكامل الرحلة</option>
              {Array.from({ length: plan.durationDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  🗓️ اليوم {d}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={targetActivity}
              onChange={(e) => setTargetActivity(e.target.value)}
              placeholder="اسم النشاط أو المعلم (اختياري)..."
              className="flex-1 bg-[#202020] text-neutral-200 border border-neutral-700 text-xs rounded-xl px-3 py-2 placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center gap-2">
            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder={`أضف تعليقك أو فكرتك بصفتك "${authorName}"...`}
              className="flex-1 bg-[#202020] text-neutral-200 border border-neutral-700 text-xs rounded-xl p-2.5 placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] resize-none"
            />

            <button
              type="submit"
              disabled={isSubmitting || !newText.trim()}
              className="px-4 py-3 bg-[#d4af37] hover:bg-[#e5c158] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed self-stretch"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
