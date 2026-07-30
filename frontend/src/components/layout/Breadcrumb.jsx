import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  '': 'Dashboard',
  'create-batch': 'Create Batch',
  'inspection-summary': 'Inspection Summary',
  'human-review': 'Human Review',
  'reports': 'Reports',
  'ai-assistant': 'AI Quality Assistant',
};

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-[13px] text-[#64748B] mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-[#64748B] hover:text-[#0EA5E9] font-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Overview</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const name = routeNameMap[value] || value.replace(/-/g, ' ');

          return (
            <li key={to} className="inline-flex items-center">
              <ChevronRight className="w-4 h-4 text-[#94A3B8] mx-1" />
              {isLast ? (
                <span className="font-semibold text-[#075985] capitalize">{name}</span>
              ) : (
                <Link
                  to={to}
                  className="font-medium text-[#64748B] hover:text-[#0EA5E9] transition-colors capitalize"
                >
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
