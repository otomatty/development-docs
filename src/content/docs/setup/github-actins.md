---
title: Github Actions
description: Github Actionsの設定
---

## 1. yamlファイルの配置

以下のファイルをプロジェクトのルートディレクトリに配置します。

 `.github/workflows/sync-docs.yml`
```
# 共通ドキュメントの同期
name: 共通ドキュメントの同期

on:
  push:
    branches:
      - main
    paths:
      - 'src/content/docs/common/**'  # 共通ドキュメントリポジトリの監視パス
  schedule:
    - cron: '0 0 * * *'  # 毎日0時に実行
  repository_dispatch:
    types: [sync_docs]  # Webhookでトリガーされるイベント
  workflow_dispatch:  # 手動トリガーを追加

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout current project
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Checkout common docs
      uses: actions/checkout@v4
      with:
        repository: otomatty/development-docs
        path: development-docs
        token: ${{ secrets.DOCS_PAT }}

    - name: Create necessary directories
      run: |
        # プロジェクト側のディレクトリを作成
        mkdir -p ./docs/src/content/docs/common
        # development-docs側のディレクトリを作成
        mkdir -p ./development-docs/src/content/docs

    - name: Sync changes from project to common docs
      if: github.event_name == 'push'
      run: |
        # プロジェクトからdevelopment-docsへの同期
        if [ -d "./docs/src/content/docs/common" ]; then
          rsync -av --delete ./docs/src/content/docs/common/ ./development-docs/src/content/docs/
          
          cd development-docs
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add .
          if git diff --staged --quiet; then
            echo "No changes to commit in development-docs"
          else
            git commit -m "sync: Update from ${GITHUB_REPOSITORY}"
            git push
          fi
          cd ..
        else
          echo "Source directory does not exist, skipping sync to development-docs"
        fi

    - name: Sync changes from common docs to project
      run: |
        # 同期前にディレクトリの存在を確認
        if [ ! -d "./development-docs/src/content/docs" ]; then
          echo "Creating directory structure in development-docs"
          mkdir -p ./development-docs/src/content/docs
        fi

        if [ ! -d "./docs/src/content/docs/common" ]; then
          echo "Creating directory structure in project"
          mkdir -p ./docs/src/content/docs/common
        fi

        # 同期実行
        rsync -av --delete ./development-docs/src/content/docs/ ./docs/src/content/docs/common/

        # プロジェクトへの変更をコミット
        git config --global user.name 'GitHub Actions'
        git config --global user.email 'actions@github.com'
        git add .
        if git diff --staged --quiet; then
          echo "No changes to commit in project"
        else
          git commit -m "sync: Update from development-docs"
          git push
        fi

    - name: Cleanup
      if: always()
      run: |
        rm -rf development-docs
```