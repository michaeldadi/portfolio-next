import { PopupButton } from 'react-calendly';

export const CalendlyButton = ({ text = 'Schedule a Call', className = '' }) => {
  if (typeof window === 'undefined') {
    // Prevents server-side rendering issues with Calendly
    return null;
  }

  return (
    <PopupButton
      url='https://calendly.com/michaeldadi-pm/30min'
      rootElement={document.getElementById('__next') as HTMLElement}
      text={text}
      className={`rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white transition-transform hover:scale-105 ${className}`}
    />
  );
};
