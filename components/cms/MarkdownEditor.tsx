'use client';
import React, { useState, useRef } from 'react';
import { 
  Bold, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Quote, 
  Table, 
  Eye, 
  Edit3, 
  Heading1, 
  Heading2, 
  FileText, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Compose rich publication text using Markdown...",
  rows = 10,
  label
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown tags at selection
  const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Word and character counters
  const charCount = value.length;
  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;

  // Simple Markdown Parser matching public website format
  const renderPreview = (text: string) => {
    if (!text.trim()) {
      return <p className="text-slate-400 italic text-xs">Nothing to preview yet. Start writing in the 'Write' tab.</p>;
    }

    const paragraphs = text.split('\n\n');
    return (
      <div className="space-y-4 text-slate-800 text-sm leading-relaxed max-w-none">
        {paragraphs.map((para, i) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          // Headers
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={i} className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-1 mt-4 mb-2 uppercase tracking-wide">
                {trimmed.substring(3)}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={i} className="text-sm font-bold text-slate-800 font-mono mt-3 mb-1 uppercase tracking-wider">
                {trimmed.substring(4)}
              </h3>
            );
          }

          // Lists
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <ul key={i} className="list-disc pl-5 space-y-1 my-2">
                {trimmed.split('\n').map((li, idx) => (
                  <li key={idx} className="text-slate-700">
                    {li.replace(/^[\s-*]+/, '')}
                  </li>
                ))}
              </ul>
            );
          }

          // Numbered Lists
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <ol key={i} className="list-decimal pl-5 space-y-1 my-2">
                {trimmed.split('\n').map((li, idx) => (
                  <li key={idx} className="text-slate-700">
                    {li.replace(/^\d+\.\s*/, '')}
                  </li>
                ))}
              </ol>
            );
          }

          // Blockquotes
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={i} className="border-l-4 border-slate-300 pl-4 py-1 my-2 text-slate-500 italic bg-slate-50 rounded-r-lg text-xs">
                {trimmed.split('\n').map(line => line.replace(/^>\s*/, '')).join('\n')}
              </blockquote>
            );
          }

          // Simple Bold Formatting (**text**)
          const parts = trimmed.split('**');
          if (parts.length > 1) {
            return (
              <p key={i} className="text-slate-700">
                {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="font-semibold text-slate-950">{part}</strong> : part)}
              </p>
            );
          }

          return <p key={i} className="text-slate-700">{trimmed}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-slate-500 block font-bold uppercase tracking-wider text-[10px]">{label}</label>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center"><FileText className="w-3 h-3 mr-1" /> {wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>
      )}

      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition duration-150">
        {/* Editor Tabs and Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 select-none">
          {/* Write / Preview Buttons */}
          <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
                activeTab === 'write' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
                activeTab === 'preview' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Formatting Helpers (Only in Write Mode) */}
          {activeTab === 'write' && (
            <div className="flex items-center space-x-0.5 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => insertMarkdown('## ', '', 'Section Heading')}
                title="Heading 2 (##)"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('### ', '', 'Sub-heading')}
                title="Heading 3 (###)"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**', 'bold text')}
                title="Bold"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ', '', 'List item')}
                title="Bullet List"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('1. ', '', 'Numbered item')}
                title="Numbered List"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => insertMarkdown('> ', '', 'Quote')}
                title="Blockquote"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](url)', 'link text')}
                title="Hyperlink"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Item 1   | Item 2   |\n')}
                title="Table"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-650 rounded-md transition hover:shadow-xs"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset editor content?")) onChange('');
                }}
                title="Clear Text"
                className="p-1.5 hover:bg-white hover:text-red-500 hover:bg-red-50 text-slate-500 rounded-md transition hover:shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Tips badge in preview mode */}
          {activeTab === 'preview' && (
            <span className="inline-flex items-center space-x-1 py-0.5 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-lg font-mono text-[9px] uppercase tracking-wider animate-pulse">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Live Render</span>
            </span>
          )}
        </div>

        {/* Editor Body */}
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border-0 p-4 text-xs font-sans text-slate-800 bg-white focus:outline-none focus:ring-0 resize-y leading-relaxed"
          />
        ) : (
          <div 
            className="w-full p-4 overflow-y-auto bg-slate-50 font-sans border-0 select-text prose prose-sm max-w-none prose-slate"
            style={{ minHeight: `${rows * 20 + 32}px` }}
          >
            {renderPreview(value)}
          </div>
        )}
      </div>
    </div>
  );
}
