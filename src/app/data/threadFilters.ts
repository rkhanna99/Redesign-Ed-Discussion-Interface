export interface CategorizedItem {
  category: string;
}

const communityCategoryAliases: Record<string, string> = {
  "OMSCS Life": "Class Life",
};

export function matchesDiscussionCategory<T extends CategorizedItem>(item: T, category: string | null) {
  if (!category) return true;
  return item.category === category;
}

export function matchesCommunityCategory<T extends CategorizedItem>(item: T, category: string | null) {
  if (!category) return true;
  return item.category === (communityCategoryAliases[category] || category);
}

export function filterByDiscussionCategory<T extends CategorizedItem>(items: T[], category: string | null) {
  return items.filter((item) => matchesDiscussionCategory(item, category));
}

export function filterByCommunityCategory<T extends CategorizedItem>(items: T[], category: string | null) {
  return items.filter((item) => matchesCommunityCategory(item, category));
}
