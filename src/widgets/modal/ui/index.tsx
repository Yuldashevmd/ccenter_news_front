import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { LangType, ModalData } from 'shared/services';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ModalData) => void;
  data?: ModalData;
  loading?: boolean;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose, onSubmit, data, loading }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

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

  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (data) setFormData(data);
    else {
      setFormData({
        date: '',
        file_link: '',
        href_name: '',
        img_url: '',
        label: { en: '', ru: '', uz: '' },
        text: { en: '', ru: '', uz: '' },
        title: { en: '', ru: '', uz: '' },
        type: '',
      });
    }
  }, [data, isOpen]);

  const handleChange = (field: keyof ModalData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultilangChange = (
    field: keyof Pick<ModalData, 'label' | 'text' | 'title'>,
    lang: LangType,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = () => {
    if (!formData.title.uz || !formData.type) {
      alert('Majburiy maydonlar to‘ldirilishi kerak!');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl leading-none"
          aria-label="Yopish"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">{data ? 'Tahrirlash' : 'Yaratish'} shakli</h2>

        {/* Inputlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Sana (date)', field: 'date' },
            { label: 'Type *', field: 'type' },
            { label: 'File link', field: 'file_link' },
            { label: 'Href name', field: 'href_name' },
            { label: 'Image URL', field: 'img_url' },
          ].map(({ label, field }) => (
            field === 'type' ? (
              <select
                key={field}
                required
                value={(formData as any)[field]}
                onChange={(e) => handleChange(field as keyof ModalData, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="news">News</option>
                <option value="promotion">Promotion</option>
              </select>
            ) : (
              <input
                key={field}
                type={field === 'date' ? 'date' : 'text'}
                required={label.includes('*')}
                placeholder={label}
                value={(formData as any)[field]}
                onChange={(e) => handleChange(field as keyof ModalData, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )
          ))}
        </div>

        {/* Multilang inputlar */}
        {(['label', 'title', 'text'] as const).map((field) => (
          <div key={field} className="mt-5">
            <label className="block text-sm font-medium capitalize mb-1">{field}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['uz', 'ru', 'en'] as LangType[]).map((lang) => (
                field === 'text' ? (
                  <textarea
                    key={lang}
                    placeholder={`${field} (${lang})`}
                    value={formData[field][lang]}
                    onChange={(e) => handleMultilangChange(field, lang, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <input
                    key={lang}
                    type="text"
                    placeholder={`${field} (${lang})`}
                    value={formData[field][lang]}
                    onChange={(e) => handleMultilangChange(field, lang, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )
              ))}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
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
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700',
            )}
          >
            {loading ? 'Saqlanmoqda...' : data ? 'Yangilash' : 'Yaratish'}
          </button>
        </div>
      </div>
    </div>
  );
};
