import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { useCart } from "../../../context/CartContext";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("../../../context/CartContext");
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />, // Mock Next.js Image component
}));

describe("Header Component", () => {
    const mockPush = jest.fn();
    const mockCart = [
        { product: { _id: "1", name: "Product A", price: 100 }, quantity: 1 },
        { product: { _id: "2", name: "Product B", price: 50 }, quantity: 2 },
    ];

    beforeEach(() => {
        (useCart as jest.Mock).mockReturnValue({
            cart: mockCart,
        });
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        // Mock sessionStorage for login/logout testing
        sessionStorage.clear();
        jest.clearAllMocks();
    });

    it("renders Header component with logo, cart, user icon, and logout button when logged in", () => {
        // Set a token to simulate logged-in state
        sessionStorage.setItem("token", "sample_token");

        render(<Header />);

        // Check for logo
        const logo = screen.getByAltText("Logo");
        expect(logo).toBeInTheDocument();

        // Check for cart icon with item count
        const cartIcon = screen.getByRole("button", { name: /shopping cart/i });
        expect(cartIcon).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument(); // Expecting 2 items

        // Check for user and logout icons
        expect(screen.getByRole("button", { name: /user/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /power/i })).toBeInTheDocument();
    });

    it("navigates to the cart page when cart icon is clicked", () => {
        render(<Header />);

        // Simulate cart button click
        fireEvent.click(screen.getByRole("button", { name: /shopping cart/i }));
        expect(mockPush).toHaveBeenCalledWith("/cart");
    });

    it("navigates to the profile page when user icon is clicked and logged in", () => {
        sessionStorage.setItem("token", "sample_token");

        render(<Header />);

        // Simulate user icon click
        fireEvent.click(screen.getByRole("button", { name: /user/i }));
        expect(mockPush).toHaveBeenCalledWith("/profile");
    });

    it("navigates to signin page when user icon is clicked and not logged in", () => {
        render(<Header />);

        // Simulate user icon click
        fireEvent.click(screen.getByRole("button", { name: /user/i }));
        expect(mockPush).toHaveBeenCalledWith("/auth/signin");
    });

    it("logs out and navigates to home page when logout button is clicked", () => {
        sessionStorage.setItem("token", "sample_token");

        render(<Header />);

        // Simulate logout button click
        fireEvent.click(screen.getByRole("button", { name: /power/i }));
        expect(sessionStorage.getItem("token")).toBe(null);
        expect(localStorage.length).toBe(0);
        expect(mockPush).toHaveBeenCalledWith("/");
    });

    it("hides logout button when not logged in", () => {
        render(<Header />);
        expect(screen.queryByRole("button", { name: /power/i })).not.toBeInTheDocument();
    });
});
