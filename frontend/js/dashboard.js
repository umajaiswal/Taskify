// Dashboard: shows the user's tasks and handles add / edit / delete / complete.
if (!getToken()) window.location.href = "login.html";

let allTasks = [];        // every task from the backend
let editingTaskId = null; // null = adding a new task

const taskList = document.getElementById("task-list");
const pageMessage = document.getElementById("page-message");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const dialog = document.getElementById("task-dialog");
const taskForm = document.getElementById("task-form");
const dialogMessage = document.getElementById("dialog-message");
const saveBtn = document.getElementById("save-btn");

function showPageError(text) {
  pageMessage.textContent = text;
  pageMessage.classList.remove("hidden");
}
function clearPageError() { pageMessage.classList.add("hidden"); }

// ---------- Loading data ----------
async function loadUser() {
  try {
    const user = await api.getCurrentUser();
    document.getElementById("welcome-title").textContent = "Welcome, " + user.name;
  } catch (error) {
    showPageError(error.message);
  }
}

async function loadTasks() {
  taskList.innerHTML = '<div class="loading"><div class="spinner"></div>Loading your tasks...</div>';
  try {
    allTasks = await api.getTasks();
    clearPageError();
    renderTasks();
  } catch (error) {
    taskList.innerHTML = "";
    showPageError(error.message);
  }
}

// ---------- Drawing the page ----------
// The backend has no search/filter endpoint, so we filter the list here in the browser.
function getVisibleTasks() {
  const text = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  return allTasks.filter(task => {
    const matchesText = task.title.toLowerCase().includes(text) || task.description.toLowerCase().includes(text);
    const matchesStatus = status === "all" || (status === "completed") === task.is_completed;
    return matchesText && matchesStatus;
  });
}

function updateStats() {
  const done = allTasks.filter(task => task.is_completed).length;
  document.getElementById("stat-total").textContent = allTasks.length;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-pending").textContent = allTasks.length - done;
}

function makeButton(text, className, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = "btn btn-small " + className;
  button.addEventListener("click", onClick);
  return button;
}

function renderTasks() {
  updateStats();
  taskList.innerHTML = "";
  const tasks = getVisibleTasks();

  if (tasks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = allTasks.length === 0
      ? "No tasks yet. Select Add task to create your first one."
      : "No tasks match your search or filter.";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement("article");
    card.className = "task" + (task.is_completed ? " completed" : "");

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = task.title;              // textContent keeps user text safe from HTML injection
    const description = document.createElement("p");
    description.textContent = task.description;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = task.is_completed ? "Completed" : "Pending";
    info.append(title, description, badge);

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.append(
      makeButton(task.is_completed ? "Mark pending" : "Mark complete", "btn-secondary", () => toggleComplete(task)),
      makeButton("Edit", "btn-secondary", () => openDialog(task)),
      makeButton("Delete", "btn-danger", () => removeTask(task))
    );

    card.append(info, actions);
    taskList.appendChild(card);
  });
}

// ---------- Actions ----------
async function toggleComplete(task) {
  try {
    // The backend's update needs all three fields, so we send them all.
    const updated = await api.updateTask(task.id, {
      title: task.title,
      description: task.description,
      is_completed: !task.is_completed,
    });
    allTasks = allTasks.map(t => (t.id === task.id ? updated : t));
    clearPageError();
    renderTasks();
  } catch (error) {
    showPageError(error.message);
  }
}

async function removeTask(task) {
  if (!confirm('Delete "' + task.title + '"? This cannot be undone.')) return;
  try {
    await api.deleteTask(task.id);
    allTasks = allTasks.filter(t => t.id !== task.id);
    clearPageError();
    renderTasks();
  } catch (error) {
    showPageError(error.message);
  }
}

// ---------- Add / edit dialog ----------
function openDialog(task = null) {
  editingTaskId = task ? task.id : null;
  document.getElementById("dialog-title").textContent = task ? "Edit task" : "Add task";
  document.getElementById("task-title").value = task ? task.title : "";
  document.getElementById("task-description").value = task ? task.description : "";
  document.getElementById("task-completed").checked = task ? task.is_completed : false;
  dialogMessage.classList.add("hidden");
  dialog.showModal();
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const taskData = {
    title: document.getElementById("task-title").value.trim(),
    description: document.getElementById("task-description").value.trim(),
    is_completed: document.getElementById("task-completed").checked,
  };

  if (!taskData.title) {
    dialogMessage.textContent = "Give the task a title.";
    dialogMessage.classList.remove("hidden");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";
  try {
    if (editingTaskId === null) {
      const created = await api.createTask(taskData);
      allTasks.push(created);
    } else {
      const updated = await api.updateTask(editingTaskId, taskData);
      allTasks = allTasks.map(t => (t.id === editingTaskId ? updated : t));
    }
    dialog.close();
    clearPageError();
    renderTasks();
  } catch (error) {
    dialogMessage.textContent = error.message;
    dialogMessage.classList.remove("hidden");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save task";
  }
});

// ---------- Events ----------
document.getElementById("add-btn").addEventListener("click", () => openDialog());
document.getElementById("cancel-btn").addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
document.getElementById("logout-btn").addEventListener("click", () => {
  clearToken();
  window.location.href = "login.html";
});

loadUser();
loadTasks();
