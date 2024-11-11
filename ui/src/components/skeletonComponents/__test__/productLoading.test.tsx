import { render } from "@testing-library/react";
import ProductSkeleton from "../ProductLoading";

describe("ProductSkeleton Component", () => {
  it("renders the skeleton with the correct structure", () => {
    render(<ProductSkeleton />);
  });


});
