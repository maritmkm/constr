export type ProjectCategory = 'RESIDENTIAL' | 'COMMERCIAL' | 'INTERIOR' | 'RENOVATION';

export interface Project {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  categoryLabel: string;
  location: string;
  year: number;
  status: 'Completed' | 'Under Construction' | 'In Concept';
  area: string;
  scope: string;
  client: string;
  leadArchitect: string;
  coverImage: string;
  gallery: string[];
  description: string;
  story: {
    concept: string;
    architecture: string;
    materials: string;
    execution: string;
  };
  journey: {
    stage: string;
    title: string;
    detail: string;
    image?: string;
  }[];
}
