function buildRegexSearch(search) {
  if (!search) return null;
  try {
    return new RegExp(search, 'i');
  } catch (e) {
    return new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
}

module.exports = { buildRegexSearch };

