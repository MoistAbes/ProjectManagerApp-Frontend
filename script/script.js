$(document).ready(function () {

    var apiRoot = 'http://localhost:8080/tasks';

    function handleTaskSubmitRequest(textTitle, textContent, textStatus, textPriority, textStartDate, textEndData) {
        $.ajax({
            url: apiRoot,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                Title: textTitle,
                Content: textContent,
                Status: textStatus,
                Priority: textPriority,
                Progress: "0",
                StartDate: textStartDate,
                EndDate: textEndData
            }),
            complete: function (data) {
                if (data.status === 200) {
                    alert("succesfully added movie to favourites");
                }
            }
        });
    }

    $("#tasksButton").click(function () {
        window.location.href = "tasks.html";
    });

    $("#addTaskButton").click(function () {

        // Select the input element by its ID
        var inputTastTitle = $('#taskTitle');
        var inputTaskContent = $('#tastContent');
        var inputTaskStatus = $('#taskStatus');
        var inputTaskPriority = $('#taskPriority');
        //daty
        var inputTaskStartDate = $('#startDateInput');
        var inputTaskEndDate = $('#endDateInput');

        // Get the value of the input field
        var inputTastTitleValue = inputTastTitle.val();
        var inputTaskContentValue = inputTaskContent.val();
        var inputTaskStatusValue = inputTaskStatus.val();
        var inputTaskPriorityValue = inputTaskPriority.val();
        //daty
        var inputTaskStartDateValue = inputTaskStartDate.val();
        var inputTaskEndDateValue = inputTaskEndDate.val();

        console.log("Saved title: " + inputTastTitleValue);
        console.log("Saved content: " + inputTaskContentValue);
        console.log("Saved Status: " + inputTaskStatusValue);
        console.log("Saved Start date: " + inputTaskStartDateValue);
        console.log("Saved End date: " + inputTaskEndDateValue);
        console.log("Saved Priority: " + inputTaskPriorityValue);


        //zapis do bazy danych
        handleTaskSubmitRequest(
            inputTastTitleValue,
            inputTaskContentValue,
            inputTaskStatusValue,
            inputTaskPriorityValue,
            inputTaskStartDateValue,
            inputTaskEndDateValue
        );
    });


});