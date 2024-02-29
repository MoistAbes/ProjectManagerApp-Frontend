$(document).ready(function () {

    var apiRootTasks = 'http://localhost:8081/tasks';
    var apiRootProjects = 'http://localhost:8081/projects';
    var apiRootUsers = 'http://localhost:8081/users';
    var apiRootSections = 'http://localhost:8081/sections';



    const container = document.querySelector('#mainContainer');
    const usersButton = document.querySelector('#userButton');



    loadProjectSections();


    function loadProjectTitle(project) {
        const projectTitleText = document.querySelector('#projectTitleId');
        projectTitleText.textContent = project.title;
    }

    function loadProjectSections() {
        var projectId = localStorage.getItem("projectId");
        var requestUrl = apiRootSections + "/project/" + projectId;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (sections) {
                sections.forEach(section => {
                    console.log("section: " + section.name + " " + section.id);
                    addSection(section.name, section.id);
                });
                getAllTasks();
            }
        });

    }

    function addSection(name, id) {
        var newSection = document.createElement("div");

        var testSectionTitle = document.createElement("p");
        testSectionTitle.textContent = name;
        testSectionTitle.classList.add("centered-paragraph");

        //newSection.textContent = name;
        newSection.setAttribute("sectionName", name);
        newSection.setAttribute("sectionId", id);
        newSection.classList.add("taskContainer");

        newSection.appendChild(testSectionTitle);

        container.appendChild(newSection);
    }

    //dodawanie przedziału clicker button
    $("#addSectionButton").click(function () {
        createSectionDetailsFormAdd();
    });

    //Przejscie do strony z analityka
    $("#analiticsButton").click(function () {
        window.location.href = "analitics.html";
    });


    //Delete sekcji button clicker
    $("#deleteSectionButtonId").click(function () {
        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("sectionDetailsModal").style.display = "none";
        sectionId = window.sectionId;
        removeSection(sectionId);
        var section = document.querySelector('[sectionid="' + sectionId + '"]');
        section.remove();

        window.sectionId = 0;

    });

    function removeSection(sectionId) {
        //console.log("Section id")
        const requestUrl = apiRootSections + "/" + sectionId;
        $.ajax({
            url: requestUrl,
            method: 'DELETE',
            contentType: "application/json",
            success: function () {

            }
        });

    }


    function createSectionDetailsFormAdd() {

        var taskDetailsContainer = document.getElementById("sectionDetails");

        taskDetailsContainer.appendChild(sectionDetailsForm);
        sectionDetailsForm.style.display = "block";

        document.getElementById("overlay").style.display = "block";
        document.getElementById("sectionDetailsModal").style.display = "block";


        document.getElementById("deleteSectionButtonId").style.display = "none";

    }
    function createSectionDetailsFormEdit(sectionTitle) {

        var taskDetailsContainer = document.getElementById("sectionDetails");
        console.log("Section title: " + sectionTitle);
        document.getElementById("sectionTitleInputId").value = sectionTitle;



        taskDetailsContainer.appendChild(sectionDetailsForm);
        sectionDetailsForm.style.display = "block";

        // Show the overlay and modal
        document.getElementById("overlay").style.display = "block";
        document.getElementById("sectionDetailsModal").style.display = "block";
        document.getElementById("deleteSectionButtonId").style.display = "block";

    }

    $("#sectionDetailsSubmit").click(function () {

        var inputSectionName = $('#sectionTitleInputId');
        var inputSectionValue = inputSectionName.val();

        var sectionId = window.sectionId;

        var projectId = localStorage.getItem("projectId");

        $.ajax({
            url: apiRootSections,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                id: sectionId,
                name: inputSectionValue,
                projectId: projectId,
            }),
            complete: function (data) {
                if (data.status === 200) {
                    alert("succesfully added movie to favourites");
                }
            }
        });
        addSection(inputSectionName.val());
    });





    //pobranie wszystkich taskow projektu z bazy danych
    function getAllTasks() {
        //await loadProjectSections();

        var projectId = localStorage.getItem("projectId");
        const requestUrl = apiRootTasks + "/project" + "/" + projectId;

        $.ajax({
            url: apiRootProjects + "/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: loadProjectTitle
        });

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (tasks) {
                tasks.forEach(task => {
                    console.log("task: " + task.title + " " + task.sectionId + " " + task.id);
                    loadTask(task.title, task.sectionId, task.id);
                });
            }
        });
    }

    //dodanie taska do konkretnej fazy
    function loadTask(taskTitle, taskSectionId, taskId) {
        const newTaskDiv = document.createElement('div');
        //const newButtonRemove = document.createElement('button');

        newTaskDiv.innerHTML = taskTitle;
        //newButtonRemove.innerHTML = "Remove";

        newTaskDiv.classList.add("task");
        //newButtonRemove.classList.add("closeButton");
        newTaskDiv.setAttribute("taskId", taskId);
        //newTaskDiv.appendChild(newButtonRemove);
        container.appendChild(newTaskDiv);

        var selector = '[sectionid ="' + taskSectionId + '"]';
        var test = document.querySelector(selector);
        console.log("SELECTOR: " + selector);
        console.log("SECTION ID: " + taskSectionId);
        console.log("CO JEST W TEST: " + test);
        test.append(newTaskDiv);
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

    // Click handler for entire DIV container
    container.addEventListener('click', function (e) {
        if (e.target.classList.contains('taskContainer')) {
            let sectionId = e.target.getAttribute("sectionid");
            window.sectionId = sectionId;
            console.log("Section id: " + sectionId);
            showSectionDetails(sectionId);
        }
    });

    // Remove task clickListener
    container.addEventListener('click', function (e) {
        // But only alert for elements that have an alert-button class
        if (e.target.classList.contains('closeButton')) {
            var parentElement = e.target.parentNode;
            let taskId = parentElement.getAttribute("taskId");

            // Storing a global variable
            window.taskId = taskId;
            parentElement.remove();
            removeTask(taskId);
        }
    });

    function removeTask(taskId) {
        const requestUrl = apiRootTasks + "/" + taskId;
        $.ajax({
            url: requestUrl,
            method: 'DELETE',
            contentType: "application/json",
            success: function () {

            }
        });
    }


    function showSectionDetails(sectionId) {
        const requestUrl = apiRootSections + "/" + sectionId;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (section) {
                createSectionDetailsFormEdit(section.name);
            }
        });

        // Show the overlay and modal
        // document.getElementById("overlay").style.display = "block";
        // document.getElementById("taskDetailsModal").style.display = "block";
    }

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
        document.getElementById("taskDetailsModal").style.display = "block";

        //show delete task button
        document.getElementById("deleteTaskButtonId").style.display = "block";


        $.ajax({
            url: apiRootTasks + "/" + taskId,
            method: 'GET',
            contentType: "application/json",
            success: retrieveData
        });
        $.ajax({
            url: apiRootTasks + "/" + taskId,
            method: 'GET',
            contentType: "application/json",
            success: retrieveTaskData
        });

    }


    //zaladowanie formularza z szczegółami taska
    function createTaskDetailsForm(taskTitle, taskContent, taskSection, taskPriority, taskProgress, taskStartDate, taskEndDate, taskDependencies) {

        var projectId = localStorage.getItem("projectId");
        var requestUrl = apiRootSections + "/project/" + projectId;

        var section = document.querySelector('[sectionid="' + taskSection + '"]');
        var sectionName = section.getAttribute('sectionname');
        console.log(sectionName);
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
        document.getElementById("taskStatusInput").value = sectionName;
        document.getElementById('taskPriorityInput').value = taskPriority;
        document.getElementById('progressInput').value = taskProgress;
        document.getElementById('startDateInput').value = taskStartDate;
        document.getElementById('endDateInput').value = taskEndDate;


        window.taskDependencies = taskDependencies;

        taskDetailsContainer.appendChild(taskDetailsForm);
        taskDetailsForm.style.display = "block";

        //show users and dependent task lists
        document.getElementById('userDiv').style.display = "block";
        document.getElementById('tasksDiv').style.display = "block";
    }

    //dodawanie zadania clicker button
    $("#addTasksButton").click(function () {
        createTaskDetailsFormAdd();
    });

    function createTaskDetailsFormAdd() {

        var projectId = localStorage.getItem("projectId");
        var requestUrl = apiRootSections + "/project/" + projectId;

        var taskDetailsContainer = document.getElementById("taskDetails");
        var taskStatusInput = document.getElementById("taskStatusInput");


        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (sections) {
                sections.forEach(section => {
                    var newOption = document.createElement("option");
                    newOption.textContent = section.name;
                    taskStatusInput.appendChild(newOption);
                });
            }
        });




        taskDetailsContainer.appendChild(taskDetailsForm);
        taskDetailsForm.style.display = "block";

        //hide users and other tasks
        document.getElementById("userDiv").style.display = "none";
        document.getElementById("tasksDiv").style.display = "none";

        //hide delete task button
        document.getElementById("deleteTaskButtonId").style.display = "none";

        // Show the overlay and modal
        document.getElementById("overlay").style.display = "block";
        document.getElementById("taskDetailsModal").style.display = "block";
    }


    //metoda wywalujaca sie w trakcie klikniecia na submit 
    $("#taskDetailsSubmit").click(function () {

        // Get the <ul> element
        var ulElement = document.getElementById("assignedUsersList");
        var ulTasksElement = document.getElementById("dependentTaskList");

        // Get all <li> elements within the <ul>
        var listItems = ulElement.getElementsByTagName("li");
        var users = [];
        var taskListItems = document.querySelectorAll("#dependentTaskList li");
        var tasks = [];

        // Iterate through the <li> elements
        for (var i = 0; i < listItems.length; i++) {
            // Access the content of each <li>
            var listItemContent = listItems[i].innerHTML;
            var listItemAtr = listItems[i].getAttribute("userId");


            users.push(listItemAtr);
        }
        // Iterate through the <li> elements
        for (var i = 0; i < taskListItems.length; i++) {
            // Access the content of each <li>
            var listItemContent = taskListItems[i].innerHTML;
            var listItemAtr = taskListItems[i].getAttribute("taskId");


            tasks.push(listItemAtr);
        }


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

        //get section id
        var section = document.querySelector('[sectionname="' + inputTaskStatusValue + '"]');
        var sectionId = section.getAttribute('sectionid');

        console.log("Section id: " + sectionId);



        //? nie wiem co to
        var dependentTasks = window.taskDependencies;


        handleTaskSubmitRequest(
            inputTastTitleValue,
            inputTaskContentValue,
            sectionId,
            inputTaskPriorityValue,
            inputTaskProgressValue,
            inputTaskStartDateValue,
            inputTaskEndDateValue,
            users,
            tasks
        );

        //resetujemy zapisany task id i calego forma
        window.taskId = 0;
        inputTastTitle.val('');
        inputTaskContent.val('');

        //odswierzenie taskow po dodaniu nowego taska
        getAllTasks();
    });

    //dodawanie lub modyfykacja taska w bazie danych
    function handleTaskSubmitRequest(textTitle, textContent, textSectionId, textPriority, textProgress, textStartDate, textEndDate, usersArray, taskDependencies) {

        var taskId = window.taskId;
        var projectId = localStorage.getItem("projectId");

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
                    sectionId: textSectionId,
                    priority: textPriority,
                    progress: textProgress,
                    projectId: projectId,
                    startDate: textStartDate,
                    endDate: textEndDate,
                    users: usersArray,
                    dependentTasks: taskDependencies
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
                    sectionId: textSectionId,
                    priority: textPriority,
                    progress: textProgress,
                    projectId: projectId,
                    startDate: textStartDate,
                    endDate: textEndDate,
                    users: usersArray,
                    dependentTasks: taskDependencies

                }),
                complete: function (data) {
                    if (data.status === 200) {
                        alert("succesfully added movie to favourites");
                    }
                }
            });
        }
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

    $("#membersButton").click(function () {
        window.location.href = "members.html";
    });

    $('#deleteTaskButtonId').click(function () {
        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("taskDetailsModal").style.display = "none";

        deleteTask();

    }
    );


    function deleteTask() {
        //console.log("Section id")
        var taskId = window.taskId;
        var taskItem = document.querySelector('[taskid="' + taskId + '"]');
        taskItem.remove();
        const requestUrl = apiRootTasks + "/" + taskId;
        $.ajax({
            url: requestUrl,
            method: 'DELETE',
            contentType: "application/json",
            success: function () {

            }
        });
    }


    $("#closeDetailsButtonId").click(function () {

        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("taskDetailsModal").style.display = "none";

        const unassignedList = document.getElementById("unassignedUsersList");
        const assignedList = document.getElementById("assignedUsersList");
        const notDependentTaskList = document.getElementById("notDependentTaskList");
        const dependentTaskList = document.getElementById("dependentTaskList");


        //empty user lists after closing task details window
        unassignedList.innerHTML = "";
        assignedList.innerHTML = "";
        //empty taskDependant lists after closing task details window
        notDependentTaskList.innerHTML = "";
        dependentTaskList.innerHTML = "";

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

    $("#closeSectionDetailsButtonId").click(function () {

        // Hide the overlay and modal
        sectionTitleInputId;
        document.getElementById("sectionTitleInputId").value = "";


        document.getElementById("overlay").style.display = "none";
        document.getElementById("sectionDetailsModal").style.display = "none";

    });

    $("#closeDetailsButtonId").click(function () {

        //var inputTastStatus = $('#taskStatusInput');

        while (document.getElementById("taskStatusInput").options.length > 0) {
            document.getElementById("taskStatusInput").remove(0);
        }


        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("sectionDetailsModal").style.display = "none";

    });




    function retrieveData(task) {

        const unassignedList = document.getElementById("unassignedUsersList");
        const assignedList = document.getElementById("assignedUsersList");

        const requestUrl = apiRootUsers;
        var usersList = [];

        var allUsersId = [];
        var taskUsersId = task.users;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (users) {
                users.forEach(user => {
                    const savedUser = {};
                    savedUser.id = user.id;
                    savedUser.name = user.name;
                    savedUser.surname = user.surname;
                    usersList.push(savedUser);

                    allUsersId.push(user.id);
                });

                let difference = allUsersId.filter(x => !taskUsersId.includes(x));

                //Initialize the original list with buttons
                for (let i = 0; i < usersList.length; i++) {

                    //set up user button
                    const userButton = document.createElement("button");
                    userButton.setAttribute("userId", usersList[i].id);
                    userButton.classList.add("taskListItem");
                    userButton.textContent = usersList[i].name + " " + usersList[i].surname;

                    //check if user is assigned to task
                    if (taskUsersId.includes(usersList[i].id)) {
                        userButton.onclick = () => removeUserFromTask(usersList[i].name + " " + usersList[i].surname, usersList[i].id);

                        //create list item for user
                        const userLi = document.createElement("li");
                        userLi.setAttribute("userId", usersList[i].id);
                        userLi.appendChild(userButton);

                        assignedList.appendChild(userLi);

                    } else {
                        userButton.onclick = () => addUserToTask(usersList[i].name + " " + usersList[i].surname, usersList[i].id, usersList[i].id);

                        //create list item for user
                        const userLi = document.createElement("li");
                        userLi.setAttribute("userId", usersList[i].id);
                        userLi.appendChild(userButton);

                        unassignedList.appendChild(userLi);

                    }
                }
            }
        });
    }


    // Function to move a button from the original list to the new list
    function addUserToTask(buttonText, userId) {
        const unassignedList = document.getElementById("unassignedUsersList");
        const assignedList = document.getElementById("assignedUsersList");

        // Find the button in the original list
        const buttonToRemove = Array.from(
            unassignedList.querySelectorAll("button")
        ).find((button) => button.textContent === buttonText);

        if (buttonToRemove) {
            // Remove the button from the original list
            unassignedList.removeChild(buttonToRemove.parentNode);

            // Create a new button with the same text in the new list
            const newButton = document.createElement("button");
            newButton.textContent = buttonText;
            newButton.setAttribute("userId", userId);
            newButton.classList.add("taskListItem");
            newButton.onclick = () => removeUserFromTask(buttonText, userId);

            // Create a new list item and append the new button to the new list
            const li = document.createElement("li");
            li.setAttribute("userId", userId);
            li.appendChild(newButton);
            assignedList.appendChild(li);
        }
    }

    // Function to move a button back from the new list to the original list
    function removeUserFromTask(buttonText, userId) {
        const unassignedList = document.getElementById("unassignedUsersList");
        const assignedList = document.getElementById("assignedUsersList");

        // Find the button in the new list
        const buttonToRemove = Array.from(
            assignedList.querySelectorAll("button")
        ).find((button) => button.textContent === buttonText);

        if (buttonToRemove) {
            // Remove the button from the new list
            assignedList.removeChild(buttonToRemove.parentNode);

            // Create a new button with the same text in the original list
            const newButton = document.createElement("button");
            newButton.textContent = buttonText;
            newButton.setAttribute("userId", userId);
            newButton.classList.add("taskListItem");
            newButton.onclick = () => addUserToTask(buttonText, userId);

            // Create a new list item and append the new button to the original list
            const li = document.createElement("li");
            li.setAttribute("userId", userId);
            li.appendChild(newButton);
            unassignedList.appendChild(li);
        }
    }


    function retrieveTaskData(task) {

        const notDependentTasksList = document.getElementById("notDependentTaskList");
        const dependentTasksList = document.getElementById("dependentTaskList");


        const requestUrl = apiRootTasks;
        //tasks objects
        let taskList = [];
        //tasks id
        let allTasksId = [];
        var projectId = localStorage.getItem("projectId");



        $.ajax({
            url: requestUrl + "/project/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: function (tasks) {
                tasks.forEach(task => {
                    const savedTask = {};
                    savedTask.id = task.id;
                    savedTask.title = task.title;
                    taskList.push(savedTask);

                    allTasksId.push(task.id);
                });


                //Initialize the original list with buttons
                for (let i = 0; i < taskList.length; i++) {

                    //set up user button
                    const taskButton = document.createElement("button");
                    taskButton.setAttribute("taskId", taskList[i].id);
                    taskButton.textContent = taskList[i].title;
                    taskButton.classList.add("taskListItem");

                    //check if user is assigned to task
                    if (task.dependentTasks.includes(allTasksId[i])) {
                        taskButton.onclick = () => removeFromTaskDependent(taskList[i].title, taskList[i].id);

                        //create list item for user
                        const taskLi = document.createElement("li");
                        taskLi.setAttribute("taskId", taskList[i].id);
                        taskLi.appendChild(taskButton);

                        dependentTasksList.appendChild(taskLi);

                    } else {
                        taskButton.onclick = () => addToTaskDependent(taskList[i].title, taskList[i].id);

                        //create list item for user
                        const taskLi = document.createElement("li");
                        taskLi.setAttribute("taskId", taskList[i].id);
                        taskLi.appendChild(taskButton);

                        notDependentTasksList.appendChild(taskLi);

                    }
                }
            }
        });
    }


    // Function to move a button from the original list to the new list
    function addToTaskDependent(buttonText, taskId) {
        const notDependentTasksList = document.getElementById("notDependentTaskList");
        const dependentTasksList = document.getElementById("dependentTaskList");

        // Find the button in the original list
        const buttonToRemove = Array.from(
            notDependentTasksList.querySelectorAll("button")
        ).find((button) => button.textContent === buttonText);

        if (buttonToRemove) {
            // Remove the button from the original list
            notDependentTasksList.removeChild(buttonToRemove.parentNode);

            // Create a new button with the same text in the new list
            const newButton = document.createElement("button");
            newButton.textContent = buttonText;
            newButton.setAttribute("taskId", taskId);
            newButton.classList.add("taskListItem");
            newButton.onclick = () => removeFromTaskDependent(buttonText, taskId);

            // Create a new list item and append the new button to the new list
            const li = document.createElement("li");
            li.setAttribute("taskId", taskId);
            li.appendChild(newButton);
            dependentTasksList.appendChild(li);
        }
    }

    // Function to move a button back from the new list to the original list
    function removeFromTaskDependent(buttonText, taskId) {
        const notDependentTasksList = document.getElementById("notDependentTaskList");
        const dependentTasksList = document.getElementById("dependentTaskList");

        // Find the button in the new list
        const buttonToRemove = Array.from(
            dependentTasksList.querySelectorAll("button")
        ).find((button) => button.textContent === buttonText);

        if (buttonToRemove) {
            // Remove the button from the new list
            dependentTasksList.removeChild(buttonToRemove.parentNode);

            // Create a new button with the same text in the original list
            const newButton = document.createElement("button");
            newButton.textContent = buttonText;
            newButton.setAttribute("taskId", taskId);
            newButton.classList.add("taskListItem");
            newButton.onclick = () => addToTaskDependent(buttonText, taskId);

            // Create a new list item and append the new button to the original list
            const li = document.createElement("li");
            li.setAttribute("taskId", taskId);
            li.appendChild(newButton);
            notDependentTasksList.appendChild(li);
        }
    }


});

