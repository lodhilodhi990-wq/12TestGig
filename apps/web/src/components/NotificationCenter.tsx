'use client';
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  Coins, 
  ArrowUpRight, 
  Rocket, 
  Info, 
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, orderBy, limit, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deposit' | 'payout' | 'campaign' | 'test' | 'system';
  read: boolean;
  link?: string;
  createdAt: any;
}

export default function NotificationCenter() {
  const { user, firebaseUser } = useAuth();
  const userId = firebaseUser?.uid || user?.id;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        limit(20)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const list: NotificationItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NotificationItem));

        // Sort descending by createdAt
        list.sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });

        setNotifications(list);
        setLoading(false);
      }, (err) => {
        console.warn('Notifications listener notice:', err);
        setLoading(false);
      });

      return () => unsub();
    } catch (e) {
      console.error('Notification query catch:', e);
      setLoading(false);
    }
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), {
        read: true
      });
    } catch (e) {
      console.error('Failed to mark notification read:', e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      });
      await batch.commit();
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  const handleDeleteNotif = async (notifId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'notifications', notifId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'deposit':
        return <Coins className="w-4 h-4 text-emerald-500" />;
      case 'payout':
        return <ArrowUpRight className="w-4 h-4 text-amber-500" />;
      case 'campaign':
        return <Rocket className="w-4 h-4 text-blue-500" />;
      case 'test':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200 z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-zinc-900">Notifications Center</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-extrabold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
              {loading ? (
                <div className="p-8 text-center text-xs text-zinc-400">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 space-y-1">
                  <Bell className="w-8 h-8 mx-auto text-zinc-300 stroke-1" />
                  <p className="text-xs font-bold text-zinc-600">No Notifications Yet</p>
                  <p className="text-[11px] text-zinc-400">You'll receive alerts for deposit approvals, payouts, and daily testing updates here.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                    className={`p-3.5 transition flex items-start gap-3 cursor-pointer ${
                      notif.read ? 'bg-white hover:bg-zinc-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${notif.read ? 'font-semibold text-zinc-800' : 'font-black text-zinc-900'}`}>
                          {notif.title}
                        </p>
                        <button
                          onClick={(e) => handleDeleteNotif(notif.id, e)}
                          className="text-zinc-300 hover:text-red-500 p-1 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                        {notif.message}
                      </p>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 mt-1"
                        >
                          View Details <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
