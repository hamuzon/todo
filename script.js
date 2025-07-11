"use strict";

const APP_NAME = "todo-list";
const TODO_VERSION = "1.0";

document.addEventListener("DOMContentLoaded", () => {
  const todoListContainer = document.getElementById("todo-list-container");
  const modalBg = document.getElementById("modal-bg");
  const modalDate = document.getElementById("modal-date");
  const todoTime = document.getElementById("todo-time");
  const todoText = document.getElementById("todo-text");
  const saveBtn = document.getElementById("save-btn");
  const deleteBtn = document.getElementById("delete-btn");
  const closeBtn = document.getElementById("close-btn");
  const saveJsonBtn = document.getElementById("save-json-btn");
  const loadJsonBtn = document.getElementById("load-json-btn");
  const loadJsonInput = document.getElementById("load-json-input");
  const addTodoBtn = document.getElementById("add-todo-btn");

  const STORAGE_TODOS = "todo_events";

  let todos = JSON.parse(localStorage.getItem(STORAGE_TODOS) || "{}");
  let selectedDateKey = null;

  function formatDateJP(dateKey) {
    const [y, m, d] = dateKey.split("-");
    return `${y}年${parseInt(m)}月${parseInt(d)}日`;
  }

  function validateFormat(json) {
    return json &&
      typeof json === "object" &&
      json.events && typeof json.events === "object" &&
      json.settings && typeof json.settings === "object" &&
      json.settings.app === APP_NAME &&
      json.settings.version === TODO_VERSION &&
      Object.values(json.events).every(val => typeof val === "string")
      ? "1.0"
      : null;
  }

  function renderTodoList() {
    todoListContainer.innerHTML = "";

    // 日付キーだけを配列で取得し、ソート（昇順）
    const dateKeys = Object.keys(todos).sort();

    if (dateKeys.length === 0) {
      const noItem = document.createElement("div");
      noItem.textContent = "TODOがありません。➕ ボタンで追加してください。";
      noItem.style.fontStyle = "italic";
      noItem.style.color = "#999";
      todoListContainer.appendChild(noItem);
      return;
    }

    for (const dateKey of dateKeys) {
      const block = document.createElement("div");
      block.classList.add("todo-date-block");
      block.tabIndex = 0;
      block.setAttribute("role", "button");
      block.setAttribute("aria-label", `TODO: ${formatDateJP(dateKey)} の編集`);

      const heading = document.createElement("h4");
      heading.textContent = formatDateJP(dateKey);
      block.appendChild(heading);

      const todoItem = document.createElement("div");
      todoItem.textContent = todos[dateKey];
      todoItem.classList.add("todo-item");
      block.appendChild(todoItem);

      block.onclick = () => openModal(dateKey);
      block.onkeydown = e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(dateKey);
        }
      };

      todoListContainer.appendChild(block);
    }
  }

  function openModal(dateKey) {
    selectedDateKey = dateKey;
    modalDate.textContent = `📅 ${formatDateJP(dateKey)}`;
    if (todos[dateKey]) {
      const [time, ...rest] = todos[dateKey].split(" ");
      if (/^\d{2}:\d{2}$/.test(time)) {
        todoTime.value = time;
        todoText.value = rest.join(" ").trim();
      } else {
        todoTime.value = "";
        todoText.value = todos[dateKey];
      }
    } else {
      todoTime.value = "";
      todoText.value = "";
    }
    modalBg.hidden = false;
    todoText.focus();
  }

  function closeModal() {
    modalBg.hidden = true;
    selectedDateKey = null;
  }

  addTodoBtn.onclick = () => {
    // 追加は今日の日付を使う
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    openModal(dateKey);
  };

  saveBtn.onclick = () => {
    const timeVal = todoTime.value.trim();
    const textVal = todoText.value.trim();
    if (!textVal) {
      alert("⚠️ TODO内容を入力してください。");
      todoText.focus();
      return;
    }
    const combined = timeVal ? `${timeVal} ${textVal}` : textVal;
    todos[selectedDateKey] = combined;
    localStorage.setItem(STORAGE_TODOS, JSON.stringify(todos));
    renderTodoList();
    closeModal();
  };

  deleteBtn.onclick = () => {
    if (todos[selectedDateKey]) {
      if (confirm("🗑️ このTODOを削除しますか？")) {
        delete todos[selectedDateKey];
        localStorage.setItem(STORAGE_TODOS, JSON.stringify(todos));
        renderTodoList();
        closeModal();
      }
    }
  };

  closeBtn.onclick = closeModal;

  modalBg.onclick = e => {
    if (e.target === modalBg) closeModal();
  };

  saveJsonBtn.onclick = () => {
    const now = new Date();
    const y = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const filename = `todo-${TODO_VERSION}_${y}-${mo}-${d}_${h}-${mi}-${s}.json`;

    const savedData = {
      savedAt: now.toISOString(),
      events: todos,
      settings: {
        app: APP_NAME,
        version: TODO_VERSION,
      }
    };
    const blob = new Blob([JSON.stringify(savedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  loadJsonBtn.onclick = () => loadJsonInput.click();

  loadJsonInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target.result);
        if (validateFormat(json) !== TODO_VERSION) {
          alert("❌ 未対応の形式か、settings情報がありません。");
          return;
        }
        todos = json.events;
        localStorage.setItem(STORAGE_TODOS, JSON.stringify(todos));
        alert("✅ TODOリストを読み込みました。");
        renderTodoList();
      } catch {
        alert("❌ ファイルの読み込みに失敗しました。");
      }
    };
    reader.readAsText(file);
    loadJsonInput.value = "";
  };

  renderTodoList();
});
