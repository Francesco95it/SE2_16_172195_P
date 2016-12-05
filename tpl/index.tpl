<!DOCTYPE html>
<html>
    <head>
       <meta charset="utf-8">
       <title>Employee</title>
    </head>
    <body>
        <div id="searchDiv">
            <form action="http://127.0.0.1:1337/search" method="post">
                ID: <input name="idSearch"/>
                <button type="submit">Search</button>
            </form>
        </div>
        <div id="deleteDiv">
            <form action="http://127.0.0.1:1337/delete" method="post">
                ID: <input type="text" name="idDelete"/>
                <button type="submit">Delete</button>    
            </form>
        </div>
        <button id="insertBtn" type="button" onclick="showhide()">Insert a new employee</button>
        <div id="insertDiv" style="visibility: hidden;">
            <form action="http://127.0.0.1:1337/insert" method="post">
                ID: <input type="text" id="idins" name="id"/>
                <br>
                Name: <input type="text" id="nameins" name="name"/>
                <br>
                Surname: <input type="text" id="surnameins" name="surname"/>
                <br>
                Level: <input type="text" id="levelins" name="level"/>
                <br>
                Salary: <input type="text" id="salaryins" name="salary"/>
                <button type="submit">Insert</button>    
            </form>
        </div>
        <div id="infoDiv" style="visibility: (:hiddenInfo:);">
                ID: <input type="text" id="id" name="id" value="(:id:)"/>
                <br>
                Name: <input type="text" id="name" name="name" value="(:name:)"/>
                <br>
                Surname: <input type="text" id="surname" name="surname" value="(:surname:)"/>
                <br>
                Level: <input type="text" id="level" name="level" value="(:level:)"/>
                <br>
                Salary: <input type="text" id="salary" name="salary" value="(:salary:)"/>
        </div>
        
        <script src="scripts.js"></script>
    </body>
</html>