export type Topic = {
  difficulty_level: string | null;
  question: string;
  category: string;
  exam_type: string;
  id: string;
  topic_metadata: { task_type: string };
};
