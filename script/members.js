$(document).ready(function () {
    const PROJECT_ID = localStorage.getItem("projectId");
    const container = document.querySelector('#mainContainer');
    const apiRootTasks = 'http://localhost:8081/tasks';
    const apiRootProjects = "http://localhost:8081/projects";
    const apiRootUsers = "http://localhost:8081/users";
    var apiRootSections = 'http://localhost:8081/sections';




    loadProject();
    loadUsers();
    getAllTasks();



    //pobranie wszystkich taskow projektu z bazy danych
    function getAllTasks() {

        const requestUrl = apiRootTasks + "/project" + "/" + PROJECT_ID;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (tasks) {
                tasks.forEach(task => {
                    loadTask(task);
                });
                calculateTasksStatus(tasks);
            }
        });
    }

    //dodanie taska do konkretnej fazy
    function loadTask(task) {
        //const container = document.querySelector('#mainContainer');

        for (var i = 0; i < task.users.length; i++) {
            const newTaskDiv = document.createElement('div');
            newTaskDiv.innerHTML = task.title;
            newTaskDiv.classList.add("task");
            newTaskDiv.setAttribute("taskId", task.id);

            container.appendChild(newTaskDiv);

            var section = document.querySelector('[sectionId="' + task.users[i] + '"]');
            // console.log("USER IN TASK: " + task.id + " USER ID: " + task.users[i]);
            section.append(newTaskDiv);
        }
    }

    function calculateTasksStatus(tasks) {

        var elementsByAttribute = document.querySelectorAll('[class="taskContainer"]');

        for (var i = 0; i < elementsByAttribute.length; i++) {
            console.log("Aktualny user: " + elementsByAttribute[i].getAttribute("sectionId"));
            var userIdText = elementsByAttribute[i].getAttribute("sectionId");
            var userId = Number(userIdText);

            //get specific user buttons
            var buttonNotStarted = document.querySelector('[id="buttonNotStarted' + userId + '"]');
            var buttonInProgress = document.querySelector('[id="buttonInProgress' + userId + '"]');
            var buttonFinished = document.querySelector('[id="buttonFinished' + userId + '"]');
            var buttonDeadline = document.querySelector('[id="buttonDeadline' + userId + '"]');

            var data = getTaskStatusForUser(tasks, userId);
            console.log("DATA: " + data);
            //setting text
            buttonNotStarted.textContent = "Nierozpoczęte: " + data[0];
            buttonInProgress.textContent = "W trakcie: " + data[1];
            buttonFinished.textContent = "Ukończone: " + data[2];
            buttonDeadline.textContent = "Po terminie: " + data[3];
        }
    }

    function getTaskStatusForUser(tasks, userId) {

        let notStarted = 0;
        let inProgress = 0;
        let afterDeadline = 0;
        let finished = 0;

        let data = [0, 0, 0, 0];

        var currentDate = new Date();


        for (var task of tasks) {
            if (task.users.includes(userId)) {
                var endDate = new Date(task.endDate);

                if (endDate < currentDate && task.progress != 100) {
                    afterDeadline += 1;
                } else {
                    if (task.progress == 0) {
                        notStarted += 1;
                    } else if (task.progress > 0 && task.progress != 100) {
                        inProgress += 1;
                    } else if (task.progress == 100) {
                        finished += 1;
                    }
                }
            }
        }


        data[0] = notStarted;
        data[1] = inProgress;
        data[2] = finished;
        data[3] = afterDeadline;


        return data;
    }

    function loadUsers() {
        const requestUrl = apiRootUsers;

        $.ajax({
            url: requestUrl + "/project/" + PROJECT_ID,
            method: 'GET',
            contentType: "application/json",
            success: function (users) {
                users.forEach(user => {
                    const savedUser = {};
                    savedUser.id = user.id;
                    savedUser.name = user.name;
                    savedUser.surname = user.surname;
                    //console.log("USER: " + savedUser);
                    createUserSection(savedUser);

                });
            }
        });
    }

    function createUserSection(user) {
        const container = document.querySelector('#mainContainer');
        var newSection = document.createElement("div");

        var testSectionTitle = document.createElement("p");
        testSectionTitle.textContent = user.name + " " + user.surname;
        testSectionTitle.classList.add("centered-paragraph");

        //create div container holding buttons
        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("buttonContainer");
        var topButtons = document.createElement("div");
        var botButtons = document.createElement("div");
        topButtons.classList.add("topButtons");
        botButtons.classList.add("bottomButtons");


        buttonContainer.appendChild(topButtons);
        buttonContainer.appendChild(botButtons);

        //create 4 button with task status info
        var newButtonNotStarted = document.createElement("button");
        var newButtonInProgress = document.createElement("button");
        var newButtonFinished = document.createElement("button");
        var newButtonDeadline = document.createElement("button");

        //addint class
        newButtonNotStarted.classList.add("userTasksStatusButton");
        newButtonInProgress.classList.add("userTasksStatusButton");
        newButtonFinished.classList.add("userTasksStatusButton");
        newButtonDeadline.classList.add("userTasksStatusButton");

        //adding id attribute
        newButtonNotStarted.setAttribute("id", "buttonNotStarted" + user.id);
        newButtonInProgress.setAttribute("id", "buttonInProgress" + user.id);
        newButtonFinished.setAttribute("id", "buttonFinished" + user.id);
        newButtonDeadline.setAttribute("id", "buttonDeadline" + user.id);

        //setting text
        newButtonNotStarted.textContent = "Nierozpoczęte: " + 0;
        newButtonInProgress.textContent = "W trakcie: " + 0;
        newButtonFinished.textContent = "Ukończone: " + 0;
        newButtonDeadline.textContent = "Po terminie: " + 0;

        topButtons.appendChild(newButtonNotStarted);
        topButtons.appendChild(newButtonInProgress);
        botButtons.appendChild(newButtonFinished);
        botButtons.appendChild(newButtonDeadline);


        //newSection.textContent = name;
        newSection.setAttribute("sectionName", user.name + " " + user.surname);
        newSection.setAttribute("sectionId", user.id);
        newSection.classList.add("taskContainer");

        newSection.appendChild(testSectionTitle);
        newSection.appendChild(buttonContainer);


        container.appendChild(newSection);
    }

    //pobranie wszystkich taskow projektu z bazy danych
    function loadProject() {
        //console.log("project id load project title: " + PROJECT_ID);
        $.ajax({
            url: apiRootProjects + "/" + PROJECT_ID,
            method: 'GET',
            contentType: "application/json",
            success: loadProjectTitle
        });
    }



    // Click handler for entire DIV container
    container.addEventListener('click', function (e) {
        if (e.target.classList.contains('task')) {
            let taskId = e.target.getAttribute("taskId");
            //console.log("DZIEJE SIE TO");
            window.taskId = taskId;
            showTaskDetails(taskId);
        }
    });

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
                    task.sectionId,
                    task.priority,
                    task.progress,
                    task.startDate,
                    task.endDate,
                    task.dependentTasks
                );
            }
        });

        // Show the overlay and modal
        document.getElementById("overlay").style.display = "block";
        document.getElementById("taskDetailsModal").style.display = "block"
    }

    //zaladowanie formularza z szczegółami taska
    function createTaskDetailsForm(taskTitle, taskContent, taskSection, taskPriority, taskProgress, taskStartDate, taskEndDate, taskDependencies) {

        var projectId = localStorage.getItem("projectId");
        var requestUrl = apiRootSections + "/project/" + projectId;
        var sectionUrl = apiRootSections + "/" + taskSection;

        //get section for task
        $.ajax({
            url: sectionUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (section) {
                document.getElementById("taskStatusInput").value = section.name;
            }
        });

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (sections) {
                sections.forEach(section => {
                    var newOption = document.createElement("option");
                    newOption.textContent = section.name;
                    newOption.value = section.name;
                    taskStatusInput.appendChild(newOption);
                });
            }
        });

        var taskDetailsContainer = document.getElementById("taskDetails");

        document.getElementById('taskTitleInput').value = taskTitle;
        document.getElementById('taskContentInput').value = taskContent;
        document.getElementById('taskPriorityInput').value = taskPriority;
        document.getElementById('progressInput').value = taskProgress;
        document.getElementById('startDateInput').value = taskStartDate;
        document.getElementById('endDateInput').value = taskEndDate;

        taskDetailsContainer.appendChild(taskDetailsForm);
        taskDetailsForm.style.display = "block";
    }

    $("#closeDetailsButtonId").click(function () {

        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("taskDetailsModal").style.display = "none";

        var inputTastTitle = $('#taskTitleInput');
        var inputTaskContent = $('#taskContentInput');
        var inputTaskStatus = $('#taskStatusInput');
        var inputTaskPriority = $('#taskPriorityInput');
        var inputTaskProgress = $('#progressInput');
        var inputTaskStartDate = $('#startDateInput');
        var inputTaskEndDate = $('#endDateInput');

        inputTastTitle.val('');
        inputTaskContent.val('');
        inputTaskStatus.val('');
        inputTaskPriority.val('');
        inputTaskProgress.val('');
        inputTaskStartDate.val('');
        inputTaskEndDate.val('');

        window.taskId = 0;

    });

    function loadProjectTitle(project) {
        const projectTitleText = document.querySelector('#projectTitleId');
        projectTitleText.textContent = project.title;
    }
    //przejscie do wybierania/tworzenia projektu clicker
    $("#projectsButton").click(function () {
        window.location.href = "create_project_page.html";
    });
    //przejscie do wykresow projektu clicker
    $("#chartsButton").click(function () {
        window.location.href = "charts.html";
    });
    $("#boardButton").click(function () {
        window.location.href = "tasks.html";
    });
    $("#analiticsButton").click(function () {
        window.location.href = "analitics.html";
    });
    $("#membersButton").click(function () {
        window.location.href = "members.html";
    });

});
