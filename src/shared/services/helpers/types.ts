export type LangType = 'en' | 'ru' | 'uz';

export interface Multilang {
  en: string;
  ru: string;
  uz: string;
}

export interface ModalData {
  date: string;
  file_link: string;
  href_name: string;
  img_url: string;
  label: Multilang;
  text: Multilang;
  title: Multilang;
  type: string;
}

export interface Todo extends ModalData {
  id: number;
}

export interface CreateTodoDto extends Omit<Todo, 'id'> {}
export interface UpdateTodoDto extends Partial<CreateTodoDto> {}

export interface UploadResponse {
  url: string;
  name?: string;
}
