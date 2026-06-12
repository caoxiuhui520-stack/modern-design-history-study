import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("renders the course title and local-mode fallback", () => {
  render(<App />);
  expect(screen.getByText("世界现代设计史")).toBeInTheDocument();
  expect(screen.getByText("本机模式")).toBeInTheDocument();
});

