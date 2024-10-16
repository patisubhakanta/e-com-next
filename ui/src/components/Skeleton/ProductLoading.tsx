 const ProductSkeleton: React.FC = () => {
    return (
        <div className="max-w-full mx-auto py-4 pr-12 pl-2 animate-pulse">
            <div className="mb-4 p-4 flex items-center justify-between">
                <div className="relative">
                    {/* Skeleton for Image */}
                    <div className="w-60 h-60 bg-gray-300 rounded-lg"></div>
                    <div className="absolute -top-8 -right-1">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
                <div className="flex-1 ml-6">
                    {/* Skeleton for Title */}
                    <div className="w-48 h-6 bg-gray-300 rounded-md"></div>
                    {/* Skeleton for Description */}
                    <div className="w-64 h-4 bg-gray-200 rounded-md mt-2"></div>
                    <div className="w-64 h-4 bg-gray-200 rounded-md mt-2"></div>
                    <div className="w-40 h-4 bg-gray-200 rounded-md mt-2"></div>
                    {/* Skeleton for Price */}
                    <div className="w-24 h-6 bg-gray-300 rounded-md mt-4"></div>
                </div>
                <div className="pr-8">
                    {/* Skeleton for Button */}
                    <div className="w-24 h-8 bg-gray-300 rounded-md mt-4"></div>
                </div>
            </div>
            <hr className="h-px bg-gray-900 mb-2" />
        </div>
    );
};


export default ProductSkeleton