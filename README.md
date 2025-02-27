# パスキーのサンプル実装

## 概要

WebAuthnを使ったパスキーのサンプル実装。

## 処理概要

### パスキー登録

1. `パスキー登録`ボタン押下
2. `/generate-registration-options`へのリクエスト
3. ユーザー情報取得、`generateRegistrationOptions`実行
4. `PublicKeyCredentialCreationOptionsJSON`返却
5. `startRegistration`実行
6. 生体認証入力要求
7. 生体認証実行
8. 鍵ペア作成、`PublicKeyCredential`返却
9. `/verify-registration`へのリクエスト
10. `verifyRegistrationResponse`実行
11. `VerifiedRegistrationResponse`返却
12. 登録処理完了通知

![passkey_registration](https://github.com/user-attachments/assets/0abddf66-1c7c-47b5-a110-cad42cea1b9e)
(株)技術評論社 Software Design 2025年1月号 p44

### パスキー認証

1. `パスキー認証`ボタン押下
2. `/generate-authentication-options`へのリクエスト
3. ユーザー情報取得、`generateAuthenticationOptions`実行
4. `PublicKeyCredentialRequestOptionsJSON`返却
5. `startAuthentication`実行
6. 生体認証要求
7. 生体認証実行
8. アサーション作成、`PublicKeyCredential`返却
9. `/verify-authentication`へのリクエスト
10. `verifyAuthenticationResponse`実行
11. `VerifiedAuthenticationResponse`返却
12. 認証処理完了通知

![passkey_authentication](https://github.com/user-attachments/assets/6cf8c93d-83da-49f3-ab37-e02d4cd5b751)
(株)技術評論社 Software Design 2025年1月号 p48

### デモ

![passkey](https://github.com/user-attachments/assets/edbacfbc-02b4-42c8-b006-d20f807a714b)

## 参考

- SoftwareDesign 2025年1月号
- [SimpleWebAuthn](https://simplewebauthn.dev/docs/)
- [ライブラリ (SimpleWebAuthn) を使用した WebAuthn の RP 実装の勘所](https://zenn.dev/kg0r0/articles/c271abb1ab2b76)
