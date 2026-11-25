const storageKey = 'feluda-todo-demo.tasks';
const form = document.querySelector('#new-task');
const input = document.querySelector('#task-name');
const list = document.querySelector('#tasks');
const empty = document.querySelector('#empty');
const progress = document.querySelector('#progress');

function readTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(saved)
      ? saved.filter(task => task && typeof task.name === 'string' && typeof task.completed === 'boolean')
      : [];
  } catch {
    return [];
  }
}

const tasks = readTasks();

function updateProgress() {
  const completed = tasks.filter(task => task.completed).length;
  progress.textContent = `${completed} of ${tasks.length} completed`;
  empty.hidden = tasks.length > 0;
}

function saveTasks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch {
    // The list still works for the current page when browser storage is unavailable.
  }
  updateProgress();
}

function showTask(task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
  });

  const name = document.createElement('span');
  name.textContent = task.name;
  label.append(checkbox, name);

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete ${task.name}`);
  remove.addEventListener('click', () => {
    tasks.splice(tasks.indexOf(task), 1);
    item.remove();
    saveTasks();
    input.focus();
  });

  item.append(label, remove);
  list.append(item);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = input.value.trim();
  if (name) {
    const task = { name, completed: false };
    tasks.push(task);
    showTask(task);
    saveTasks();
  }
  form.reset();
  input.focus();
});

tasks.forEach(showTask);
updateProgress();
