// TODO: Replace the placeholder with the actual WhatsApp number (digits only, e.g. 60123456789)
export const WA_NUMBER = '0000000000';

export const waLink = (text?: string) =>
  `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;