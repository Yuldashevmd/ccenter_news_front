import { FC, useState } from 'react';
import { Trash2, Copy, X, FileText } from 'lucide-react';

interface IProps {
  url?: string;
  onDelete?: (url: string) => void;
}

const isImage = (url: string) => {
  return /\.(jpeg|jpg|png|webp|gif|bmp|svg)$/i.test(url);
};

const isPDF = (url: string) => {
  return /\.pdf$/i.test(url);
};

export const FileCard: FC<IProps> = ({ url, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Copied to clipboard');
    }
  };

  return (
    <>
      <div
        className="border border-gray-200 rounded-xl w-[10rem] h-[10rem] p-2 flex items-center justify-center relative overflow-hidden cursor-pointer"
        onClick={() => url && setOpen(true)}
      >
        {url ? (
          isImage(url) ? (
            <img
              src={url}
              alt="preview"
              className="max-w-full max-h-full object-contain transition duration-300"
            />
          ) : isPDF(url) ? (
            <FileText className="w-10 h-10 text-red-500" />
          ) : (
            <span className="text-gray-400 text-sm text-center px-2">Unsupported file</span>
          )
        ) : (
          <span className="text-gray-400 text-sm">No File</span>
        )}

        {url && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              type="button"
              title="Copy URL"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="bg-white shadow-sm border border-gray-200 rounded p-1 hover:bg-gray-100 transition"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>

            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(url);
              }}
              className="bg-white shadow-sm border border-gray-200 rounded p-1 hover:bg-red-100 transition"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {open && url && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-w-full max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-0 right-0 text-white hover:text-gray-300 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {isImage(url) ? (
              <img
                src={url}
                alt="enlarged"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
              />
            ) : isPDF(url) ? (
              <iframe
                src={url}
                className="w-[70dvw] h-[70dvh] bg-white rounded-lg shadow-lg"
                title="PDF Viewer"
              ></iframe>
            ) : (
              <p className="text-white">File preview not supported</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
