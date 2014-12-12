<!DOCTYPE html>
<html lang="en">
<head>
<LINK REL="SHORTCUT ICON" HREF="favicon.ico">
<title>amanzi(tm) ARM editor</title>
<link rel="stylesheet" type="text/css" href="css/mystyle.css">
</head>
<body style="background:url(images/water-background.jpg);background-size:cover;">
<div id="header">
<img src="images/arm-logo.png" width="100" height="30" alt="" style="float:left"/><center><img src="images/logo.png" width="250" height="100" alt=""/></center>
</div>
<div id="input"><?php
echo $_POST["toStdin"];
?>
</div>
<div id="editor"><?php
echo $_POST["toCompiler"];
?>
</div>
    <script type="text/javascript">function gettext(){
		document.getElementById("theOut").innerHTML =  editor.getValue();
		document.getElementById("theStdin").innerHTML =  input.getValue();
	}</script>
<script src="src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script><script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/arm");
	var input = ace.edit("input");
	input.setTheme("ace/theme/terminal");
    input.getSession().setMode("ace/mode/plain_text");
</script>