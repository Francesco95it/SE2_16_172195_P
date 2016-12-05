function showhide(){
    var insdiv = document.getElementById("insertDiv");
    var id = document.getElementById("idins");
    var name = document.getElementById("nameins");
    var surname = document.getElementById("surnameins");
    var level = document.getElementById("levelins");
    var salary = document.getElementById("salaryins");
    if(insdiv.style.visibility == 'hidden'){
        id.value = '';
        name.value = '';
        surname.value = '';
        level.value = '';
        salary.value = '';
        insdiv.style.visibility = 'visible';
    } else insdiv.style.visibility = 'hidden';
};