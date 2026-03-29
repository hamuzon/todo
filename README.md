# 📝 TODOリストアプリ (Version 1.1)

---

## 概要

シンプルで使いやすいTODOリストウェブアプリです。

- **日付ごとにTODOを管理**  
- **時刻付きTODOにも対応**  
- **ローカルストレージに保存**  
- **JSONファイルでエクスポート／インポート可能**  
- **ダークモード対応（OS設定に自動追従）**  
- **アクセシビリティ対応（キーボード操作・aria属性）**

---

## ファイル構成

|ファイル名|内容|
|---|---|
|`index.html`|アプリのHTML構造|
|`style.css`|スタイリング（ライト/ダークモード対応）|
|`script.js`|機能実装（TODO管理、保存・読み込みなど）|
|`icon.svg`|ファビコン用アイコン（任意）|

---

## v1.1 での変更点

- **既存TODOへの自動追記・編集**: 「追加」ボタン押下時にその日のTODOが既にある場合、内容を自動的に読み込み、追記や編集がスムーズに行えるようになりました。
- **日付変更時のマージ**: モーダル内で日付を変更して保存した際、移動先の日付に既存データがあれば自動的に末尾に追記（アペンド）されるようになりました。
- **互換性の向上**: v1.0形式のJSONファイルの読み込みをサポートしました。

## 使い方

1. 「➕ TODO追加」ボタンをクリックして、今日の日付のTODOを追加。既存の内容があれば自動で表示されます。
2. 日付ブロックをクリックすると編集モーダルが開きます。  
3. 時刻（任意）と内容を入力し、「💾 保存」で登録。  
4. 「💾 保存」ボタン（下部）でJSON形式ファイルにエクスポート。
5. 「📂 読込」ボタンでJSONファイルを読み込み、TODOを復元。  

---

## JSONファイルの互換性について

本アプリのJSONファイルは、  
[hamuzon/calendar GitHub リポジトリ (v1.0形式)](https://github.com/hamuzon/calendar) と互換性があります。

### ファイル名例

ファイル名規則
`todo-[TODO_VERSION][YYYY]-[MM]-[DD][HH]-[mm]-[ss].json`
名前例
todo-1.1_2025-07-11_21-30-45.json

この仕様により、他のv1.0対応カレンダーアプリとデータの互換性あります。

## 公開リンク

[TODOリストアプリ](https://hamuzon.github.io/todo/)

---

## ライセンス

MIT License （自由に利用・改変可能です）

---

## 📝 To-Do List App (Version 1.1)

---

## Overview

A simple and easy-to-use to-do list web app.

- **Manage TODOs by date**
- **Supports TODOs with timestamps**
- **Save to local storage**
- **Export/import as a JSON file**
- **Dark mode support (automatically follows OS settings)**
- **Accessibility support (keyboard operation, aria attribute)**

---

## File Structure

|Filename|Content|
|---|---|
|`index.html`|App's HTML structure|
|`style.css`|Styling (Light/Dark mode support)|
|`script.js`|Function implementation (TODO management, save/load, etc.)|
|`icon.svg`|Favicon icon (optional)|

---

## Changes in v1.1

- **Automatic addition/editing of existing TODOs**: When the "Add" button is pressed, if there are already TODOs for that day, the content is automatically loaded, allowing for smooth addition and editing.

- **Date Change Merging**: When you change the date and save within the modal, existing data for the destination date will now be automatically appended to the end.

- **Improved Compatibility**: Added support for reading v1.0 format JSON files.

## How to Use

1. Click the "➕ Add TODO" button to add a TODO for today's date. Existing content will be displayed automatically.

2. Clicking the date block opens the edit modal.

3. Enter the time (optional) and content, then click "💾 Save" to register.

4. Export to a JSON file using the "💾 Save" button (bottom).

5. Load the JSON file using the "📂 Load" button to restore the TODO.

---

## JSON File Compatibility

This application's JSON files are compatible with the [hamuzon/calendar GitHub repository (v1.0 format)](https://github.com/hamuzon/calendar).

### Example File Names

File Name Convention
`todo-[TODO_VERSION][YYYY]-[MM]-[DD][HH]-[mm]-[ss].json`
Example Name
todo-1.1_2025-07-11_21-30-45.json

This specification ensures data compatibility with other v1.0 compatible calendar apps.

## Public Link

[TODO List App](https://hamuzon.github.io/todo/)

---

## License

MIT License (Free to use and modify)

---
Translated by Google Translate
