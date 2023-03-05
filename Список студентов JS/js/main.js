// Массив студентов
let students = [];

//Получаем массив c сервера

async function serverArr() {
  const responseST = await fetch("http://localhost:3000/api/students");

  let res = await responseST.json();
  res.forEach((student) => {
    students.push(
      new Student(
        student.name,
        student.surname,
        student.lastname,
        new Date(student.birthday),
        Number(student.studyStart),
        student.faculty
      )
    );
  });
  render();
  return students;
}
serverArr();

const $studentsList = document.getElementById("students-list"),
  $studentsListTHAll = document.querySelectorAll(".student-table th"),
  $filterForm = document.getElementById("filter"),
  $filterFIO = document.getElementById("filter-fio"),
  $filterFaculty = document.getElementById("filter-faculty"),
  $filterStartDate = document.getElementById("filter-start"),
  $filterEndDate = document.getElementById("filter-end");

let column = "fio",
  columnDir = true;

// Получить ТR студента

function newStudentTR(student) {
  const $studentTR = document.createElement("tr"),
    $fioTd = document.createElement("td"),
    $facultyTD = document.createElement("td"),
    $birthDateTD = document.createElement("td"),
    $startEducationTD = document.createElement("td");

  let deleteButton = document.createElement("span");
  deleteButton.textContent = "DELETE";
  deleteButton.classList.add("delete-btn");

  $fioTd.textContent = student.fio;
  $facultyTD.textContent = student.faculty;
  $birthDateTD.textContent =
    student.getBirthDateString() + " " + "(" + student.getAge() + "лет)";

  $startEducationTD.textContent =
    student.startEducation + " " + "-" + " " + student.getEducationPeriod();

  $studentTR.append($fioTd);
  $studentTR.append($facultyTD);
  $studentTR.append($birthDateTD);
  $studentTR.append($startEducationTD);
  $studentTR.append(deleteButton);

  deleteButton.addEventListener("click", () => {
    if (!confirm("Вы уверены?")) {
      return;
    } else {
      //`DELETE /api/students/{id}` удалить студента по переданному ID. Как передать сюда этот id?
      fetch(`http://localhost:3000/api/students`, {
        method: "DELETE",
      });
      $studentTR.remove();
    }
  });
  return $studentTR;
}

// Сортировка массива по параметрам

function getSortStudents(prop, dir) {
  const studentsCopy = [...students];
  return studentsCopy.sort(function (studentA, studentB) {
    if (
      !dir == false
        ? studentA[prop] < studentB[prop]
        : studentA[prop] > studentB[prop]
    )
      return -1;
  });
}

// Фильтр

function filter(arr, prop, value) {
  return arr.filter(function (oneUser) {
    if (oneUser[prop].includes(value.trim().toLowerCase())) return true;
  });
}

function filterDate(arr) {
  return arr.filter(function (student) {
    if ($filterStartDate.value == student.startEducation) return true;
  });
}

function filterEndDate(arr) {
  return arr.filter(function (student) {
    if ($filterEndDate.value == student.startEducation + 4) return true;
  });
}

// Отрисовать

function render() {
  let studentsCopy = [...students];

  studentsCopy = getSortStudents(column, columnDir);

  //Фильтрация

  if ($filterFIO.value.trim().toLowerCase() !== "") {
    studentsCopy = filter(studentsCopy, "fio", $filterFIO.value);
  }

  if ($filterFaculty.value.trim().toLowerCase() !== "") {
    studentsCopy = filter(studentsCopy, "faculty", $filterFaculty.value);
  }

  if ($filterStartDate.value !== "") {
    studentsCopy = filterDate(
      studentsCopy,
      "startEducation",
      $filterStartDate.value
    );
  }

  if ($filterEndDate.value !== "") {
    studentsCopy = filterEndDate(
      studentsCopy,
      "startEducation",
      $filterEndDate.value
    );
  }

  $studentsList.innerHTML = "";
  for (const student of studentsCopy) {
    $studentsList.append(newStudentTR(student));
  }
}

// События сортировки

$studentsListTHAll.forEach((element) => {
  element.addEventListener("click", function () {
    column = this.dataset.column;
    columnDir = !columnDir;
    render();
  });
});

render();

// Добавление студентов

let validation = new JustValidate("#add-student", {
  errorLabelStyle: {
    color: "#D11616",
  },
  errorsContainer: "#error",
});

validation.addField("#input-surname", [
  {
    rule: "required",
    errorMessage: "Вы не ввели фамилию",
  },
]);

validation.addField("#input-name", [
  {
    rule: "required",
    errorMessage: "Вы не ввели имя",
  },
]);

validation.addField("#input-lastname", [
  {
    rule: "required",
    errorMessage: "Вы не ввели отчество",
  },
]);

validation.addField("#input-birthDate", [
  {
    rule: "required",
    errorMessage: "Вы не ввели дату рождения",
  },
]);

validation.addField("#input-startEducation", [
  {
    rule: "required",
    errorMessage: "Вы не ввели дату начала обучения",
  },

  {
    rule: "number",
  },

  {
    rule: "minNumber",
    value: 2000,
    errorMessage: "Год начала обученя должен быть 2000-ый или более",
  },
]);

validation.addField("#input-faculty", [
  {
    rule: "required",
    errorMessage: "Вы не ввели название факультета",
  },
]);

document
  .getElementById("add-student")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (validation.isValid) {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: document.getElementById("input-name").value,
          surname: document.getElementById("input-surname").value,
          lastname: document.getElementById("input-lastname").value,
          birthday: new Date(document.getElementById("input-birthDate").value),
          studyStart: Number(
            document.getElementById("input-startEducation").value
          ),
          faculty: document.getElementById("input-faculty").value,
        }),
      });
      const data = await response.json();

      students.push(
        new Student(
          data.name,
          data.surname,
          data.lastname,
          new Date(data.birthday),
          Number(data.studyStart),
          data.faculty
        )
      );
      render();
    }
    document.getElementById("input-name").value = "";
    document.getElementById("input-surname").value = "";
    document.getElementById("input-lastname").value = "";
    document.getElementById("input-birthDate").value = "";
    document.getElementById("input-startEducation").value = "";
    document.getElementById("input-faculty").value = "";
  });

$filterForm.addEventListener("submit", function (event) {
  event.preventDefault();
});

$filterFIO.addEventListener("input", function () {
  render();
});

$filterFaculty.addEventListener("input", function () {
  render();
});

$filterStartDate.addEventListener("input", function () {
  render();
});

$filterEndDate.addEventListener("input", function () {
  render();
});
