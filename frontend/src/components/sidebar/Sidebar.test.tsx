import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

export const html =
  <MemoryRouter>
    <Sidebar />
  </MemoryRouter>

describe("Sidebar", () => {
  it("should render a <nav> element as children", async () => {
    render(html);
    const nav = await screen.findByTestId("sidebar-nav");
    expect(nav.tagName.toLowerCase()).toBe("nav");
  });
});