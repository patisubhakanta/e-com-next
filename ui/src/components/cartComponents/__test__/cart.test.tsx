import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartItems from "../Cart";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import useCheckout from "@/hooks/useCheckout";
import { formatCurrency } from "@/utils";

// Mock dependencies
jest.mock("@/context/CartContext");
jest.mock("@/hooks/useCheckout");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  formatCurrency: jest.fn((value) => `$${value.toFixed(2)}`),
}));

describe("CartItems Component", () => {
  const mockClearCart = jest.fn();
  const mockCheckout = jest.fn();
  const mockPush = jest.fn();

  const mockCart = [
    {
      product: { _id: "1", name: "Product A", price: 100, description: "Desc A", image: "imageA.jpg", productId: "p1" },
      quantity: 1,
    },
    {
      product: { _id: "2", name: "Product B", price: 50, description: "Desc B", image: "imageB.jpg", productId: "p2" },
      quantity: 2,
    },
  ];

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      cart: mockCart,
      clearCart: mockClearCart,
    });
    (useCheckout as jest.Mock).mockReturnValue({
      checkout: mockCheckout,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it("renders cart items correctly", () => {
    render(<CartItems />);

    // Check that each product is displayed with correct name
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("Product B")).toBeInTheDocument();
  });

  it("calculates and displays the correct grand total", () => {
    render(<CartItems />);
    const expectedTotal = 100 * 1 + 50 * 2; // 200

    // Verify that the calculated total is displayed
    expect(screen.getByText(`Total : ${formatCurrency(expectedTotal)}/-`)).toBeInTheDocument();
  });

  it("redirects to login if token is missing on checkout", () => {
    sessionStorage.removeItem("token");
    render(<CartItems />);

    // Simulate checkout button click
    fireEvent.click(screen.getByText(/Place Order/i));

    // Verify that router push was called with the login path
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("calls checkout function and clears cart on successful checkout", async () => {
    sessionStorage.setItem("token", "mockToken");
    (mockCheckout as jest.Mock).mockResolvedValueOnce(true); // Mock successful checkout

    render(<CartItems />);
    fireEvent.click(screen.getByText(/Place Order/i));

    // Wait for checkout action and verify
    await waitFor(() => expect(mockCheckout).toHaveBeenCalledWith(mockCart));
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/successPage");
  });

  it("displays an error alert on checkout failure", async () => {
    sessionStorage.setItem("token", "mockToken");
    (mockCheckout as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Checkout failed!" } },
    });

    window.alert = jest.fn();

    render(<CartItems />);
    fireEvent.click(screen.getByText(/Place Order/i));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("Checkout failed!"));
  });

  it("shows 'No product added' if cart is empty", () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: [],
      clearCart: mockClearCart,
    });

    render(<CartItems />);

    expect(screen.getByText("No product added")).toBeInTheDocument();
  });
});
