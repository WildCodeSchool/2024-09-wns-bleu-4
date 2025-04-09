import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import Header from "./Header";

export const html =
  <MockedProvider>
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  </MockedProvider>

describe("Header", () => {
  it("should not be", async () => {
    render(html)
    expect(html).not.toBeNull()
  });
});