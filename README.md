# Web Renewal Project

本プロジェクトは、既存 Web サイトのリニューアルを目的とした  
**モダンフロントエンド + Headless CMS + AWS インフラ** を前提とした構成の検証・実装プロジェクトです。

フロントエンドと CMS を分離し、CI/CD による自動ビルド・自動デプロイを行うことで、  
**開発効率・安全性・運用性の高い構成**を目指しています。

---

## Tech Stack

### Frontend（Public Site）

- **Astro**
- React（Islands Architecture）
- Three.js
- GSAP
- TypeScript
- SCSS

Astro をベースに、必要な箇所のみ React を Islands として使用することで、  
パフォーマンスと表現力を両立しています。

---

### CMS / Backend

- **Next.js（App Router）**
- TypeScript

Headless CMS として Next.js を採用し、  
将来的な API 拡張・管理画面の拡張を見据えた構成としています。

---

### Infrastructure

- **AWS**
  - S3（静的ホスティング）
  - CloudFront（CDN）
  - IAM（GitHub Actions 用デプロイユーザー）
- GitHub Actions（CI / CD）

※ 現在は **STG（検証環境）まで構築済み**。  
　本番環境（PROD）は STG 構成を踏襲して拡張予定。

---

## Project Structure
