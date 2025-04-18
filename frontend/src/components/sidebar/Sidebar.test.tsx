import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";

export const html = (
  <MemoryRouter>
    <Sidebar />
  </MemoryRouter>
);

describe("Sidebar", () => {
  it("should render a <nav> element as children", async () => {
    render(html);
    const nav = await screen.findByTestId("sidebar-nav");
    expect(nav.tagName.toLowerCase()).toBe("nav");
  });

  it("should have 8 link components", async () => {
    render(html);
    const nav = await screen.findByTestId("sidebar-nav");
    const links = nav.querySelectorAll('a');

    expect(links.length).toBe(8);

    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });
});
