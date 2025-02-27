# パスキーのサンプル実装

## 概要

WebAuthnを使ったパスキーのサンプル実装。

1. 

## Prisma

```bash
# 初回マイグレーション実行
prisma migrate dev --name init

# 型定義更新(migrateを実行した場合は不要)
npx prisma generate
```

## 参考

- [SimpleWebAuthn](https://simplewebauthn.dev/docs/)
- [ライブラリ (SimpleWebAuthn) を使用した WebAuthn の RP 実装の勘所](https://zenn.dev/kg0r0/articles/c271abb1ab2b76)
- SoftwareDesign 2025年1月号
