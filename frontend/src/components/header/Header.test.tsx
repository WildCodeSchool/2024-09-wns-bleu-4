import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

export const html =
  <MemoryRouter>
    <Header />
  </MemoryRouter>

describe("Header", () => {
  it("should have 2 link components", async () => {
    render(html)
    const logContainer = await screen.findByTestId("log-container")
    const links = logContainer.children
    expect(links.length).toBe(2)
    expect(links[0]).toHaveProperty('href')
    expect(links[1]).toHaveProperty('href')
  });
});