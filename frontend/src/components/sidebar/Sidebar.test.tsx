import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  test("should render a <nav> element as first children", async () => {
    render(
      // MemoryRouter is for <Link /> components inside <Sidebar />
        <MemoryRouter>
            <Sidebar />
        </MemoryRouter>
    );
    const nav = await screen.findByTestId("sidebar-nav");
    expect(nav.tagName.toLowerCase()).toBe("nav");
  });
});