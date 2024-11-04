 const ProductSkeleton: React.FC = () => {
    return (
        <div className="group relative border rounded-lg animate-pulse">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none py-6 relative">
                <div className="w-60 h-60 bg-gray-300 rounded-lg"></div>
            </div>

            <div className="bg-gray-200 px-4 py-4 flex justify-between">
                <div className="flex flex-col justify-center">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
        </div>
    );
};


export default ProductSkeleton