export const DURATION_OPTIONS = ['4 Weeks', '8 Weeks', '12 Weeks'];

const PRICE_BY_WEEKS = {
  4: 150,
  8: 200,
  12: 250,
};

export const parseDurationWeeks = (duration) => {
  const match = String(duration || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

export const getInternshipPrice = (duration) => PRICE_BY_WEEKS[parseDurationWeeks(duration)] || 0;
