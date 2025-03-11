import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("should render a <nav> element as first children", async () => {
    render(
        <MemoryRouter>
            <Sidebar />
        </MemoryRouter>
    );
    const nav = await screen.findByTestId("sidebar-nav");
    expect(nav.tagName.toLowerCase()).toBe("nav");
  });
});