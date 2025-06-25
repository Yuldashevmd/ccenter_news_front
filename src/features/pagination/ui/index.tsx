import { FC } from 'react';

interface IProps {
  total: number;
}
export const Pagination: FC<IProps> = (props) => {
  const { total = 0 } = props;
  const options = [10, 20, 50, 100, 200];

  return (
    <div className="w-full flex items-center justify-end gap-3">
      <p className="text-gray-600">Total: {total}</p>
      <p className="text-gray-600">Limit:</p>
      <select className="w-fit border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 my-2">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
