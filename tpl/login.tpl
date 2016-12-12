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
            <h2>Accedi al sistema</h2>
            <div class="internalDiv">
                (:err:)
                <form method="post" action="/login">
                    Username: <input type="text" name="username">
                    Password: <input type="password" name="password">
                    <input type="submit" value="Submit">
                </form>
                <br>
                TIP: <br>
                -Log in as admin with username: admin password: 12345<br>
                -Log in as customer with username: customer1 password: 12345 <br>
                 or username:customer2 password:123
            </div>
        </div>
        
        <script src="scripts.js"></script>
    </body>
</html>