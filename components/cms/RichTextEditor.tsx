'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  FileText, 
  Sparkles,
  RotateCcw,
  Code,
  Eye,
  Minus,
  Trash2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start composing your rich clinical publication...",
  rows = 10,
  label
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'html'>('visual');
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlValue, setHtmlValue] = useState(value || '');

  // Keep internal HTML value synchronized with incoming prop value
  useEffect(() => {
    if (value !== htmlValue) {
      setHtmlValue(value || '');
      if (editorRef.current && activeTab === 'visual') {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Synchronize visual content back to parent
  const handleVisualInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      setHtmlValue(currentHtml);
      onChange(currentHtml);
    }
  };

  // Synchronize HTML textarea changes
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlValue(newHtml);
    onChange(newHtml);
  };

  // Run document commands
  const execCmd = (command: string, value: string = '') => {
    if (typeof window !== 'undefined') {
      document.execCommand(command, false, value);
      handleVisualInput();
    }
  };

  // Insert Link helper
  const insertLink = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://example.com):");
    if (url) {
      execCmd("createLink", url);
    }
  };

  // Convert HTML to simple text for character/word count
  const stripHtml = (htmlStr: string) => {
    const tmp = typeof document !== 'undefined' ? document.createElement("DIV") : null;
    if (tmp) {
      tmp.innerHTML = htmlStr;
      return tmp.textContent || tmp.innerText || "";
    }
    return htmlStr.replace(/<[^>]*>/g, "");
  };

  const textContent = stripHtml(htmlValue);
  const charCount = textContent.length;
  const wordCount = textContent.trim() === '' ? 0 : textContent.trim().split(/\s+/).length;

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
        {/* Editor Tabs & Controls Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 select-none">
          {/* Visual / HTML Switch */}
          <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('visual');
                // Ensure DIV is populated when switching back
                setTimeout(() => {
                  if (editorRef.current) {
                    editorRef.current.innerHTML = htmlValue;
                  }
                }, 50);
              }}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
                activeTab === 'visual' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 transition ${
                activeTab === 'html' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
          </div>

          {/* Editor commands (Only in Visual Mode) */}
          {activeTab === 'visual' && (
            <div className="flex items-center space-x-0.5 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => execCmd('formatBlock', '<h2>')}
                title="Heading 2 (H2)"
                className="p-1.5 hover:bg-white text-slate-650 hover:text-indigo-600 rounded-md transition hover:shadow-xs font-bold text-xs"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => execCmd('formatBlock', '<h3>')}
                title="Heading 3 (H3)"
                className="p-1.5 hover:bg-white text-slate-650 hover:text-indigo-600 rounded-md transition hover:shadow-xs font-bold text-xs"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => execCmd('formatBlock', '<p>')}
                title="Paragraph"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs text-[10px] font-extrabold px-2"
              >
                P
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => execCmd('bold')}
                title="Bold"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => execCmd('italic')}
                title="Italic"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => execCmd('underline')}
                title="Underline"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => execCmd('insertUnorderedList')}
                title="Bullet List"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => execCmd('insertOrderedList')}
                title="Numbered List"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={insertLink}
                title="Insert Link"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => execCmd('insertHorizontalRule')}
                title="Insert Divider"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                type="button"
                onClick={() => execCmd('removeFormat')}
                title="Clear Formatting"
                className="p-1.5 hover:bg-white text-slate-600 hover:text-indigo-600 rounded-md transition hover:shadow-xs text-[10px] font-bold px-1.5"
              >
                Tx
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear all text?")) {
                    setHtmlValue('');
                    if (editorRef.current) editorRef.current.innerHTML = '';
                    onChange('');
                  }
                }}
                title="Clear All"
                className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-md transition hover:shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active status indicator */}
          <span className="inline-flex items-center space-x-1 py-0.5 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-lg font-mono text-[9px] uppercase tracking-wider animate-pulse">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{activeTab === 'visual' ? 'Rich WYSIWYG' : 'HTML Editor'}</span>
          </span>
        </div>

        {/* Editor Edit Field */}
        <div className="bg-white">
          {activeTab === 'visual' ? (
            <>
              <style dangerouslySetInnerHTML={{ __html: `
                .wysiwyg-editor:empty::before {
                  content: attr(data-placeholder);
                  color: #94a3b8;
                  font-style: italic;
                  position: absolute;
                  pointer-events: none;
                }
              `}} />
              <div
                ref={editorRef}
                contentEditable
                onInput={handleVisualInput}
                onBlur={handleVisualInput}
                data-placeholder={placeholder}
                className="wysiwyg-editor w-full p-4 text-base font-sans text-slate-900 focus:outline-none resize-y overflow-y-auto leading-relaxed min-h-[250px] border-0 prose prose-sm max-w-none focus:ring-0 relative"
                style={{ minHeight: `${rows * 20 + 30}px` }}
                dangerouslySetInnerHTML={{ __html: value || '' }}
              />
            </>
          ) : (
            <textarea
              rows={rows}
              value={htmlValue}
              onChange={handleHtmlChange}
              placeholder="<p>Start writing raw HTML content...</p>"
              className="w-full border-0 p-4 text-sm font-mono text-slate-800 bg-slate-50 focus:outline-none focus:ring-0 resize-y leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
}
