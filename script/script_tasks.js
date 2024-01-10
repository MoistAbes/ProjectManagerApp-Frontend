$(document).ready(function () {

    var apiRootTasks = 'http://localhost:8080/tasks';
    var apiRootProjects = 'http://localhost:8080/projects';

    const container = document.querySelector('#mainContainer');

    getAllTasks();

    //pobranie wszystkich taskow projektu z bazy danych
    function getAllTasks() {

        var projectId = localStorage.getItem("projectId");
        console.log("saved project id: " + projectId);
        const requestUrl = apiRootProjects + "/" + projectId;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (project) {
                project.tasks.forEach(task => {
                    loadTask(task.title, task.status, task.id);
                });
            }
        });
    }

    //dodanie taska do konkretnej fazy
    function loadTask(taskTitle, taskStatus, taskId) {
        const newTaskDiv = document.createElement('div');
        newTaskDiv.innerHTML = taskTitle;

        newTaskDiv.classList.add("task");
        newTaskDiv.setAttribute("taskId", taskId);
        container.appendChild(newTaskDiv);

        if (taskStatus == "To do") {
            $("#toDoContainer").append(newTaskDiv);
        } else if (taskStatus == "In progress") {
            $("#inProgressContainer").append(newTaskDiv);
        } else if (taskStatus == "Quality assurance") {
            $("#qAContainer").append(newTaskDiv);
        } else if (taskStatus == "Done") {
            $("#doneContainer").append(newTaskDiv);
        }

    }


    // Click handler for entire DIV container
    container.addEventListener('click', function (e) {
        // But only alert for elements that have an alert-button class
        if (e.target.classList.contains('task')) {
            let taskId = e.target.getAttribute("taskId");
            // Storing a global variable
            window.taskId = taskId;
            showTaskDetails(taskId);
        }
    });

    //metoda wczytujaca dane konkretnego taska
    function showTaskDetails(taskId) {

        const requestUrl = apiRootTasks + "/" + taskId;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (task) {
                createTaskDetailsForm(
                    task.title,
                    task.content,
                    task.status,
                    task.priority,
                    task.progress,
                    task.startDate,
                    task.endDate
                );
            }
        });

        // Show the overlay and modal
        document.getElementById("overlay").style.display = "block";
        document.getElementById("taskDetailsModal").style.display = "block";

    }

    //zaladowanie formularza z szczegółami taska
    function createTaskDetailsForm(taskTitle, taskContent, taskStatus, taskPriority, taskProgress, taskStartDate, taskEndDate) {

        var taskDetailsContainer = document.getElementById("taskDetails");

        document.getElementById('taskTitleInput').value = taskTitle;
        document.getElementById('taskContentInput').value = taskContent;
        document.getElementById('taskStatusInput').value = taskStatus;
        document.getElementById('taskPriorityInput').value = taskPriority;
        document.getElementById('progressInput').value = taskProgress;
        document.getElementById('startDateInput').value = taskStartDate;
        document.getElementById('endDateInput').value = taskEndDate;

        taskDetailsContainer.appendChild(taskDetailsForm);
        taskDetailsForm.style.display = "block";
    }

    //dodawanie zadania clicker button
    $("#addTasksButton").click(function () {
        createTaskDetailsFormAdd();
    });

    function createTaskDetailsFormAdd() {

        var taskDetailsContainer = document.getElementById("taskDetails");

        taskDetailsContainer.appendChild(taskDetailsForm);
        taskDetailsForm.style.display = "block";

        // Show the overlay and modal
        document.getElementById("overlay").style.display = "block";
        document.getElementById("taskDetailsModal").style.display = "block";
    }

    //metoda wywalujaca sie w trakcie klikniecia na submit 
    $("#taskDetailsSubmit").click(function () {

        // Select the input element by its ID
        var inputTastTitle = $('#taskTitleInput');
        var inputTaskContent = $('#taskContentInput');
        var inputTaskStatus = $('#taskStatusInput');
        var inputTaskPriority = $('#taskPriorityInput');
        var inputTaskProgress = $('#progressInput');
        var inputTaskStartDate = $('#startDateInput');
        var inputTaskEndDate = $('#endDateInput');

        // Get the value of the input field
        var inputTastTitleValue = inputTastTitle.val();
        var inputTaskContentValue = inputTaskContent.val();
        var inputTaskStatusValue = inputTaskStatus.val();
        var inputTaskPriorityValue = inputTaskPriority.val();
        var inputTaskProgressValue = inputTaskProgress.val();
        var inputTaskStartDateValue = inputTaskStartDate.val();
        var inputTaskEndDateValue = inputTaskEndDate.val();


        handleTaskSubmitRequest(
            inputTastTitleValue,
            inputTaskContentValue,
            inputTaskStatusValue,
            inputTaskPriorityValue,
            inputTaskProgressValue,
            inputTaskStartDateValue,
            inputTaskEndDateValue
        );

        //odswierzenie taskow po dodaniu nowego taska
        getAllTasks();
    });

    //dodawanie lub modyfykacja taska w bazie danych
    function handleTaskSubmitRequest(textTitle, textContent, textStatus, textPriority, textProgress, textStartDate, textEndDate) {

        var taskId = window.taskId;
        var projectId = localStorage.getItem("projectId");
        console.log("this is the project id that we are adding task to: " + projectId);

        if (taskId == null) {
            $.ajax({
                url: apiRootTasks,
                method: 'POST',
                processData: false,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    title: textTitle,
                    content: textContent,
                    status: textStatus,
                    priority: textPriority,
                    progress: textProgress,
                    projectId: projectId,
                    startDate: textStartDate,
                    endDate: textEndDate
                }),
                complete: function (data) {
                    if (data.status === 200) {
                        alert("succesfully added movie to favourites");
                    }
                }
            });
        } else {
            $.ajax({
                url: apiRootTasks,
                method: 'PUT',
                processData: false,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    id: taskId,
                    title: textTitle,
                    content: textContent,
                    status: textStatus,
                    priority: textPriority,
                    progress: textProgress,
                    projectId: projectId,
                    startDate: textStartDate,
                    endDate: textEndDate
                }),
                complete: function (data) {
                    if (data.status === 200) {
                        alert("succesfully added movie to favourites");
                    }
                }
            });
        }
    }

    //dodawanie zadania clicker button
    $("#projectsButton").click(function () {
        window.location.href = "create_project_page.html";
    });

    $("#closeDetailsButtonId").click(function () {
        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("taskDetailsModal").style.display = "none";
    });
});


// function closeTaskDetails() {
//     // Hide the overlay and modal
//     document.getElementById("overlay").style.display = "none";
//     document.getElementById("taskDetailsModal").style.display = "none";
// }