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
