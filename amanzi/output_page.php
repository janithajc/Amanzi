<div id="output">
<pre>
<?php
	session_start();

	$sid = session_id();
file_put_contents('compile_'.$sid.'.s',$_POST["toCompiler"]);
function cmd_exec($cmd, &$stdout, &$stderr, $stdin)
{
    $outfile = tempnam(".", "cmd");
    $errfile = tempnam(".", "cmd");
    $descriptorspec = array(
        0 => array("pipe", "r"),
        1 => array("file", $outfile, "w"),
        2 => array("file", $errfile, "w")
    );
    $proc = proc_open($cmd, $descriptorspec, $pipes);
    
    if (!is_resource($proc)) return 255;
	
	fwrite($pipes[0], $stdin);
	fclose($pipes[0]);
	
    $exit = proc_close($proc);
	
    $stdout = file($outfile);
    $stderr = file($errfile);

    unlink($outfile);
    unlink($errfile);
    return $exit;
}
//cmd_exec('arm-elf-gcc -Wall -o compiled_'.$sid.' compile_'.$sid.'.s',$outputC,$outputE,'');
cmd_exec('arm-linux-gnueabi-gcc -Wall -o  compiled_'.$sid.' compile_'.$sid.'.s',$outputC,$outputE,'');
//$outputC = shell_exec('arm-elf-gcc -Wall -o compiled compile.s');
if(count($outputC)>0){
echo "Compiler Messages:\n";
for ($x=0; $x<count($outputC); $x++) {
  echo "$outputC[$x]";
}
}else{
	echo "No Compiler Messages\n";
	}
if(count($outputE)>0){
echo "\n";
echo "Error Messages:\n";
for ($x=0; $x<count($outputE); $x++) {
  echo "$outputE[$x]";
}
echo "\n\n";
}else{
	echo "No Compiler Error Messages\n";
	}
//cmd_exec('arm-elf-run compiled_'.$sid,$outputC,$outputE,$_POST['toStdin']);
    cmd_exec('qemu-arm -L /usr/arm-linux-gnueabi  compiled_'.$sid,$outputC,$outputE,$_POST['toStdin']);
//$outputC = shell_exec('arm-elf-gcc -Wall -o compiled compile.s');
if(count($outputC)>0){
echo "\nRuntime Output:\n";
for ($x=0; $x<count($outputC); $x++) {
  echo "$outputC[$x]";
}
}else{
	echo "No Runtime Output\n";
	}
if(count($outputE)>0){
echo "\nRuntme Error Messages:\n";
for ($x=0; $x<count($outputE); $x++) {
  echo "$outputE[$x]";
}
}else{
	echo "\nNo Runtime Error messages\n";
	}
unlink('compile_'.$sid.'.s');
unlink('compiled_'.$sid);
?>
</pre>
</div>
<script src="src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script><script>
    var output = ace.edit("output");
	output.setTheme("ace/theme/terminal");
    output.getSession().setMode("ace/mode/plain_text");
</script>