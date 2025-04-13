import { render } from '@react-email/render';
import { AnalysisEmail } from '@/components/analysisEmail';
import { Analysis } from '@/lib/schemas';
import React from 'react';

export async function generateAnalysisEmail(analysis: Analysis): Promise<string> {
  const emailHtml = render(React.createElement(AnalysisEmail, { analysis }));
  return emailHtml;
} 