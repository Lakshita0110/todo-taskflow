let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTab = 'todo';

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  if (!user) window.location.href = "index.html";

  document.getElementById("userInfo").innerHTML = `
    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff" width="40" height="40" />
    <span>${user.name}</span>
  `;

  if (tasks.length === 0) {
    fetch("https://dummyjson.com/todos")
      .then(res => res.json())
      .then(data => {
        tasks = data.todos.slice(0, 5).map(t => ({
          id: Date.now() + Math.random(),
          text: t.todo,
          stage: "todo",
          modified: new Date().toLocaleString()
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
  } else {
    renderTasks();
  }
});

function renderTasks() {
  ["todo", "completed", "archived"].forEach(stage => {
    const container = document.getElementById(stage + "Stage");
    container.innerHTML = "";
    tasks.filter(t => t.stage === stage).forEach(task => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
        <p>${task.text}</p>
        <small>Last modified at: ${task.modified}</small>
        <div class="actions">
          ${stage !== "archived" ? `<button onclick="moveTask(${task.id}, 'archived')">Archive</button>` : ""}
          ${stage !== "completed" ? `<button onclick="moveTask(${task.id}, 'completed')">Mark it as completed</button>` : ""}
          ${stage !== "todo" ? `<button onclick="moveTask(${task.id}, 'todo')">Move to Todo</button>` : ""}
        </div>
      `;
      container.appendChild(div);
    });
  });
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".stage").forEach(div => div.style.display = "none");
  document.getElementById(tab + "Stage").style.display = "block";

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add("active");
}

function addTask() {
  const input = document.getElementById("taskText");
  const value = input.value.trim();
  if (!value) return alert("Task cannot be empty");
  tasks.push({
    id: Date.now(),
    text: value,
    stage: "todo",
    modified: new Date().toLocaleString()
  });
  input.value = "";
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  switchTab("todo");
}

function moveTask(id, stage) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.stage = stage;
    task.modified = new Date().toLocaleString();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    switchTab(stage);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
