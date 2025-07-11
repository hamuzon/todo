"use strict";

const TODO_VERSION = "1.0";
const STORAGE_KEY = "todo_events";

let todos = {};
let tagColors = {};
let selectedDate = null;

document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("todo-list-container");
  const modalBg = document.getElementById("modal-bg");
  const modal = document.getElementById("modal");
  const modalDate = document.getElementById("modal-date");
  const todoDate = document.getElementById("todo-date");   // 日付入力
  const todoTime = document.getElementById("todo-time");   // 時刻入力
  const todoText = document.getElementById("todo-text");   // TODO内容

  const addBtn = document.getElementById("add-todo-btn");
  const saveBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const closeBtn = document.getElementById("close-btn");

  const saveJsonBtn = document.getElementById("save-json-btn");
  const loadJsonBtn = document.getElementById("load-json-btn");
  const loadInput = document.getElementById("load-json-input");

  // 日付選択input（ヘッダーにあれば）
  const selectDateInput = document.getElementById("select-date");

  // 日付を YYYY-MM-DD 形式にフォーマット
  function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  }

  // YYYY-MM-DD → 日本語表記に変換
  function formatDateJP(dateKey) {
    const [y,m,d] = dateKey.split("-");
    return `${y}年${parseInt(m)}月${parseInt(d)}日`;
  }

  // TODO一覧の表示
  function renderTodoList() {
    listContainer.innerHTML = "";
    const keys = Object.keys(todos).sort();

    keys.forEach(dateKey => {
      const block = document.createElement("div");
      block.className = "todo-date-block";
      block.tabIndex = 0;
      block.setAttribute("role", "button");
      block.setAttribute("aria-label", `${formatDateJP(dateKey)} のTODO`);

      const heading = document.createElement("h4");
      heading.textContent = formatDateJP(dateKey);
      block.appendChild(heading);

      const item = document.createElement("div");
      item.className = "todo-item";
      item.textContent = todos[dateKey] || "(未入力)";
      block.appendChild(item);

      block.onclick = () => openModal(dateKey);
      block.onkeydown = e => {
        if(e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(dateKey);
        }
      };

      listContainer.appendChild(block);
    });
  }

  // モーダルを開く。日付入力に該当日付をセット
  function openModal(dateKey) {
    selectedDate = dateKey;
    modalDate.textContent = `📅 ${formatDateJP(dateKey)}`;

    todoDate.value = dateKey;  // ここが重要！日付入力にセット

    const raw = todos[dateKey] || "";
    const [time, ...rest] = raw.split(" ");
    if(/^\d{2}:\d{2}$/.test(time)){
      todoTime.value = time;
      todoText.value = rest.join(" ").trim();
    } else {
      todoTime.value = "";
      todoText.value = raw;
    }

    modalBg.hidden = false;
    todoText.focus();

    if(selectDateInput) {
      selectDateInput.value = dateKey;
    }
  }

  // モーダルを閉じる
  function closeModal() {
    modalBg.hidden = true;
    selectedDate = null;
  }

  // 「追加」ボタンで今日の日付でモーダル開く
  addBtn.onclick = () => {
    const todayKey = formatDateKey(new Date());
    openModal(todayKey);
    todoTime.value = "";
    todoText.value = "";
  };

  // 保存処理（モーダル内の日付＋時刻を使う）
  saveBtn.onclick = () => {
    const date = todoDate.value;
    const time = todoTime.value.trim();
    const text = todoText.value.trim();

    if(!date) {
      alert("⚠️ 日付を入力してください。");
      todoDate.focus();
      return;
    }
    if(!text) {
      alert("⚠️ TODO内容を入力してください。");
      todoText.focus();
      return;
    }

    selectedDate = date;
    todos[selectedDate] = time ? `${time} ${text}` : text;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    renderTodoList();
    closeModal();
  };

  // 削除処理
  deleteBtn.onclick = () => {
    if(todos[selectedDate]){
      if(confirm("🗑️ このTODOを削除しますか？")){
        delete todos[selectedDate];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        renderTodoList();
        closeModal();
      }
    }
  };

  // 閉じる処理
  closeBtn.onclick = closeModal;
  modalBg.onclick = e => {
    if(e.target === modalBg) closeModal();
  };

  // JSON保存
  saveJsonBtn.onclick = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth()+1).padStart(2,"0");
    const d = String(now.getDate()).padStart(2,"0");
    const h = String(now.getHours()).padStart(2,"0");
    const mi = String(now.getMinutes()).padStart(2,"0");
    const s = String(now.getSeconds()).padStart(2,"0");

    const json = {
      savedAt: now.toISOString(),
      events: todos,
      settings: {
        app: "todo-list",
        version: TODO_VERSION,
        tagColors
      }
    };

    const blob = new Blob([JSON.stringify(json,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todo-${TODO_VERSION}_${y}-${m}-${d}_${h}-${mi}-${s}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON読込
  loadJsonBtn.onclick = () => loadInput.click();

  loadInput.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try{
        const json = JSON.parse(ev.target.result);
        loadFromJSON(json);
        alert("✅ 読み込み完了");
      }catch{
        alert("❌ 読み込みエラー: 不正なJSONです");
      }
      loadInput.value = "";
    };
    reader.readAsText(file);
  };

  // JSONから読み込み処理
  function loadFromJSON(json){
    if(!json || typeof json !== "object") throw new Error("不正なJSON");

    let settings = json.settings;

    if(
      settings &&
      typeof settings === "object" &&
      !settings.app &&
      !settings.version &&
      settings.tagColors
    ){
      settings = {
        app: "todo-list",
        version: TODO_VERSION,
        tagColors: settings.tagColors
      };
    }

    if(!settings || settings.app !== "todo-list" || settings.version !== TODO_VERSION){
      throw new Error("❌ 対応していない形式です");
    }

    if(!json.events || typeof json.events !== "object"){
      throw new Error("❌ events がありません");
    }

    todos = json.events;
    tagColors = settings.tagColors || {};
    renderTodoList();
  }

  // ヘッダーの日付選択input（あれば）に今日の日付セット＆変更時にモーダル開く
  if(selectDateInput){
    selectDateInput.value = formatDateKey(new Date());

    selectDateInput.onchange = () => {
      const dateKey = selectDateInput.value;
      if(dateKey) openModal(dateKey);
    };
  }

  // ローカルストレージから読み込み
  const stored = localStorage.getItem(STORAGE_KEY);
  if(stored){
    try {
      todos = JSON.parse(stored);
    } catch{}
  }

  renderTodoList();
});
