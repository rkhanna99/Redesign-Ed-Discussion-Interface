export interface CategorizedItem {
  category: string;
}

const communityCategoryAliases: Record<string, string> = {
  "OMSCS Life": "Class Life",
};

function normalizeCommunityCategory(category: string) {
  return communityCategoryAliases[category] || category;
}

export function matchesDiscussionCategory<T extends CategorizedItem>(item: T, category: string | null) {
  if (!category) return true;
  return item.category === category;
}

export function matchesCommunityCategory<T extends CategorizedItem>(item: T, category: string | null) {
  if (!category) return true;
  return normalizeCommunityCategory(item.category) === normalizeCommunityCategory(category);
}

export function filterByDiscussionCategory<T extends CategorizedItem>(items: T[], category: string | null) {
  return items.filter((item) => matchesDiscussionCategory(item, category));
}

export function filterByCommunityCategory<T extends CategorizedItem>(items: T[], category: string | null) {
  return items.filter((item) => matchesCommunityCategory(item, category));
}
