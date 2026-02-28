export interface CreateProjectInput {
    title: string;
    description: string;
    slug: string;
    tagline?: string;
    githubUrl?: string;
    previewUrl?: string;
    skillIds?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> { }