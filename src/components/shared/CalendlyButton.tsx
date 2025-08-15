'use client';

import dynamic from 'next/dynamic';
import { PopupButton } from 'react-calendly';

interface CalendlyButtonProps {
  text?: string;
  className?: string;
}

const CalendlyPopupButton = ({ text = 'Schedule a Call', className = '' }: CalendlyButtonProps) => {
  return (
    <PopupButton
      url='https://calendly.com/michaeldadi-pm/30min'
      rootElement={document.body}
      text={text}
      className={`rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white transition-transform hover:scale-105 ${className}`}
    />
  );
};

export const CalendlyButton = dynamic(() => Promise.resolve(CalendlyPopupButton), {
  ssr: false,
});
