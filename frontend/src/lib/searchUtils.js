// Utility function for smart name searching
export const smartNameSearch = (name, query) => {
  if (!query) return true;
  
  const nameParts = name.toLowerCase().split(' ');
  const searchQuery = query.toLowerCase();
  
  // Check if any word in the name starts with the search query
  return nameParts.some(part => part.startsWith(searchQuery));
};