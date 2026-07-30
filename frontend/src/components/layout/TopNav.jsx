import React from 'react';
import { Menu, Search, Bell, Cpu, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function TopNav({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E0F2FE] px-4 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left Section: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="p-2 text-[#64748B] hover:text-[#075985] rounded-[10px] hover:bg-[#F0F9FF] lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Placeholder */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search batches, inspection records, reports..."
            className="w-full pl-10 pr-4 py-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-[10px] text-[13px] text-[#075985] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:bg-white transition-all"
            readOnly
          />
        </div>
      </div>

      {/* Right Section: Status Badges, Notifications, User Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* AI System Status Badge */}
        <div className="hidden md:flex items-center">
          <Badge variant="accent" icon={Cpu}>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse mr-0.5"></span>
            AI Engine Online
          </Badge>
        </div>

        {/* Notifications Icon Button */}
        <button
          className="relative p-2 text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] rounded-[10px] transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0EA5E9] rounded-full ring-2 ring-white"></span>
        </button>

        <div className="h-6 w-px bg-[#E0F2FE] hidden sm:block"></div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-1 sm:pl-0 cursor-pointer group">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#075985] text-white flex items-center justify-center font-semibold text-[13px] ring-2 ring-[#E0F2FE]">
              SC
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-white"></span>
          </div>

          <div className="hidden lg:block text-left">
            <div className="text-[13px] font-semibold text-[#075985] leading-tight group-hover:text-[#0EA5E9] transition-colors">
              Dr. Sarah Chen
            </div>
            <div className="text-[11px] font-medium text-[#64748B]">
              Lead QA Inspector
            </div>
          </div>

          <ChevronDown className="w-4 h-4 text-[#64748B] hidden lg:block group-hover:text-[#075985] transition-colors" />
        </div>
      </div>
    </header>
  );
}
