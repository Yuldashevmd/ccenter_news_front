import dayjs from 'dayjs';
import { Grab, Pencil, Trash } from 'lucide-react';
import { FC, useCallback, useRef } from 'react';
import { Todo } from 'shared/services';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const columns = [
  { title: '', field: 'drag' },
  { title: '#', field: 'index' },
  { title: 'Title', field: 'title' },
  { title: 'Type', field: 'type' },
  { title: 'Date', field: 'date' },
  { title: 'Actions', field: 'actions' },
];

interface IProps {
  rows: Todo[];
  onDelete: (id: number) => void;
  loading?: boolean;
  setEditedData: React.Dispatch<React.SetStateAction<undefined | Todo>>;
  open: () => void;
  onRowDrop: (fromIndex: number, toIndex: number, id: number) => void;
}

interface DragItem {
  index: number;
  type: string;
}

const DraggableRow: FC<{
  row: Todo;
  index: number;
  moveRow: (from: number, to: number) => void;
  onDelete: (id: number) => void;
  setEditedData: React.Dispatch<React.SetStateAction<undefined | Todo>>;
  open: () => void;
}> = ({ row, index, moveRow, onDelete, setEditedData, open }) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const dragIconRef = useRef<HTMLSpanElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'row',
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    drop(item) {
      if (item.index !== index) {
        moveRow(item.index, index);
      }
    },
  });

  const [, drag] = useDrag<DragItem>({
    type: 'row',
    item: { index, type: 'row' },
  });

  drag(dragIconRef);
  drop(ref);

  const isActive = isOver && canDrop;

  return (
    <tr
      ref={ref}
      className={`transition-colors duration-200 ${
        isActive ? 'bg-blue-100' : 'hover:bg-gray-50'
      }`}
    >
      <td className="px-2 py-2 w-6">
        <span ref={dragIconRef} className="cursor-move" title="Drag">
          <Grab className="w-5 h-5 text-gray-400" />
        </span>
      </td>
      <td className="px-4 py-2">{row?.order}</td>
      <td className="px-4 py-2">{row?.title?.uz}</td>
      <td className="px-4 py-2">{row?.type}</td>
      <td className="px-4 py-2">{row?.date && dayjs(row.date).format('DD.MM.YYYY')}</td>
      <td className="px-4 py-2">
        <span className="text-blue-600 hover:underline" title="Edit">
          <Pencil
            className="inline w-5 h-5 text-orange-400"
            onClick={() => {
              open();
              setEditedData(row);
            }}
          />
        </span>
        <span className="text-red-600 hover:underline ml-2" title="Delete">
          <Trash className="inline w-5 h-5 text-red-400" onClick={() => onDelete(row.id)} />
        </span>
      </td>
    </tr>
  );
};

export const DashboardTable: FC<IProps> = ({
  rows,
  onDelete,
  loading,
  setEditedData,
  open,
  onRowDrop,
}) => {
  const sortedRows = [...rows].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

  const moveRow = useCallback(
    (fromIndex: number, toIndex: number) => {
      const from = fromIndex - 1;
      const to = toIndex - 1;
      const draggedItem = sortedRows[from];
      if (draggedItem?.id && from !== to) {
        onRowDrop(fromIndex, toIndex, draggedItem.id); // 1-based qaytadi
      }
    },
    [onRowDrop, sortedRows]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <table className="table w-full border border-gray-200">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th key={column.field} className="px-4 py-2 text-left text-gray-600 font-medium">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedRows.length === 0 && !loading && (
            <tr>
              <td colSpan={100} className="py-6 text-center">
                No data
              </td>
            </tr>
          )}
          {loading ? (
            <tr>
              <td colSpan={100} className="py-6 text-center">
                <div className="inline-block w-8 h-8 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => (
              <DraggableRow
                key={row.id}
                index={i + 1}
                row={row}
                moveRow={moveRow}
                onDelete={onDelete}
                setEditedData={setEditedData}
                open={open}
              />
            ))
          )}
        </tbody>
      </table>
    </DndProvider>
  );
};
