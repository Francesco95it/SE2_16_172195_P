var t = 0;
var x = document.getElementById("menuTable1");
for (var i = 1, row; row = x.rows[i]; i++) {
   if (t < 2) {
       x.rows[i].style.backgroundColor='#F7CDCD';
   }
    else if (t < 4)
    { 
        x.rows[i].style.backgroundColor='white';
    }
    t++;
    if (t==4) t=0;
};
var x = document.getElementById("menuTable2");
for (var i = 1, row; row = x.rows[i]; i++) {
   if (t < 2) {
       x.rows[i].style.backgroundColor='#F7CDCD';
   }
    else if (t < 4)
    { 
        x.rows[i].style.backgroundColor='white';
    }
    t++;
    if (t==4) t=0;
};