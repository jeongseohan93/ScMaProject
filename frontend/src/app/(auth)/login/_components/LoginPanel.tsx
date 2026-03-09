import LoginForm from "./LoginForm";
import SocialLogin from "./SocialLogin";
import Divider from "./Divider";
import AuthFooter from "./AuthFooter";

export default function LoginPanel() {
  return (
    <div className="w-full max-w-md px-6">
      <h1 className="mb-6 text-lg font-medium text-white/80">
        Instagram으로 로그인
      </h1>

      <div className="space-y-5">
        <LoginForm />

        <div className="text-center text-sm text-white/50">
          비밀번호를 잊으셨나요?
        </div>

        <Divider />

        <SocialLogin />
      </div>

      <AuthFooter />
    </div>
  );
}