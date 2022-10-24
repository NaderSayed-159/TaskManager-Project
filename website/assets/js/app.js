//Create a new Task
class Task {
    constructor(title, assinedTo) {
        this.title = title.charAt(0).toUpperCase() + title.slice(1);
        this.assinedTo = assinedTo.charAt(0).toUpperCase() + assinedTo.slice(1);
        this.id = new Date().getTime();
    }
}

// Control UI
class UI {

    static addTasksToUi() {
        const storedTasks = Storage.getTasks();
        document.querySelector('#tasks-List').innerHTML = '';

        storedTasks.forEach(task => {
            UI.displayTaskinList(task)
        })
        UI.taskCounter();
        UI.showDone();
        document.querySelector('#title').focus();
    }

    static displayTaskinList(task) {
        const tasksList = document.querySelector('#tasks-List');

        const taskContainer = document.createElement('div');
        taskContainer.classList.add('newTaskContainer');
        taskContainer.innerHTML = `
        <div class="newTaskField">
            <p class="newTaskValue">${task.title}</p>
            <p class="mb-0 d-flex align-items-center flex-column">Assigned To: <span class="assignedTo">${task.assinedTo}</span></p>
            <div>
                <button class="editBtn btn btn-warning" data-uuid="${task.id}" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                <button class="deleteBtn btn btn-danger" data-uuid="${task.id}">Delete</button>
                <button class="doneBtn btn btn-success" data-uuid="${task.id}">Done</button>
            </div>    
        </div>
        `;
        tasksList.appendChild(taskContainer);
    }

    static showAlert(messege, className, parentID = '.container', childID = '#tasks-List') {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(messege));
        const container = document.querySelector(parentID);
        const tasksList = document.querySelector(childID);
        container.insertBefore(div, tasksList);
        //make is disappear 
        setTimeout(() => document.querySelector('.alert').remove(),
            3000);
    }

    static taskCounter() {
        const tasksCounter = document.querySelectorAll('.newTaskContainer');
        const counterField = document.querySelector('#counter');
        counterField.innerHTML = `Tasks Counter: <span class='text-danger'>${tasksCounter.length}</span>`
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#assigned-to').value = '';
    }

    static deleteTask(el) {
        if (el.classList.contains('deleteBtn')) {
            el.parentElement.parentElement.parentElement.remove();
            UI.showAlert('Task Deleted', 'warning')
        }
    }

    static handlingEditModal(el) {
        let modalBody = document.querySelectorAll('#editingModalBody form div input')
        if (el.classList.contains('editBtn')) {
            let taskId = el.dataset.uuid;
            let tasks = Storage.getTasks();
            let modifiedTask = tasks.filter(task => task.id == taskId)[0];
            modalBody.forEach(ele => ele.value = modifiedTask[ele.id])
        }
    }

    static showDone() {
        let doneCounterNo = document.querySelector('.dtCounter');
        doneCounterNo.innerHTML = Storage.getDone();
    }

    static doneTasks(el) {
        if (el.classList.contains('doneBtn')) {
            el.parentElement.parentElement.parentElement.remove();
            UI.countDone();
            UI.showAlert('Congratulations', 'info')
        }

    }

    static countDone() {

        let doneCounterNo = document.querySelector('.dtCounter');

        doneCounterNo.innerHTML++

        Storage.storeDone(doneCounterNo.innerHTML)
    }

    static clearDoneM() {
        let doneCounterNo = document.querySelector('.dtCounter');

        if (doneCounterNo.innerHTML == 0) {
            UI.showAlert('Already Cleared', 'danger')
        } else {
            doneCounterNo.innerHTML = 0;
            UI.showAlert('Done Counter Cleared', 'success')
        }


    }

    static clearAllTasks() {
        let allTasks = document.querySelectorAll('.newTaskContainer');
        allTasks.forEach(el => el.remove());
        UI.taskCounter();
        UI.showDone();
    }

    static toggaleAbout() {
        document.querySelector('#modalBody').classList.toggle('modalHidden');
    }

}
//Control Storage
class Storage {
    static getTasks() {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = []
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }

    static storeTasks(task) {
        const tasks = Storage.getTasks();

        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    static removeTasks(id, el) {
        const tasks = Storage.getTasks();
        if (el.classList.contains('deleteBtn') || el.classList.contains('doneBtn')) {
            tasks.forEach((task, index) => {
                if (task.id == id) {
                    tasks.splice(index, 1);
                }
            })
            localStorage.setItem('tasks', JSON.stringify(tasks))

        }

    }

    static editTask(id, el, updatedValue) {
        const tasks = Storage.getTasks();
        let tasksAfterUpdate = []
        if (el.classList.contains('applyChanges')) {
            tasks.forEach(task => {
                if (task.id == id) {
                    task = updatedValue;
                    tasksAfterUpdate.push(task)
                } else {
                    tasksAfterUpdate.push(task)
                }
            })
            localStorage.setItem('tasks', JSON.stringify(tasksAfterUpdate))
        }
    }

    static storeDone(number) {
        localStorage.setItem('doneTasks', number);
    }

    static getDone() {
        let Donetasks;
        if (localStorage.getItem('doneTasks') == null) {
            Donetasks = 0;
        } else {
            Donetasks = localStorage.getItem('doneTasks');
        }

        return Donetasks;
    }

    static clearDone() {
        let lastDoneNo = localStorage.getItem('doneTasks');
        if (!lastDoneNo == 0) {
            localStorage.setItem('lastDoneTasks', lastDoneNo);
            localStorage.setItem('doneTasks', 0);
        }
    }

    static resetDoneCounter() {
        let doneTasksCounter = localStorage.getItem('lastDoneTasks');
        let lastDoneNo = localStorage.getItem('doneTasks');

        if (doneTasksCounter == lastDoneNo) {
            UI.showAlert('Nothing to reset !!!', 'warning')
        } else {
            Storage.storeDone(doneTasksCounter)
            UI.showDone();
            UI.showAlert('Counter Restored', 'success')

        }

    }

    static backupFactory() {

        let backupfactory = JSON.stringify(localStorage);
        localStorage.clear();
        localStorage.setItem('backupStorage', backupfactory);

    }

    static factoryReset() {
        let chechBackup = localStorage.getItem('backupStorage');
        if (localStorage.length == 0 || chechBackup != null) {
            UI.showAlert('The Application is Already Reset', 'warning')
        } else {
            Storage.backupFactory();
            UI.clearFields();
            UI.clearAllTasks();
            UI.showAlert('The Application Reset to Zero', 'primary');

        }
    }

    static restoreBackupFactory() {

        let backupValue = localStorage.getItem('backupStorage');
        if (backupValue == null || backupValue == []) {
            UI.showAlert('There is no data to restore', 'warning')
        } else {
            let dataBackupValue = JSON.parse(localStorage.getItem('backupStorage'));
            localStorage.clear();
            for (const key in dataBackupValue) {
                localStorage.setItem(key, dataBackupValue[key])
            }
            UI.addTasksToUi();
        }
    }

    static backupAndDeleteAll() {

        let storedTasks = localStorage.getItem('tasks');

        localStorage.setItem('tasks', []);
        localStorage.setItem('backuptasks', storedTasks);

    }

    static restoreAllDeleted() {

        let backupStoredTasks = localStorage.getItem('backuptasks');
        localStorage.setItem('tasks', backupStoredTasks);
        localStorage.removeItem('backuptasks');

    }

    static async restoreBackup() {
        let backupTasks = await (fetch('../../BackUp.json'))
        let returnDdata = await backupTasks.json()
        let allBackuped = JSON.parse(JSON.parse(returnDdata.data)['tasks'])
        localStorage.setItem('tasks', JSON.stringify(allBackuped))
        UI.addTasksToUi()
    }
}
//Server Methods
class Server {
    static postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        try {
            const newData = await response.json();
            console.log(newData);
            return newData;
        } catch (error) {
            console.log('error', error);
        }
    }
}
class TasksOp {

    static tasksOperations(task) {

        UI.displayTaskinList(task);

        //store task
        Storage.storeTasks(task);

        //ckear fields
        UI.clearFields();
        //alert when success
        UI.showAlert('Task Added', 'success')
    }
}



//Display tasks onLoad 
document.addEventListener('DOMContentLoaded', UI.addTasksToUi);

//event add task

document.querySelector('.form').addEventListener('submit', (e) => {
    //pervent default
    e.preventDefault();

    //get values
    const title = document.querySelector('#title').value;
    const titlefield = document.querySelector('#title');
    const assignedTo = document.querySelector('#assigned-to').value;

    //create task from values
    const task = new Task(title, assignedTo);

    //validate 
    if (title === '' || assignedTo === '') {
        UI.showAlert('Please Fill The Fields', 'danger')
    } else if (localStorage.getItem('backupStorage') != null) {

        localStorage.clear();

        //add task to list
        TasksOp.tasksOperations(task)

    } else {
        //add task to list
        TasksOp.tasksOperations(task)
    }

    UI.taskCounter();

    titlefield.focus();
})

//edit  task
document.querySelector('#tasks-List').addEventListener('click', (e) => {

    UI.handlingEditModal(e.target);
    let applyChangesBtn = document.querySelector('#applyEdits');
    applyChangesBtn.addEventListener('click', () => {
        let editModalBody = document.querySelectorAll('#editingModalBody form div input');
        let updatedTask = {}
        editModalBody.forEach(el => updatedTask[el.id] = el.value);

        Object.entries(updatedTask).forEach(([key, value]) => {
            if (value == '') {
                UI.showAlert(`${key.charAt(0).toUpperCase()+key.slice(1)} Can't be Empty`, 'danger', '#editingModalBody', '#bodyForm')
            } else {
                Storage.editTask(updatedTask.id, applyChangesBtn, updatedTask);
                UI.addTasksToUi();
                $('.editModal').modal('hide');
            }
        })



    })

})

//event remove task
document.querySelector('#tasks-List').addEventListener('click', (e) => {
    //remove task from UI
    UI.deleteTask(e.target);

    //remove task from Storage
    Storage.removeTasks(e.target.dataset.uuid, e.target);

    //counter
    UI.taskCounter();

})

//event count done tasks 
document.querySelector('#tasks-List').addEventListener('click', (e) => {

    UI.doneTasks(e.target);

    Storage.removeTasks(e.target.dataset.uuid, e.target);

    UI.taskCounter();

})

//event clear done 
document.querySelector('#clearDone').addEventListener('click', () => {

    UI.clearDoneM();
    Storage.clearDone();
})

//event reset Done 
document.querySelector('#resetDoneCounter').addEventListener('click', () => {

    Storage.resetDoneCounter();

})

//event do backup 
document.querySelector('#backUpForm').addEventListener('submit', async (e) => {
    //pervent default
    e.preventDefault();
    let storedTasks = localStorage.getItem('tasks');
    if (storedTasks == null || storedTasks == '[]') {
        UI.showAlert('There is Nothing to Backup Pls Add Task First', 'danger')
    } else {
        let backUpField = document.querySelector('#backUp');
        backUpField.value = JSON.stringify(localStorage);
        Server.postData('/storeTasks', {data: backUpField.value})

        UI.showAlert('BackUP Done', 'success')
    }


})

//event factory reset 
document.querySelector('#factoryReset').addEventListener('click', () => {

    Storage.factoryReset();

})

//event delete all tasks
document.querySelector('#clearTasks').addEventListener('click', () => {
    let test = localStorage.getItem('tasks');
    if (test == null || test == []) {
        UI.showAlert('There is No Tasked To Be Cleared', 'warning');
    } else {
        UI.clearAllTasks();
        Storage.backupAndDeleteAll();
        UI.showAlert('Tasks Cleared Successfully', 'success');
    }


})

//event restore all 
document.querySelector('#restoreDeleted').addEventListener('click', () => {
    let test = localStorage.getItem('backuptasks');
    if (test == null || test == []) {
        UI.showAlert('There is Nothing tb be Restored', 'warning')
    } else {
        Storage.restoreAllDeleted();
        UI.addTasksToUi();
        UI.showAlert('Deleted Taskes Restored Successfully', 'success')
    }
})

//event restore from factory reset
document.querySelector('#RestorEndPoint').addEventListener('click', () => {
    Storage.restoreBackupFactory();
})

//event about btn 
document.querySelector('#infoBtn').addEventListener('click', () => {
    UI.toggaleAbout();
})

//event close about btn
document.querySelector('#modalClose').addEventListener('click', () => {
    UI.toggaleAbout();
})

// restore backup

document.querySelector('#backupRestore').addEventListener('click', () => {
    Storage.restoreBackup()
})