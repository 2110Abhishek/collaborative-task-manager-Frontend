type Props = {
  message: string;
};

const Notification = ({ message }: Props) => (
  <div className="fixed top-6 right-6 z-50 animate-slide-in">
    <div className="flex items-center bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm font-medium">{message}</span>
    </div>
  </div>
);

export default Notification;