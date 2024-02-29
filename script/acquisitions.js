$(document).ready(function () {

    const PROJECT_ID = localStorage.getItem("projectId");


    var apiRootTasks = 'http://localhost:8081/tasks';
    var apiRootSection = 'http://localhost:8081/sections';
    var apiRootUsers = 'http://localhost:8081/users';
    var apiRootProjects = 'http://localhost:8081/projects';




    loadProject();
    loadTasksInfo();
    loadSectionInfo();
    loadUsersByProjectIdInfo();

    function loadSectionInfo() {
        let sectionListInfo = [];
        let requestUrl = apiRootSection;
        var projectId = localStorage.getItem("projectId");

        $.ajax({
            url: requestUrl + "/project/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: function (sections) {
                sections.forEach(section => {
                    var sectionObject = {};
                    sectionObject.id = section.id;
                    sectionObject.name = section.name;
                    sectionListInfo.push(sectionObject);
                });
                //console.log("SECTIONS: " + sectionListInfo);
                //tutaj musze jeszcze info o taskach zdobyc
                loadTasksWithSectionsInfo(sectionListInfo);
            }
        });
    }

    function loadTasksWithSectionsInfo(sectionData) {

        let taskListInfo = [];
        let requestUrl = apiRootTasks;
        var projectId = localStorage.getItem("projectId");

        //console.log("PROJECT ID: " + projectId);

        $.ajax({
            url: requestUrl + "/project/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: function (tasks) {
                tasks.forEach(task => {
                    const savedTask = {};
                    savedTask.progress = task.progress;
                    savedTask.startDate = task.startDate;
                    savedTask.endDate = task.endDate;
                    savedTask.sectionId = task.sectionId;
                    taskListInfo.push(savedTask);
                });
                //console.log(taskListInfo[0].status);
                loadSectionGraph(taskListInfo, sectionData);
            }
        });
    }

    function loadSectionGraph(taskData, sectionData) {

        //we need to set up testData
        let testData = setUpSectionChartData(taskData, sectionData);
        const labels = testData.sections;

        var myChart = new Chart(
            document.getElementById('sectionChartId'),
            {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Nierozpoczęte',
                            data: testData.taskData[0],
                            backgroundColor: [
                                'rgba(184, 182, 182, 0.5)', // Color for "W toku zolte"

                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'W toku',
                            data: testData.taskData[1],
                            backgroundColor: [
                                'rgba(22, 22, 245, 0.5)'  // Color for "Ukończone niebieskie"

                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Po terminie',
                            data: testData.taskData[2],
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.5)', // Color for "nierozpoczęte czerwone"

                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Ukończone',
                            data: testData.taskData[3],
                            backgroundColor: [
                                'rgba(60, 214, 26, 0.5)', // Color for "Po terminie zielone"

                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            // display: true,
                            // text: 'Chart.js Bar Chart - Stacked'
                        },
                    },
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true
                        }
                    }
                }
            }
        );

    }

    function setUpSectionChartData(taskData, sectionData) {


        console.log("TASK DATA");
        taskData.forEach(function (task) {
            console.log('Progress:', task.progress, 'startData:', task.startDate, 'endDate:', task.endDate, "sectionId: " + task.sectionId);
        });

        console.log("SECTION DATA");
        sectionData.forEach(function (section) {
            console.log('Section name:', section.name, 'section Id:', section.id);
        });

        let tasksInSectionNotStartedCount = [];
        let tasksInSectionInProgressCount = [];
        let tasksInSectionAfterDeadlineCount = [];
        let tasksInSectionCompletedCount = [];

        for (var i = 0; i < sectionData.length; i++) {
            tasksInSectionNotStartedCount.push(0);
            tasksInSectionInProgressCount.push(0);
            tasksInSectionAfterDeadlineCount.push(0);
            tasksInSectionCompletedCount.push(0);
        }

        var currentDate = new Date();

        for (var i = 0; i < taskData.length; i++) {
            for (var j = 0; j < sectionData.length; j++) {
                if (taskData[i].sectionId == sectionData[j].id) {
                    var endDate = new Date(taskData[i].endDate);

                    if (endDate < currentDate && taskData[i].progress != 100) {
                        tasksInSectionAfterDeadlineCount[j] += 1;
                    } else {
                        if (taskData[i].progress == 0) {
                            tasksInSectionNotStartedCount[j] += 1;
                        } else if (taskData[i].progress > 0 && taskData[i].progress != 100) {
                            tasksInSectionInProgressCount[j] += 1;
                        } else if (taskData[i].progress == 100) {
                            tasksInSectionCompletedCount[j] += 1;
                        }
                    }
                }
            }

        }

        let test = [];

        for (var i = 0; i < sectionData.length; i++) {
            test.push(sectionData[i].name);
        }

        console.log("SECTION NAMES: " + test);


        // console.log("ARRAYS DATA NOT STARTED: " + tasksInSectionNotStartedCount);
        // console.log("ARRAYS DATA IN PROGRESS: " + tasksInSectionInProgressCount);
        // console.log("ARRAYS DATA DEADLINE: " + tasksInSectionAfterDeadlineCount);
        // console.log("ARRAYS DATA COMPLETED: " + tasksInSectionCompletedCount);

        let resultList = [];
        resultList.push(tasksInSectionNotStartedCount);
        resultList.push(tasksInSectionInProgressCount);
        resultList.push(tasksInSectionAfterDeadlineCount);
        resultList.push(tasksInSectionCompletedCount);

        let thisIsIt = {
            sections: test,
            taskData: resultList
        };

        return thisIsIt;
    }

    function loadTasksInfo() {

        let taskListInfo = [];
        let requestUrl = apiRootTasks;
        var projectId = localStorage.getItem("projectId");

        console.log("PROJECT ID: " + projectId);

        $.ajax({
            url: requestUrl + "/project/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: function (tasks) {
                tasks.forEach(task => {
                    const savedTask = {};
                    savedTask.progress = task.progress;
                    savedTask.startDate = task.startDate;
                    savedTask.endDate = task.endDate;
                    taskListInfo.push(savedTask);
                });
                loadStatusGraph(taskListInfo);
            }
        });
    }

    function loadStatusGraph(taskData) {

        const testData = setUpChartData(taskData);

        var myChart = new Chart(
            document.getElementById('acquisitions'),
            {
                type: 'doughnut',
                data: {
                    labels: testData.map(row => row.taskState),
                    datasets: [
                        {
                            label: 'Task amount',
                            data: testData.map(row => row.count),
                            backgroundColor: [
                                'rgba(184, 182, 182, 0.5)', // Color for "Po terminie"
                                'rgba(22, 22, 245, 0.5)', // Color for "W toku"
                                'rgba(255, 99, 132, 0.5)', // Color for "nierozpoczęte"
                                'rgba(60, 214, 26, 0.5)'  // Color for "Ukończone"
                            ],

                        }
                    ]
                }
            }
        );

    }

    function setUpChartData(taskData) {

        let notStarted = 0;
        let inProgress = 0;
        let afterDeadline = 0;
        let finished = 0;

        let data = [0, 0, 0, 0];

        var currentDate = new Date();

        for (let i = 0; i < taskData.length; i++) {
            var endDate = new Date(taskData[i].endDate);

            if (endDate < currentDate && taskData[i].progress != 100) {
                afterDeadline += 1;
            } else {
                if (taskData[i].progress == 0) {
                    notStarted += 1;
                } else if (taskData[i].progress > 0 && taskData[i].progress != 100) {
                    inProgress += 1;
                } else if (taskData[i].progress == 100) {
                    finished += 1;
                }
            }
        }

        data[0] = notStarted;
        data[1] = inProgress;
        data[2] = afterDeadline;
        data[3] = finished;

        const testData = [
            { taskState: "nierozpoczęte", count: data[0] },
            { taskState: "W toku", count: data[1] },
            { taskState: "Po terminie", count: data[2] },
            { taskState: "Ukończone", count: data[3] },
        ];

        return testData;
    }


    //Przejscie do strony z analityka
    $("#taskButtonId").click(function () {
        window.location.href = "tasks.html";
    });



    function loadUserTasksGraph(chartData) {

        console.log("CHART DATA: ");
        chartData.forEach(obj => {
            console.log(obj);
        });


        const ctx = document.getElementById('usersTasksChartId');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.map(row => row.user),
                datasets: [{
                    label: 'Godziny',
                    data: chartData.map(row => row.taskHours),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    }

    function loadUsersByProjectIdInfo() {
        let usersInfoList = [];
        let usersId = [];
        let requestUrl = apiRootUsers;
        var projectId = localStorage.getItem("projectId");

        //console.log("PROJECT ID: " + projectId);

        $.ajax({
            url: requestUrl + "/project/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: function (users) {
                users.forEach(user => {

                    usersId.push(user.id);

                    const savedUser = {};
                    savedUser.id = user.id;
                    savedUser.name = user.name;
                    savedUser.surname = user.surname;
                    console.log("USER: " + savedUser);
                    usersInfoList.push(savedUser);
                });
                loadTasksInfoByUsers(usersInfoList, usersId);
            }
        });
    }

    function loadTasksInfoByUsers(usersInfoList, usersId) {

        let taskInfoList = [];
        let requestUrl = apiRootTasks;
        var projectId = localStorage.getItem("projectId");

        //console.log("PROJECT ID: " + projectId);

        $.ajax({
            url: requestUrl + "/project/" + projectId,
            method: 'GET',
            contentType: "application/json",
            success: function (tasks) {
                tasks.forEach(task => {


                    if (hasCommonNumber(task.users, usersId)) {
                        const savedTask = {};
                        savedTask.progress = task.progress;
                        savedTask.startDate = task.startDate;
                        savedTask.endDate = task.endDate;
                        savedTask.users = task.users;
                        taskInfoList.push(savedTask);
                    }


                });

                console.log("tasks: " + taskInfoList + " users: " + usersInfoList);
                setUpUsersTasksChartData(taskInfoList, usersInfoList);
            }
        });

    }

    function setUpUsersTasksChartData(taskInfoList, usersInfoList) {


        // // Using forEach
        // console.log("TASK INFO: ");
        // taskInfoList.forEach(obj => {
        //     console.log(obj);
        // });
        console.log("USERS INFO: ");
        usersInfoList.forEach(obj => {
            console.log(obj);
        });


        let testList = [];

        for (let x = 0; x < usersInfoList.length; x++) {
            let user = {};
            user.id = usersInfoList[x].id;
            user.difference = 0;
            testList.push(user);
        }

        // Calculating the time difference
        // of two dates
        for (let i = 0; i < taskInfoList.length; i++) {

            var startDate = new Date(taskInfoList[i].startDate);
            var endDate = new Date(taskInfoList[i].endDate);


            let Difference_In_Time =
                endDate.getTime() - startDate.getTime();
            // Calculating the no. of days between
            // two dates
            let Difference_In_Days =
                Math.round
                    (Difference_In_Time / (1000 * 3600 * 24));

            for (let j = 0; j < testList.length; j++) {
                if (taskInfoList[i].users.includes(testList[j].id)) {
                    testList[j].difference += Difference_In_Days;
                }
            }
        }

        console.log("TEST LIST INFO: ");
        testList.forEach(obj => {
            console.log(obj);
        });

        const chartData = [];

        for (let i = 0; i < testList.length; i++) {
            for (let j = 0; j < testList.length; j++) {

                if (testList[i].id == usersInfoList[j].id) {
                    var data = {};
                    data.user = usersInfoList[j].name + " " + usersInfoList[j].surname;
                    data.taskHours = testList[j].difference * 8; //1 dzien to 8h czyli mozymy roznicy dni razy 8
                    chartData.push(data);
                }

            }
        }

        for (let i = 0; i < chartData.length; i++) {

            console.log("CHART DATA NAME: " + chartData[i].user + " dif: " + chartData[i].taskHours);

        }
        loadUserTasksGraph(chartData);
    }

    //function that check if 2 list have the same element
    function hasCommonNumber(list1, list2) {
        return list1.some(number => list2.includes(number));
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

});



