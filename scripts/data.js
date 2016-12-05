var employees = [];
var nemployees = 0;

function add(id, name, surname, level, salary){
    if(id=='') id = nextid();
    console.log(id);
    if(getIndexByID(id) == -1) {employees.push([id, name, surname, level, salary]); nemployees+=1; console.log("Added employee with id: " + id  + ', nemployees = ' + nemployees);}
}

function nextid(){
    if (nemployees==0) return 0;
    for(i=0; i<1000; i++){
        var flag=false;
        for(j=0;j<nemployees;j++){
            if(i==employees[j][0]) flag=true;
        }
        if (!flag){
            return i;
        }
    }
}

function getIndexByID(id){
    if (nemployees == 0) return -1;
    for (i=0;i<nemployees;i++){
        if(typeof employees[i] != 'undefined'){
            if(employees[i][0]==id) return i;            
        }
    }
    return -1;
}

function infos(id){
    var index = getIndexByID(id);
    if (index != -1) return employees[index];
    else return -1;
}

function remove(id){
    var index = getIndexByID(id);
    if (index != -1) employees.splice(index, 1);
}

exports.add = add;
exports.remove = remove;
exports.infos = infos;