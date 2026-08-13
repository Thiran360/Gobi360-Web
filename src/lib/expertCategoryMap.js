/** Maps expert category IDs to static service IDs shown alongside API experts. */
export const STATIC_EXPERTS_BY_CATEGORY = {
  1: ['skyline-builders', 'woodzone', 'monoj-steels', 'sri-jayam-glass-house'],
  2: ['thiran360ai'],
  3: ['sri-ganagathara-agency', 'sri-maha-ganapathi-electricals', 'sun-power', 'sri-sakthi-electrical'],
  6: ['sri-abirami-book-binding', 'majestic-studio'],
  8: ['saaral-motors'],
  11: ['hindi-academy'],
  12: ['sri-abirami-book-binding'],
};

/** Footer service labels → expert category IDs from /expert-categories/ */
export const FOOTER_SERVICE_CATEGORY_IDS = {
  homeMaintenance: 7,
  itSoftware: 2,
  securitySystems: 3,
  industrialWork: 1,
};

export const getCategoryLabel = (category, language, translations = {}) => {
  if (!category) return '';
  if (language === 'ta') {
    return category.category_name_ta || category.name_ta || translations[category.category_name?.trim()] || translations[category.name?.trim()] || category.category_name || category.name || '';
  }
  return category.category_name || category.name || '';
};
