'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/dialog'
import { Analysis } from '@/lib/schemas'
import { generateAnalysisEmail } from '@/app/actions/email'

interface AnalysisResultModalProps {
  analysis: Analysis | null;
}

const AnalysisResultModal = ({ analysis }: AnalysisResultModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [emailHtml, setEmailHtml] = useState<string | null>(null)

  useEffect(() => {
    if (analysis && isOpen) {
      generateAnalysisEmail(analysis).then(setEmailHtml);
    }
  }, [analysis, isOpen]);

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen)
  }

  const handleDownloadEmail = async () => {
    if (!analysis) return;
    
    const emailHtml = await generateAnalysisEmail(analysis);
    const blob = new Blob([emailHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-results.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!analysis) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          View Analysis Results
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-full w-full sm:max-w-[765px] max-h-[calc(100vh-2rem)] overflow-y-auto py-[40px] px-[32px]">
        <div className="flex justify-between items-center mb-6">
          <DialogTitle className="text-2xl">
            Analysis Results Email Preview
          </DialogTitle>
          <button
            onClick={handleDownloadEmail}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Download Email
          </button>
        </div>
        
        {/* Email Preview */}
        {emailHtml && (
          <div className="mb-6">
            <iframe
              srcDoc={emailHtml}
              className="w-full h-[500px] border border-gray-200 rounded-lg"
              title="Email Preview"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AnalysisResultModal
