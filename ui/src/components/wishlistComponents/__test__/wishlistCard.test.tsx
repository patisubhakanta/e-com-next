import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WishlistItemCard from "../WishlistCard";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { removeItemFromWishlistAPI } from "../../../service/wishlistService";
import { IProduct } from "@/types/Types";


// Mock the context hooks and API service
jest.mock("../../../context/CartContext", () => ({
  useCart: jest.fn(),
}));
jest.mock("../../../context/WishlistContext", () => ({
  useWishlist: jest.fn(),
}));
jest.mock("../../../service/wishlistService");

const mockProduct: IProduct = {
  _id: "1",
  name: "Test Product",
  description: "Test Description",
  price: 100,
  image: "test-image.jpg",
  productId: "p1",
  inStock:true
};

describe("WishlistItemCard Component", () => {
  const addToCart = jest.fn();
  const removeFromWishlist = jest.fn();
  const mockRemoveItemFromWishlistAPI = removeItemFromWishlistAPI as jest.Mock;

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addToCart,
    });
    (useWishlist as jest.Mock).mockReturnValue({
      removeFromWishlist,
    });
    mockRemoveItemFromWishlistAPI.mockResolvedValue({});
    jest.clearAllMocks();
  });

  it("renders WishlistItemCard with correct product information", () => {
    render(<WishlistItemCard product={mockProduct} />);

    // Check product details are displayed
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Test Product" })).toHaveAttribute("src", "test-image.jpg");
  });

  it("calls removeFromWishlist and removeItemFromWishlistAPI when remove button is clicked", async () => {
    render(<WishlistItemCard product={mockProduct} />);

    // Click the trash icon to remove item from wishlist
    fireEvent.click(screen.getAllByRole("button")[0]);

    // Wait for API call and function to be triggered
    await waitFor(() => {
      expect(mockRemoveItemFromWishlistAPI).toHaveBeenCalledWith("1");
      expect(removeFromWishlist).toHaveBeenCalledWith("1");
    });
  });

  it("calls addToCart, removeFromWishlist, and removeItemFromWishlistAPI when add to cart button is clicked", async () => {
    render(<WishlistItemCard product={mockProduct} />);

    // Click the "Add to cart" button
    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    // Wait for the add to cart action and wishlist removal
    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith(mockProduct, 1);
      expect(mockRemoveItemFromWishlistAPI).toHaveBeenCalledWith("1");
      expect(removeFromWishlist).toHaveBeenCalledWith("1");
    });
  });
});
