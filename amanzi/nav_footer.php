<div id="footer"><form method="post" action="sent.php"><textarea id="theOut" name="toCompiler" style="display:none"></textarea>
<textarea id="theStdin" name="toStdin" style="display:none"></textarea>
	  <input type="submit" name="submit" id="submit" value="Compile and Run" onClick="gettext()" class="myButton">
</form><div style="position:absolute; float:right;top:10px;bottom:10px;right:10px;">
		<input type="file" id="fileToLoad" class="myButton">
		<button onclick="loadFileAsText()" class="myButton">Load Selected File</button>
        </form>
<br>
<a href="debug_page.html"><button class="myButton">Debug</button></a>
        </div>
</div>
<script type='text/javascript'>

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function loadFileAsText()
{
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