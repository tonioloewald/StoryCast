<?php
    session_start();
    
    if( !isset($_SESSION['salt']) ){
        $_SESSION['salt'] = md5( rand(0, 10000) . session_id() );
        $_SESSION['id'] = false;
    }
    if( $_SERVER["QUERY_STRING"] ){
        require_once('services.php');
    } else {
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>TMNGi StoryCast</title>
	<link rel='stylesheet' type='text/css' href="storycast.css">
</head>
<body>
    <h1>TMNGi StoryCast</h1>
    <form id="login" class="hidden">
        <h2>Login</h2>
        <input name="id" type="email" placeholder="Email Address" required>
        <input name="password" type="password" placeholder="Password" required>
        <a class="button" href="#create-account">Create Account</a>
        <button name="submit">Login</button>
    </form>
    <form id="create-account" class='hidden'>
        <h2>Create Account</h2>
        <p>
            To create an account you will need a USPTO email address.
            Your password will be emailed to you.
        </p>
        <input name="id" type="email" placeholder="Email Address" required>
        <button class="create">Create Account</button>
    </form>
    <div id="password-reset" class='hidden'>
        <h2>Password Reset</h2>
        <p>
            If you've forgotten your password or simply want to change it, enter your email address. 
            A new password will be emailed to that address.
        </p>
        <input name="id" type="email" placeholder="Email Address" required>
        <button name="Submit">Reset Password</button>
    </div>
    <iframe id="hidden-iframe" name="hidden-iframe" width="400" height="400"></iframe>
    <form id="story-edit" class='hidden' method='post' enctype="multipart/form-data" action=".?story" target="hidden-iframe">
        <h2>Edit Story</h2>
        <input name="id" type="hidden">
        <label>
            Contact Person
            <input name="user_id" placeholder="email address" required>
        </label>
        <label>
            Story Name
            <input name="name" placeholder="Story Name" required>
        </label>
        <label>
            Description
            <textarea name="description" placeholder="Description" required></textarea>
        </label>
        <label>
            Screencast Video (mp4)
            <input name="video" type="file" accept="video/mp4" required>
        </label>
        <input name="link" type="url" placeholder="Application Link" value="https://sit-tmng-ui.etc.uspto.gov/" required>
        <button class="delete">Delete</button>
        <button type="submit">Save</button>
    </form>
    <div id="story-detail" class='hidden'>
        <h2 name="name"></h2>
        <input type="hidden" name="id">
        <p name="description"></p>
        <video name="video" controls width="100%"></video>
        <p>
            <a class="button" name="user_id" prefix="mailto:">Contact Developer</a>
            <a class="button" name="link" target="_blank">Try it yourself</a>
            <a class="button" href="https://rally1.rallydev.com/slm/login.op" target="_blank">Report a Defect</a>
        </p>
        <p>
            <a class="button" href="#story-list">Return to List</a>
            <button class="edit">Edit</button>
        </p>
    </div>
    <div id="story-list" class='hidden'>
        <h2>Stories</h2>
        <table>
            <thead>
                <tr>
                    <th>
                        Story
                    </th>
                    <th>
                        Last Modified
                    </th>
                    <th>
                        <button class="new-story">New Story</button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr class="template">
                    <td name="name"></td>
                    <td name="last_modified" decorator="renderDate"></td>
                    <td><span name="id" style="display: none;"></span><button class="delete">Delete</button><button class="edit">Edit</button></td>
                </tr>
            </tbody>
        </table>
        <h3>Useful Links</h3>
        <p>How to create screencasts on Mac and Windows</p>
        <p><a href="http://www.screenpresso.com/">Screenpresso &mdash; screen recorder for Windows that can output mp4</p>
    </div>
    <script src="md5.js"></script>
    <script src="jq.js"></script>
    <script src="storycast.js"></script>
</body>
</html>
<?php
    }
?>
