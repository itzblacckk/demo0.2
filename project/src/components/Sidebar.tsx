import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Clock, ThumbsUp, PlaySquare, Users, Settings } from 'lucide-react';

const links = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Clock, label: 'History', path: '/history' },
  { icon: ThumbsUp, label: 'Liked', path: '/liked' },
  { icon: PlaySquare, label: 'Your videos', path: '/your-videos' },
  { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <nav className="p-3">
        <ul className="space-y-1">
          {links.map(({ icon: Icon, label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}