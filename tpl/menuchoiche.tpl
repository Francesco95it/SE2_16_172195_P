<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Servizio Pasti Trento</title>
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>
    <body>
        <div class="mainDiv">
            <h1>Servizio Pasti Trento</h1>
            <h2>Benvenuto (:name:), scegli il tuo menù settimanale.</h2>
            <div class="internalDiv">
                <form name="dataForm" method="post" action="/order">
                    (:table:)
                    <br>
                    <button class="btnEnter medium" onClick="sendData()">Submit</button>
                </form>
            </div>
        </div>
        
        <script src="scripts.js"></script>
        <script>
            function sendData(){
                var x = document.forms[0];
                var n=0;
                for (i=0; i<x.length; i++){
                    if (x[i].checked) n+=1;
                }
                if n==14 //document.dataForm.submit();
                else alert("E' obbligatorio compilare il menu per ogni giorno!");
                
            }
        
        </script>
    </body>
</html>