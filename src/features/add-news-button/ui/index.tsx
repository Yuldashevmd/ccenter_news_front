import { PlusIcon } from 'lucide-react';
import { FC } from 'react';
import { Todo } from 'shared/services';
import { Button } from 'shared/ui';

interface IProps {
  open: () => void;
  setEditedData: React.Dispatch<React.SetStateAction<undefined | Todo>>;
}
export const AddNewsButton: FC<IProps> = (props) => {
  const { open, setEditedData } = props;
  return (
    <Button
      onClick={() => {
        open();
        setEditedData(undefined);
      }}
      title="Add news"
    >
      <PlusIcon className="w-5 h-5" />
      Add News
    </Button>
  );
};
