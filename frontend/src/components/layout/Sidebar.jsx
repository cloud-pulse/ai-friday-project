import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderPlus,
  FileCheck,
  UserCheck,
  FileText,
  Sparkles,
  ShieldCheck,
  X,
  ChevronRight,
  Globe,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Create Batch',
    path: '/create-batch',
    icon: FolderPlus,
    badge: null,
  },
  {
    name: 'Inspection Summary',
    path: '/inspection-summary',
    icon: FileCheck,
    badge: null,
  },
  {
    name: 'Human Review',
    path: '/human-review',
    icon: UserCheck,
    badge: 'Required',
    badgeColor: 'bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]',
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: FileText,
    badge: null,
  },
  {
    name: 'AI Assistant',
    path: '/ai-assistant',
    icon: Sparkles,
    badge: 'RAG',
    badgeColor: 'bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]',
  },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#075985]/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#E0F2FE] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#E0F2FE] shrink-0">
          <Link to="/landing" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0EA5E9] to-[#10B981] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[16px] text-[#075985] tracking-tight group-hover:text-[#0EA5E9] transition-colors">
                  PharmaInspect
                </span>
                <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#64748B]">Quality Assurance v1.0</p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#075985] rounded-lg hover:bg-[#F0F9FF] lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
            Main Navigation
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-[#0EA5E9] text-white shadow-sm font-semibold'
                      : 'text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#0EA5E9]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-[#64748B] group-hover:text-[#0EA5E9]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-white/20 text-white border-transparent'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-4 h-4 text-white/80" />
                    ) : null}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
            Overview
          </div>
          <Link
            to="/landing"
            onClick={onClose}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium text-[#64748B] hover:bg-[#F0F9FF] hover:text-[#0EA5E9] transition-all group"
          >
            <Globe className="w-5 h-5 text-[#64748B] group-hover:text-[#0EA5E9]" />
            <span>Landing Page</span>
          </Link>
        </div>

        {/* Footer / System Status Card */}
        <div className="p-4 m-4 rounded-[14px] bg-[#F0F9FF] border border-[#E0F2FE] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#075985]">System Compliance</span>
            <span className="inline-flex items-center text-[11px] font-semibold text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse mr-1.5"></span>
              GMP Validated
            </span>
          </div>
          <p className="text-[11px] text-[#64748B]">
            21 CFR Part 11 Audit Trail Active
          </p>
        </div>
      </aside>
    </>
  );
}
