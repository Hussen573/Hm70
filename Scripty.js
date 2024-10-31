const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
let editMode = false;
let taskToEdit = null;

// تحميل المهام المخزنة من localStorage عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadTasks);

// قائمة الخلفيات
const backgroundImages = [
    'images/Image1.jpg',
    'images/Image2.jpg',
    'images/Image3.jpg',
    'images/Image4.jpg',
    'images/Image5.jpg',
    'images/Image6.jpg',
    'images/Image7.jpg',
    'images/Image8.jpg',
    'images/Image9.jpg',
    'images/Image10.jpg'
   
];

// اختيار صورة عشوائية
const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
document.body.style.backgroundImage = `url('${randomImage}')`;
document.body.style.backgroundAttachment = 'fixed'; // جعل الخلفية ثابتة
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundRepeat = "no-repeat";


taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const taskDueDate = taskDate.value;

    if (taskText !== '' && taskDueDate !== '') {
        if (editMode) {
            updateTask(taskToEdit, taskText, taskDueDate);
        } else {
            addTaskToDOM(taskText, taskDueDate);
            saveTask(taskText, taskDueDate);
        }

        taskInput.value = '';
        taskDate.value = '';
        editMode = false;
        taskToEdit = null;
        alert('تم حفظ المهمة بنجاح!');
    }
});

// إضافة المهمة إلى DOM مع زر تعديل وحذف وترقيم
function addTaskToDOM(taskText, taskDueDate, completed = false) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    if (completed) taskElement.classList.add('completed');

    const taskNumber = taskList.childElementCount + 1;
    const numberSpan = document.createElement('span');
    numberSpan.textContent = `${taskNumber}.`;
    numberSpan.style.color = 'blue';
    numberSpan.style.backgroundColor = 'yellow';
    numberSpan.style.padding = '3px';
    numberSpan.style.marginRight = '10px';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.style.marginRight = "10px";

    const dateSpan = document.createElement('span');
    dateSpan.innerHTML = `<span style="color: red; margin-right: 10px;">موعد المهمة:</span>${taskDueDate}`;
    dateSpan.classList.add('task-date');
    dateSpan.style.marginRight = "10px";


    const editButton = document.createElement('button');
    editButton.textContent = 'تعديل';
    editButton.classList.add('edit');
    editButton.style.marginRight = "10px";
    editButton.addEventListener('click', function() {
        startEditTask(taskElement, taskText, taskDueDate);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'حذف';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', function() {
        const confirmDelete = confirm('هل أنت متأكد أنك تريد حذف هذه المهمة؟');
        if (confirmDelete) {
            taskList.removeChild(taskElement);
            removeTask(taskText);
            updateProgressBar(); // تحديث شريط التقدم بعد الحذف
            alert('تم حذف المهمة!');
        }
    });

    taskElement.appendChild(numberSpan);
    taskElement.appendChild(taskSpan);
    taskElement.appendChild(dateSpan);
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);

    taskElement.addEventListener('click', function() {
        taskElement.classList.toggle('completed');
        updateTaskStatus(taskText);
        updateProgressBar(); // تحديث شريط التقدم عند النقر على المهمة
    });

    taskList.appendChild(taskElement);
    updateProgressBar(); // تحديث شريط التقدم عند إضافة مهمة جديدة
}

// بدء تعديل المهمة
function startEditTask(taskElement, taskText, taskDueDate) {
    taskInput.value = taskText;
    taskDate.value = taskDueDate;
    editMode = true;
    taskToEdit = taskText;
}

// تحديث المهمة بعد تعديلها
function updateTask(oldTaskText, newTaskText, newTaskDueDate) {
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (task.text === oldTaskText) {
            task.text = newTaskText;
            task.dueDate = newTaskDueDate;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskList.innerHTML = '';
    loadTasks();
}

// حفظ المهمة في localStorage
function saveTask(taskText, taskDueDate) {
    let tasks = getTasksFromStorage();
    tasks.push({ text: taskText, dueDate: taskDueDate, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحميل المهام من localStorage
function loadTasks() {
    let tasks = getTasksFromStorage();
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    tasks.forEach(task => addTaskToDOM(task.text, task.dueDate, task.completed));
    updateProgressBar(); // تحديث شريط التقدم عند تحميل المهام
}

// حذف المهمة من localStorage
function removeTask(taskText) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// تحديث حالة المهمة في localStorage
function updateTaskStatus(taskText) {
    let tasks = getTasksFromStorage();
    tasks = tasks.map(task => {
        if (task.text === taskText) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// استرجاع المهام من localStorage
function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// تحديث شريط التقدم بناءً على عدد المهام المكتملة
function updateProgressBar() {
    const tasks = getTasksFromStorage();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;

    const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    progressBar.style.width = percentage + '%';
    progressBar.style.backgroundColor = '#0000FF'; // لون الشريط أزرق
    progressBar.style.color = '#FFFF00'; // لون النص أصفر
    progressBar.textContent = Math.round(percentage) + '%'; // عرض النسبة المئوية داخل الشريط
}

// تحديث الوقت والتاريخ الحالي
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    const now = new Date();
    
    // الحصول على الوقت بتوقيت UTC+3
    const utc3Time = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    
    const day = dayNames[utc3Time.getUTCDay()];
    const date = utc3Time.getUTCDate();
    const month = monthNames[utc3Time.getUTCMonth()];
    const year = utc3Time.getFullYear();
    
    const hours = utc3Time.getUTCHours().toString().padStart(2, '0');
    const minutes = utc3Time.getUTCMinutes().toString().padStart(2, '0');
    const seconds = utc3Time.getUTCSeconds().toString().padStart(2, '0');
    
    dateTimeElement.textContent = `اليوم: ${day} - التاريخ: ${date} ${month} ${year} - الوقت: ${hours}:${minutes}:${seconds}`;
}

// تحديث الوقت كل ثانية
setInterval(updateDateTime, 1000);


