import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/header/Header";
import React from "react";


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

  it("should have 7 link components", async () => {
    render(html);
    const nav = await screen.findByTestId('burger-nav');
    const links = nav.querySelectorAll('a');
  
    expect(links.length).toBe(7);
  
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

    it("should be false initially ", () => {
      render(html);
      let burgerState = null;

      const TestHeader = () => {
        const [isBurgerOpen] = React.useState(false);
        burgerState = isBurgerOpen;
        return (
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        );
      };
  
      render(<TestHeader />);
      expect(burgerState).toBe(false);
    });


  