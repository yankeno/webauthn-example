import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";

export default function Home() {
  // 認証は済んでいる前提
  const register = async () => {
    try {
      const options = await fetch(
        "api/auth/generate-registration-options",
      ).then((res) => res.json());
      const credential = await startRegistration(options);

      const verificationRes = await fetch("/api/auth/verify-registration", {
        method: "POST",
        body: JSON.stringify(credential),
        headers: { "Content-Type": "application/json" },
      });

      const { success } = await verificationRes.json();
      alert(success ? "パスキー登録成功" : "パスキー登録失敗");
    } catch (error) {
      alert("パスキーの登録に失敗しました。");
      console.error(error);
    }
  };

  const login = async () => {
    try {
      const options = await fetch(
        "/api/auth/generate-authentication-options",
      ).then((res) => res.json());
      const credential = await startAuthentication(options);

      const verificationRes = await fetch("/api/auth/verify-authentication", {
        method: "POST",
        body: JSON.stringify(credential),
        headers: { "Content-Type": "application/json" },
      });

      const { success } = await verificationRes.json();
      alert(success ? "パスキー認証成功" : "パスキー認証失敗");
    } catch (error) {
      alert("ログインに失敗しました。");
      console.error(error);
    }
  };

  return (
    <div className="p-5">
      <button
        onClick={register}
        type="button"
        className="m-2 px-2 py-1 bg-stone-300 rounded shadow"
      >
        パスキー登録
      </button>
      <button
        onClick={login}
        type="button"
        className="m-2 px-2 py-1 bg-stone-300 rounded shadow"
      >
        パスキー認証
      </button>
    </div>
  );
}
