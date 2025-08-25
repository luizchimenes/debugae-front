import { DuplicatedBug } from "../components/organism/DuplicatedBugModal";

export type DuplicatedBugReduced = Pick<DuplicatedBug, "id" | "projectId" | "summary" | "description" | "status">;

function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  const len1 = s1.length;
  const len2 = s2.length;
  
  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;
  
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     
        matrix[i][j - 1] + 1,     
        matrix[i - 1][j - 1] + cost 
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  
  return 1 - distance / maxLength;
}

function hasCommonKeywords(str1: string, str2: string): boolean {
  if (!str1 || !str2) return false;
  
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'sobre', 'sob',
    'e', 'ou', 'mas', 'que', 'se', 'quando', 'onde', 'como', 'por', 'porque',
    'não', 'sim', 'muito', 'mais', 'menos', 'todo', 'toda', 'todos', 'todas',
    'esse', 'essa', 'esses', 'essas', 'este', 'esta', 'estes', 'estas',
    'aquele', 'aquela', 'aqueles', 'aquelas', 'seu', 'sua', 'seus', 'suas',
    'meu', 'minha', 'meus', 'minhas', 'nosso', 'nossa', 'nossos', 'nossas'
  ]);
  
  const getKeywords = (text: string): Set<string> => {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
    );
  };
  
  const keywords1 = getKeywords(str1);
  const keywords2 = getKeywords(str2);
  
  for (const keyword of keywords1) {
    if (keywords2.has(keyword)) {
      return true;
    }
  }
  
  return false;
}

export function findSimilarBugs(
  currentSummary: string,
  currentDescription: string,
  currentProjectId: string,
  existingBugs: DuplicatedBug[],
  similarityThreshold: number = 0.6
): DuplicatedBug[] {
  if (!currentSummary?.trim() && !currentDescription?.trim()) {
    return [];
  }
  
  return existingBugs.filter(bug => {
    if (bug.projectId === currentProjectId && 
        (bug.status === 'RESOLVIDO' || bug.status === 'FECHADO')) {
      return false;
    }
    
    const summarySimilarity = calculateSimilarity(currentSummary, bug.summary);
    
    const descriptionSimilarity = calculateSimilarity(currentDescription, bug.description);
    
    const hasCommonSummaryKeywords = hasCommonKeywords(currentSummary, bug.summary);
    const hasCommonDescriptionKeywords = hasCommonKeywords(currentDescription, bug.description);
    
    const isSimilar = 
      summarySimilarity >= similarityThreshold ||
      descriptionSimilarity >= similarityThreshold ||
      (hasCommonSummaryKeywords && hasCommonDescriptionKeywords);
    
    return isSimilar;
  });
}

export function findDuplicateBugs(
  currentSummary: string,
  currentDescription: string,
  currentProjectId: string,
  existingBugs: DuplicatedBug[],
  duplicateThreshold: number = 0.85
): DuplicatedBug[] {
  return findSimilarBugs(
    currentSummary,
    currentDescription,
    currentProjectId,
    existingBugs,
    duplicateThreshold
  );
}