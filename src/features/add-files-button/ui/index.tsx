import { FC } from 'react';
import { PlusIcon } from 'lucide-react';
import React from 'react';
import { Button } from 'shared/ui';

interface IProps {
  onChange: (files: FileList) => void;
}

export const AddFilesButton: FC<IProps> = ({ onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files);
    }
  };

  return (
    <div className="relative w-fit my-1 ml-auto">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      <Button title="Add file">
        <PlusIcon className="w-5 h-5" />
        Add file
      </Button>
    </div>
  );
};
