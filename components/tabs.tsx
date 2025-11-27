'use client'

import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-cyan-500/20 mb-8 sticky top-16 bg-slate-950/95 backdrop-blur-md z-40 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-3 font-medium text-sm md:text-base whitespace-nowrap transition-all relative ${
                activeTab === tab.id
                  ? 'text-cyan-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        role="tabpanel"
        className="animate-fadeIn"
      >
        {activeTabContent}
      </div>

      {/* Add fadeIn animation to globals.css */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
