import { ExclamationCircleIcon } from "@heroicons/react/16/solid";

const ErrorUI = ({ message }: { message: string; }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                <ExclamationCircleIcon className="h-12 w-12 text-red-600" />
                <h2 className="mt-4 text-xl font-bold text-red-600">Oops! Something went wrong</h2>
                <p className="mt-2 text-gray-600 text-center">
                    {message || 'An unexpected error occurred. Please try again.'}
                </p>
            </div>
        </div>
    );
};

export default ErrorUI;
