import { PlusIcon } from 'lucide-react';
import { FC } from 'react';
import { Todo } from 'shared/services';

interface IProps {
  open: () => void;
  setEditedData: React.Dispatch<React.SetStateAction<undefined | Todo>>;
}
export const AddNewsButton: FC<IProps> = (props) => {
  const { open, setEditedData } = props;
  return (
    <button
      onClick={() => {
        open();
        setEditedData(undefined);
      }}
      title="Add news"
      className="w-fit flex items-center gap-2 ml-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none"
    >
      <PlusIcon className="w-5 h-5" />
      Add News
    </button>
  );
};
