export const WA_NUMBER = '60122180198';

export const waLink = (text?: string) =>
  `https://wa.me/${WA_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`;