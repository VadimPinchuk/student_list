class Student {
  constructor(name, surname, lastname, birthDate, startEducation, faculty) {
    this.name = name;
    this.surname = surname;
    this.lastname = lastname;
    this.birthDate = birthDate;
    this.startEducation = startEducation;
    this.faculty = faculty;
  }


  get fio() {
    return this.surname + " " + this.name + " " + this.lastname;
  }


  getEducationPeriod() {
    let result;
    const currentYear = new Date();
    let yyyy = currentYear.getFullYear();
    let mm = currentYear.getMonth();
    let end = this.startEducation + 4;
    if (yyyy - this.startEducation === 0 && mm < 8) {
      result = end + " " + "(1 курс)";
    }
    if (yyyy - this.startEducation === 0 && mm > 8) {
      result = end + " " + "(1 курс)";
    }
    if (yyyy - this.startEducation === 1 && mm <= 8) {
      result = end + " " + "(1 курс)";
    }
    if (yyyy - this.startEducation === 1 && mm > 8) {
      result = end + " " + "(2 курс)";
    }
    if (yyyy - this.startEducation === 2 && mm <= 8) {
      result = end + " " + "(2 курс)";
    }
    if (yyyy - this.startEducation === 2 && mm > 8) {
      result = end + " " + "(3 курс)";
    }
    if (yyyy - this.startEducation === 3 && mm <= 8) {
      result = end + " " + "(3 курс)";
    }
    if (yyyy - this.startEducation === 3 && mm > 8) {
      result = end + " " + "(4 курс)";
    }
    if (yyyy - this.startEducation === 4 && mm <= 8) {
      result = end + " " + "(4 курс)";
    }
    if (yyyy - this.startEducation === 4 && mm > 8) {
      result = end + " " + "(закончил)";
    }
    if (yyyy - this.startEducation > 4) {
      result = end + " " + "(закончил)";
    }

    return result;
  }

  getBirthDateString() {
    const yyyy = this.birthDate.getFullYear();
    let mm = this.birthDate.getMonth() + 1;
    let dd = this.birthDate.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    return dd + "." + mm + "." + yyyy;
  }

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    let m = today.getMonth() - this.birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
