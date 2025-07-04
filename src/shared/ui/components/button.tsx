import { FC, ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: FC<IProps> = ({ children, ...props }) => {
  return (
    <button
      type="button"
      {...props}
      className={`w-fit flex items-center gap-2 ml-auto text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 focus:outline-none ${props.className ?? ''} cursor-pointer`}
    >
      {children}
    </button>
  );
};
