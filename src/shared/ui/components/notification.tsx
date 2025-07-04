interface IProps {
  message: string | null;
}
export const Notification = (props: IProps) => {
  const { message } = props;

  return (
    <>
      {message &&
        (message.includes('successfully') ? (
          <p className="fixed bottom-4 right-5 text-green-600 bg-green-100 border border-green-400 rounded-md px-4 py-2">
            {message}
          </p>
        ) : (
          <p className="fixed bottom-4 right-5 text-red-600 bg-red-100 border border-red-400 rounded-md px-4 py-2">
            {message}
          </p>
        ))}
    </>
  );
};
