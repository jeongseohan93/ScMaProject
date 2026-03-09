import RegisterForm from "./RegisterForm";
import TermsNotice from "./TermsNotice";

export default function RegisterPanel() {
  return (
    <div className="w-full max-w-md px-6">
      <h1 className="mb-2 text-lg font-medium text-white/85">회원가입</h1>
      <p className="mb-6 text-sm text-white/45">
        기본 정보와 프로필을 입력해주세요.
      </p>

      <div className="space-y-5">
        <RegisterForm />
        <TermsNotice />
      </div>

      <div className="mt-10 text-center text-xs text-white/30">© Meta</div>
    </div>
  );
}
