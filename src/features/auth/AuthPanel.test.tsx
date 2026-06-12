import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthPanel, type AuthClient } from "./AuthPanel";

it("sends a passwordless email login link", async () => {
  const user = userEvent.setup();
  const calls: string[] = [];
  const client: AuthClient = {
    sendMagicLink: async (email) => { calls.push(email); },
  };

  render(<AuthPanel client={client} />);
  await user.type(screen.getByLabelText("邮箱"), "student@example.com");
  await user.click(screen.getByRole("button", { name: "发送登录链接" }));

  expect(calls).toEqual(["student@example.com"]);
  expect(screen.getByRole("status")).toHaveTextContent("登录链接已发送");
});
