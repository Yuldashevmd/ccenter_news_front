import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

type LangType = 'en' | 'ru' | 'uz';

interface Multilang {
  en: string;
  ru: string;
  uz: string;
}

interface ModalData {
  date: string;
  file_link: string;
  href_name: string;
  img_url: string;
  label: Multilang;
  text: Multilang;
  title: Multilang;
  type: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ModalData) => void;
  data?: ModalData;
  loading?: boolean;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose, onSubmit, data, loading }) => {
  const [formData, setFormData] = useState<ModalData>({
    date: '',
    file_link: '',
    href_name: '',
    img_url: '',
    label: { en: '', ru: '', uz: '' },
    text: { en: '', ru: '', uz: '' },
    title: { en: '', ru: '', uz: '' },
    type: '',
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (field: keyof ModalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultilangChange = (field: keyof Pick<ModalData, 'label' | 'text' | 'title'>, lang: LangType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.uz || !formData.type) return alert('Majburiy maydonlar to‘ldirilishi kerak!');
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">
          {data ? 'Tahrirlash' : 'Yaratish'} shakli
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Sana (date)"
            value={formData.date}
            onChange={e => handleChange('date', e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Type *"
            required
            value={formData.type}
            onChange={e => handleChange('type', e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="File link"
            value={formData.file_link}
            onChange={e => handleChange('file_link', e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Href name"
            value={formData.href_name}
            onChange={e => handleChange('href_name', e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.img_url}
            onChange={e => handleChange('img_url', e.target.value)}
            className="input"
          />
        </div>

        {['label', 'text', 'title'].map(field => (
          <div key={field}>
            <h4 className="text-sm font-medium capitalize">{field}</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['uz', 'ru', 'en'] as LangType[]).map(lang => (
                <input
                  key={lang}
                  type="text"
                  placeholder={`${field} (${lang})`}
                  value={(formData as any)[field][lang]}
                  onChange={e => handleMultilangChange(field as any, lang, e.target.value)}
                  className="input"
                />
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={classNames(
              'px-4 py-2 text-sm rounded-md text-white',
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {loading ? 'Saqlanmoqda...' : data ? 'Yangilash' : 'Yaratish'}
          </button>
        </div>
      </div>
    </div>
  );
};

