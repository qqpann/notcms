export type Post = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  writer: string;
  writerImage: string;
  date: string;
  keyVisualImage: string;
};
