$(document).ready(function () {

    var apiRoot = 'http://localhost:8081/projects';
    const projectList = document.querySelector('#projectListId');


    loadProjects();


    // Click handler for entire DIV container
    projectList.addEventListener('click', function (e) {
        // But only alert for elements that have an alert-button class
        if (e.target.classList.contains('projectItem')) {

            var projectId = e.target.getAttribute("projectId");

            console.log("im touching list item: " + e.target.innerHTML + " its id: " + projectId);

            // Storing a global variable
            localStorage.setItem('projectId', projectId);

            console.log("is global variable working: " + window.projectId);
            window.location.href = "tasks.html";

        }
    });

    function loadProjects() {
        const requestUrl = apiRoot;

        $.ajax({
            url: requestUrl,
            method: 'GET',
            contentType: "application/json",
            success: function (projects) {
                projects.forEach(project => {
                    console.log(project);
                    addProjectItem(project.title, project.id);
                });
            }
        });
    }

    function addProjectItem(projectTitle, projectId) {
        const newProjectListItem = document.createElement('li');
        newProjectListItem.innerHTML = projectTitle;
        newProjectListItem.setAttribute("projectId", projectId);


        newProjectListItem.classList.add("projectItem");
        projectList.appendChild(newProjectListItem);

    }





    $("#createProjectButtonId").click(function () {
        // Show the overlay and modal
        document.getElementById("overlay").style.display = "block";
        document.getElementById("taskDetailsModal").style.display = "block";
        taskDetailsForm.style.display = "block";

    });
    $("#projectDetailsSubmit").click(function () {

        var inputProjectTitle = $('#projectTitleInputId');
        var inputProjectTitleValue = inputProjectTitle.val();
        console.log("Saved title: " + inputProjectTitleValue);
        var users = [];

        hideOverlayAndModal();

        handleTaskSubmitRequest(inputProjectTitleValue, users);

    });


    function handleTaskSubmitRequest(textTitle, users) {
        $.ajax({
            url: apiRoot,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                title: textTitle,
                usersId: users
            }),
            complete: function (data) {
                if (data.status === 200) {
                    alert("succesfully added movie to favourites");
                }
            }
        });
    }

    $("#closeDetailsButtonId").click(function () {
        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("taskDetailsModal").style.display = "none";
    });




    function hideOverlayAndModal() {
        // Hide the overlay and modal
        document.getElementById("overlay").style.display = "none";
        document.getElementById("taskDetailsModal").style.display = "none";
    }



});
