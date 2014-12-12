<!DOCTYPE html>
<html lang="en">
<head>
<LINK REL="SHORTCUT ICON" HREF="favicon.ico">
<title>amanzi(tm) ARM editor</title>
<link rel="stylesheet" type="text/css" href="css/mystyle.css">
</head>
<body style="background:url(images/water-background.jpg);background-size:cover;min-height:300px;min-width:500px;">
<div id="header">
<h3 style="top:5px; left:40%; position:absolute">Debug Controls</h3>
<button onClick="step()" class="myButton" style="left:10px; bottom:10px; position:absolute">Step</button>
<button onClick="resetRegs()" class="myButton" style="right:10px; bottom:10px; position:absolute">Reset</button>
<table style="left:35%; bottom:10px; position:absolute"><tr><td><button onClick="setHex()" class="myButton">Hexadecimal</button></td><td><button onClick="setBin()" class="myButton">Binary</button></td></tr></table>
</div>
<div id="editor">#Program Title

	.text
	.global main

main:

	.data
</div>
<div id="input" style="width:10;height:10;overflow:scroll">
<table>
<tr><td><h3>Standard output: </h3></td><td><textarea id="stdOut"></textarea></td></tr>
<tr><td><h3>Line Number:</h3></td><td><h3 id="lineNum"></h3></td></tr>
<tr><td><h3>Last Line:</h3></td><td><h3 id="lastLine"></h3></td></tr>
</table>
</div>
<div id="output" style="width:10;height:10;overflow:scroll">
<div class="CSSTableGenerator">
<table>
<tr>
	<td>r0</td>
	<td>r1</td>
	<td>r2</td>
	<td>r3</td>
	<td>r4</td>
	<td>r5</td>
	<td>r6</td>
	<td>r7</td>
	<td>r8</td>
	<td>r9</td>
</tr>
<tr>
	<td id="r0">00</td>
	<td id="r1">00</td>
	<td id="r2">00</td>
	<td id="r3">00</td>
	<td id="r4">00</td>
	<td id="r5">00</td>
	<td id="r6">00</td>
	<td id="r7">00</td>
	<td id="r8">00</td>
	<td id="r9">00</td>
</tr>
</table>
<br>
<table>
<tr>
	<td>r10</td>
	<td>r11</td>
	<td>r12</td>
	<td>r13</td>
	<td>r14</td>
	<td>r15</td>
	<td>sp</td>
	<td>lr</td>
    <td>pc</td>
</tr>
	<td id="r10">00</td>
	<td id="r11">00</td>
	<td id="r12">00</td>
	<td id="r13">00</td>
	<td id="r14">00</td>
	<td id="r15">00</td>
	<td id="sp">00</td>
	<td id="lr">00</td>
    <td id="pc">00</td>
<tr>

</tr>
</table>
<br>
<table>
<tr><td>Stack</td></tr>
</table>
<table>
<tr id="stack">
</tr>
</table>
<table>
<tr><td>Data</td></tr>
</table>
<table>
<tr id="dataHead">
</tr>
<tr id="data">
</tr>
</table>
</div>
</div>
<div id="footer"><form method="post" action="sent.php"><textarea id="theOut" name="toCompiler" style="display:none"></textarea>
<textarea id="theStdin" name="toStdin" style="display:none"></textarea>
	  <input type="submit" name="submit" id="submit" value="Compile and Run" onClick="gettext()" class="myButton">
</form><div style="position:absolute;float:right;top:10px;bottom:10px;right:10px;">
		<input type="file" id="fileToLoad" class="myButton">
		<button onclick="loadFileAsText()" class="myButton">Load Selected File</button>
		<br>
        <a href="index.html"><button class="myButton">Home</button></a>
		</div>
</div>
    <script type="text/javascript">function gettext(){
		document.getElementById("theOut").innerHTML =  editor.getValue();
		document.getElementById("theStdin").innerHTML =  document.getElementById("stdInput").value;
	}</script>
<script src="src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="javascript/process.js" type="text/javascript" charset="utf-8"></script>
<script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/arm");
</script>
<script type='text/javascript'>
editor.getSession().selection.on('changeSelection', function(e) {
	document.getElementById("lineNum").innerHTML = editor.selection.getCursor().row + 1;
});

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function loadFileAsText()
{
	resetRegs();
	var fileToLoad = document.getElementById("fileToLoad").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		editor.setValue(textFromFileLoaded);
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}

</script>
</body>
</html>
