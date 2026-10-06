export const TRADITIONS = [
  { id: 'gujarati', name: 'Gujarati', ceremony: 'Kankotri' },
  { id: 'south-indian', name: 'South Indian', ceremony: 'Muhurtham' },
  { id: 'punjabi', name: 'Punjabi', ceremony: 'Anand Karaj' },
  { id: 'marwari', name: 'Marwari', ceremony: 'Pheras' },
  { id: 'bengali', name: 'Bengali', ceremony: 'Bibaho' },
  { id: 'contemporary', name: 'Contemporary', ceremony: 'Wedding ceremony' },
] as const;

export type TraditionId = (typeof TRADITIONS)[number]['id'];

export const TIERS = [
  { id: 'silver', name: 'Silver', price: 999 },
  { id: 'gold', name: 'Gold', price: 1499 },
  { id: 'platinum', name: 'Platinum', price: 1999 },
] as const;

export type TierId = (typeof TIERS)[number]['id'];
