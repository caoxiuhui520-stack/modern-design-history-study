import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthPanel, type AuthClient } from "./AuthPanel";

it("sends and verifies a six-digit email OTP", async () => {
  const user = userEvent.setup();
  const calls: string[] = [];
  const client: AuthClient = {
    sendOtp: async (email) => { calls.push(`send:${email}`); },
    verifyOtp: async (email, token) => { calls.push(`verify:${email}:${token}`); },
    signOut: async () => undefined,
  };
  render(<AuthPanel client={client} />);
  await user.type(screen.getByLabelText("邮箱"), "student@example.com");
  await user.click(screen.getByRole("button", { name: "发送验证码" }));
  await user.type(screen.getByLabelText("六位验证码"), "123456");
  await user.click(screen.getByRole("button", { name: "验证并登录" }));
  expect(calls).toEqual(["send:student@example.com", "verify:student@example.com:123456"]);
});

