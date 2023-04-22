import { signIn } from "next-auth/client";

function SignInButton() {
  return <button onClick={() => signIn()}>Sign in</button>;
}

export default SignInButton;
