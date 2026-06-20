const INTERNSHIP_PRICE_BY_WEEKS = {
  4: 150,
  8: 200,
  12: 250,
};

export const DURATION_OPTIONS = Object.freeze(
  Object.keys(INTERNSHIP_PRICE_BY_WEEKS).map((weeks) => `${weeks} Weeks`)
);

export const parseDurationWeeks = (duration) => {
  const match = String(duration || '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

export const getInternshipPrice = (duration) => {
  const weeks = parseDurationWeeks(duration);
  return INTERNSHIP_PRICE_BY_WEEKS[weeks] || 0;
};

export const isSupportedDuration = (duration) => getInternshipPrice(duration) > 0;
