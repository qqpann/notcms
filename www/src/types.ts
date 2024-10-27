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
export type PostDetail = {
  content: string;
} & Post;
export type Category = {
  id: string;
  name: string;
};
export type Writer = {
  name: string;
  description: string;
  image: string;
};
