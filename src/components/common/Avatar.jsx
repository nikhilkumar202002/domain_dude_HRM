import React from 'react';
import clsx from 'clsx';

export const Avatar = ({ name = 'User', src, size = 'md', status, className }) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-14 w-14 text-lg font-semibold',
  };

  const statusDotSizes = {
    xs: 'h-1.5 w-1.5 ring-1',
    sm: 'h-2 w-2 ring-1.5',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
    xl: 'h-3.5 w-3.5 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-300',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  return (
    <div className={clsx('relative inline-flex shrink-0 items-center justify-center', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={clsx('rounded-full object-cover ring-1 ring-slate-900/5', sizeClasses[size])}
        />
      ) : (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-medium ring-1 ring-indigo-200/50',
            sizeClasses[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full ring-white',
            statusDotSizes[size],
            statusColors[status] || statusColors.online
          )}
        />
      )}
    </div>
  );
};

export const AvatarGroup = ({ users = [], max = 3, size = 'sm', className }) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={clsx('flex items-center -space-x-2 overflow-hidden', className)}>
      {visibleUsers.map((u, i) => (
        <Avatar
          key={i}
          name={u.name || u}
          src={u.avatar || u.src}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'flex shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium ring-2 ring-white text-xs',
            size === 'xs' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
