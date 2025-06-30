
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading course content..." }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
