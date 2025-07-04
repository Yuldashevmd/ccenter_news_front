import { FileCard } from 'features/file-item';

interface IProps {
  list: {
    url: string;
  }[];
  onDelete?: (url: string) => void;
}

export const List = (props: IProps) => {
  const { list, onDelete } = props;

  return (
    <section className="flex flex-wrap items-center gap-2">
      {list?.map((item) => (
        <FileCard key={item.url} url={item.url} onDelete={onDelete} />
      ))}
    </section>
  );
};
