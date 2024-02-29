$(document).ready(function () {

    const PROJECT_ID = localStorage.getItem("projectId");


    var apiRootTasks = 'http://localhost:8081/tasks';
    var apiRootProjects = "http://localhost:8081/projects";


    loadProject();
    loadTasks();



    function tasksIdToString(tasks) {

        let resultList = [];

        for (let i = 0; i < tasks.length; i++) {
            resultList.push(tasks[i].toString());
        }

        return resultList;
    }

    function retrievedTasks(tasks) {

        let chartTasksList = [];

        for (let i = 0; i < tasks.length; i++) {
            const task = {};
            task.id = tasks[i].id.toString();
            task.name = tasks[i].title;
            task.priority = tasks[i].priority;
            task.start = tasks[i].startDate;
            task.end = tasks[i].endDate;
            task.progress = tasks[i].progress;
            task.dependencies = tasksIdToString(tasks[i].dependentTasks);


            const myJSON = JSON.stringify(task);

            console.log("task number: " + i + " " + myJSON);

            chartTasksList.push(task);
        }

        let gantt = new Gantt("#gantt", chartTasksList, {
            on_view_change: function (mode) {
                //document.getElementById("current-timescale").innerText = mode;
            }, custom_popup_html: function (task) {
                return `<div class="details-container">
            <h5>${task.name}</h5>
            <p>Rozpoczęcie: ${task.start}</p>
            <p>Zakończenie: ${task.end}</p>
            <p>Priorytet: ${task.priority}</p>
            <p>${task.progress}% ukończenia</p>
          </div>`;
            }

        });


        var selectElement = document.getElementById('viewMode');

        // Attach an event listener for the 'change' event
        selectElement.addEventListener('change', function () {
            // Call your onOptionChange function or execute code here
            var selectedOption = selectElement.value;
            console.log('Selected Option:', selectedOption);

            var selectedMode = document.getElementById('viewMode').value;


            // Update chart data based on the selected view mode
            if (selectedMode === 'day') {
                gantt.change_view_mode("Day");
            } else if (selectedMode === 'week') {
                gantt.change_view_mode("Week");
            } else if (selectedMode === 'month') {
                gantt.change_view_mode("Month");
            }
        });


    }



    // function changeViewMode() {
    //     var selectedMode = document.getElementById('viewMode').value;

    //     // Update chart data based on the selected view mode
    //     if (selectedMode === 'day') {
    //         ganttChart.change_view_mode("Day");
    //     } else if (selectedMode === 'week') {
    //         ganttChart.change_view_mode("Week");
    //     } else if (selectedMode === 'month') {
    //         ganttChart.change_view_mode("Month");
    //     }

    //     // Update the chart
    //     //myChart.update();
    // }


    function loadTasks() {
        console.log("project id: " + PROJECT_ID);
        const requestUrl = apiRootTasks + "/project" + "/" + PROJECT_ID;


        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: retrievedTasks
        });
    }

    //pobranie wszystkich taskow projektu z bazy danych
    function loadProject() {

        console.log("project id load project title: " + PROJECT_ID);


        $.ajax({
            url: apiRootProjects + "/" + PROJECT_ID,
            method: 'GET',
            contentType: "application/json",
            success: loadProjectTitle
        });
    }

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