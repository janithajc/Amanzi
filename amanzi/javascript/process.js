// Process document
var registers = {r0:0,r1:0,r2:0,r3:0,r4:0,r5:0,r6:0,r7:0,r8:0,r9:0,r10:0,r11:0,r12:0,r13:0,r14:0,r15:0,sp:0,lr:0,pc:0};
var mainFound = false;
var mainLine = 0;
var	dataStart = 0;
var condFlag;
var hex = true;
var bin =  false;

//This is the function that is called everytime the user presses the "Step" button
function step(){
	//First find the main label
	if(!mainFound){
		editor.selection.moveCursorFileStart();
		getData();
		}
	while(!mainFound){
		editor.selection.selectLine();
		var line = editor.session.getTextRange(editor.getSelectionRange());
		mainFound = (/main:/).test(line);
		mainLine = editor.selection.getCursor().row;
		editor.selection.clearSelection();
	}
	//Now the current line is broken into instruction(inst[0]) and its arguments(inst[1]), inst[1] is then broken into the array regs to be used as necessary:
	document.getElementById("lastLine").innerHTML = editor.selection.getCursor().row + 1;
	editor.selection.selectLine();
	var line = editor.session.getTextRange(editor.getSelectionRange());
	line = line.trim();
	var instTemp = line.split(/([^(add|adds|sub|subs|mull|and|orr|eor|lsl|lsr|asr|cmp|cmn|tst|teq|ldrsb|ldrsh|ldrh|ldr|ldrb|strb|strh|str|mrs|msr|swp|swpb|mov|mvn|ror|bic|rsb|rsc|adcs|sbcs|b(?:|l|eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|nv))])(.+)?/i);
	var inst = line.split(/ (.+)?/);;
	inst[0] = instTemp[0];
	instTemp.shift();
	inst[1] = instTemp.join('');
	if(inst[1] !== undefined){
		inst[1] = inst[1].trim();
		var regs = inst[1].split(",");
		for(var i=0;i < regs.length; i++){
			regs[i] = regs[i].trim();
		}
		//This is where the instruction is tested against regex to call a function
		if((/add$/i).test(inst[0])){
			add(regs);
		}else if((/sub$/i).test(inst[0])){
			subs(regs);
		}else if((/(#.*)/).test(inst[0])){
			alert("Comment");
		}else if((/bl$/i).test(inst[0])){
			bl(regs[0]+':');
		}else if((/b$/i).test(inst[0])){
			b(regs[0]+':');
		}else if((/mov$/i).test(inst[0])){
			mov(regs);
		}else if((/cmp$/i).test(inst[0])){
			cmp(regs);
		}else if((/beq$/i).test(inst[0])){
			beq((regs[0].replace((/^=/),''))+':');
		}else if((/bne$/i).test(inst[0])){
			bne((regs[0].replace((/^=/),''))+':');
		}else if((/bgt$/i).test(inst[0])){
			bgt((regs[0].replace((/^=/),''))+':');
		}else if((/blt$/i).test(inst[0])){
			blt((regs[0].replace((/^=/),''))+':');
		}else if((/bge$/i).test(inst[0])){
			bge((regs[0].replace((/^=/),''))+':');
		}else if((/ble$/i).test(inst[0])){
			ble((regs[0].replace((/^=/),''))+':');
		}else if((/ldr$/i).test(inst[0])){
			ldr(regs);
		}else if((/str$/i).test(inst[0])){
			str(regs);
		}else{
			alert("Wrong instruction or instruction not implemented yet!");
		}
		editor.selection.clearSelection();
		if(hex){
			hexaIt();
		}else if(bin){
			binaIt();
		}else{
			alert("Select either binary or hexadecimal");
		}
		if(editor.selection.getCursor().row === dataStart - 1){
			alert('End of .text segment!');
			resetRegs();
		}
	}else{
		editor.selection.clearSelection();
		if(editor.selection.getCursor().row === dataStart - 1){
			alert('End of .text segment!');
			resetRegs();
		}else if(editor.selection.getCursor().row === (editor.session.getLength()-1)){
			resetRegs();
			}
	}
}
	
//These are the functions that execute when an insruction is handled
function add(regs){
	var spPrev = registers["sp"];
	if((regs[2]).indexOf('#')>-1){
			//registers[regs[0]] = parseInt((document.getElementById(regs[0]).innerHTML).replace(' ',''));
			//registers[regs[1]] = parseInt((document.getElementById(regs[1]).innerHTML).replace(' ',''));
			registers[regs[0]] = registers[regs[1]] + parseInt((regs[2]).replace(/[^0-9]/,''));
			document.getElementById(regs[0]).innerHTML = registers[regs[0]];
			}
		else{
			//registers[regs[0]] = parseInt((document.getElementById(regs[0]).innerHTML).replace(' ',''));
			//registers[regs[1]] = parseInt((document.getElementById(regs[1]).innerHTML).replace(' ',''));
			//registers[regs[2]] = parseInt((document.getElementById(regs[2]).innerHTML).replace(' ',''));
			registers[regs[0]] = registers[regs[1]] + registers[regs[2]];
			document.getElementById(regs[0]).innerHTML = registers[regs[0]];
			}
		if(regs[0] === "sp"){
			for(var i=spPrev; i< registers["sp"]; i++){
				try{
					document.getElementById("stack").innerHTML = document.getElementById("stack").innerHTML.replace('<td id="stk'+ (-i-1) +'">' + document.getElementById('stk'+ (-i-1)).innerHTML+'</td>','');
				}catch(e){
					alert("Segmentation fault. Stack overflow!");
				}
			}
		}
	}
	
function subs(regs){
	var spPrev = registers["sp"];
	if((regs[2]).indexOf('#')>-1){
			//registers[regs[0]] = parseInt((document.getElementById(regs[0]).innerHTML).replace(' ',''));
			//registers[regs[1]] = parseInt((document.getElementById(regs[1]).innerHTML).replace(' ',''));
			registers[regs[0]] = registers[regs[1]] - parseInt((regs[2]).replace(/[^0-9]/,''));
			document.getElementById(regs[0]).innerHTML = registers[regs[0]];
			}
		else{
			//registers[regs[0]] = parseInt((document.getElementById(regs[0]).innerHTML).replace(' ',''));
			//registers[regs[1]] = parseInt((document.getElementById(regs[1]).innerHTML).replace(' ',''));
			//registers[regs[2]] = parseInt((document.getElementById(regs[2]).innerHTML).replace(' ',''));
			registers[regs[0]] = registers[regs[1]] - registers[regs[2]];
			document.getElementById(regs[0]).innerHTML = registers[regs[0]];
			}
		if(regs[0] === "sp"){
			for(var i=spPrev; i> registers["sp"]; i--){
				document.getElementById("stack").innerHTML = document.getElementById("stack").innerHTML + '<td id="stk'+ (-i) +'">00</td>';
			}
		}
	}
	
function b(label){
	var labelFound = false;
	editor.gotoLine(mainLine);
	while(!labelFound){
		editor.selection.selectLine();
		var line = editor.session.getTextRange(editor.getSelectionRange());
		line = line.trim();
		labelFound = (label === line);
		editor.selection.clearSelection();
		//If label not found, terminate
		if(editor.selection.getCursor().row === (editor.session.getLength()-1)){
			alert('Label not found! '+label);
			break;
			}
		}
	}
	
function bl(label){
	if(label === "printf:"){
		thePrintf(document.getElementById("r0").innerHTML);
	}else{
	var labelFound = false;
	document.getElementById("lr").innerHTML = (editor.selection.getCursor().row - 1);
	editor.gotoLine(mainLine);
	while(!labelFound){
		editor.selection.selectLine();
		var line = editor.session.getTextRange(editor.getSelectionRange());
		line = line.trim();
		labelFound = (label === line);
		editor.selection.clearSelection();
		//If label not found, terminate
		if(editor.selection.getCursor().row === (editor.session.getLength()-1)){
			alert('Label not found! '+label);
			editor.gotoLine(parseInt(document.getElementById("lr").innerHTML.replace(/[^0-9]/,'')) + 2);
			break;
			}
		}
	}
}
	
function mov(regs){
	if((regs[1]).indexOf('#')>-1){
		registers[regs[0]] = parseInt((regs[1]).replace(/[^0-9]/,''));
		document.getElementById(regs[0]).innerHTML = registers[regs[0]];
	}else{
		//registers[regs[1]] = parseInt((document.getElementById(regs[1]).innerHTML).replace(/[^0-9]/,''));
		registers[regs[0]] = registers[regs[1]];
		document.getElementById(regs[0]).innerHTML = registers[regs[0]];
		}
	}
		
function cmp(regs){
	if((regs[1]).indexOf('#')>-1){
		//registers[regs[0]] = parseInt((document.getElementById(regs[0]).innerHTML).replace(/[^0-9]/,''));
		condFlag = registers[regs[0]] - parseInt(regs[1].replace(/[^0-9]/,''));
		}
		//registers[regs[0]] = parseInt((document.getElementById(regs[0]).innerHTML).replace(/[^0-9]/,''));
		//registers[regs[1]] = parseInt((document.getElementById(regs[1]).innerHTML).replace(/[^0-9]/,''));
		condFlag = registers[regs[0]] - registers[regs[1]];
	}
	
function beq(label){
	if(condFlag === 0){
		b(label);
		}
	}
	
function bne(label){
	if(condFlag !== 0){
		b(label);
		}
	}
	
function bgt(label){
	if(condFlag > 0){
		b(label);
		}
	}
	
function blt(label){
	if(condFlag < 0){
		b(label);
		}
	}
	
function bge(label){
	if(condFlag >= 0){
		b(label);
		}
	}
	
function ble(label){
	if(condFlag <= 0){
		b(label);
		}
	}
	
function ldr(regs){
	if((/^=(.+)?/).test(regs[1])){
		registers[regs[0]] = regs[1].replace('=','').trim()+":";
		document.getElementById(regs[0]).innerHTML = registers[regs[0]];
	}else if((/\[sp/).test(regs[1])){
		registers[regs[0]] = document.getElementById('stk' + regs[2].replace(/[^0-9]*/g,'')).innerHTML;
		document.getElementById(regs[0]).innerHTML = registers[regs[0]];
	}else{
		//registers[regs[1]] = parseInt(document.getElementById(regs[1]).innerHTML.replace(/[^0-9]/g,''));
		registers[regs[0]] = registers[regs[1]];
		document.getElementById(regs[0]).innerHTML = registers[regs[0]];
		}
	}
	
function str(regs){
	if((/^=(.+)?/).test(regs[0])){
		registers[regs[1]] = regs[0].replace('=','').trim()+":";
		document.getElementById(regs[1]).innerHTML = registers[regs[1]];
	}else if((/\[sp/).test(regs[1])){
		document.getElementById('stk' + regs[2].replace(/[^0-9]*/g,'')).innerHTML = registers[regs[0]];
	}else{
		//registers[regs[0]] = parseInt(document.getElementById(regs[0]).innerHTML.replace(/[^0-9]/,''));
		registers[regs[1]] = registers[regs[0]];
		document.getElementById(regs[0]).innerHTML = registers[regs[0]];
		}
	}
	
//End of instruction functions
	
//Utility functions to reset, populate data memory, convert number bases and such:
function getData(){
	var labelFound = false;
	editor.selection.moveCursorFileStart();
	while(!labelFound){
		editor.selection.selectLine();
		var line = editor.session.getTextRange(editor.getSelectionRange());
		line = line.trim();
		labelFound = ((/^\.data$/).test(line));
		editor.selection.clearSelection();
		//set start of data segment
		dataStart = editor.selection.getCursor().row;
		//If label not found, terminate
		if(editor.selection.getCursor().row === (editor.session.getLength()-1)){
			alert('Data segment not found!');
			break;
			}
		}if(labelFound){
			while(editor.selection.getCursor().row !== (editor.session.getLength()-1)){
				editor.selection.selectLine();
				var line = editor.session.getTextRange(editor.getSelectionRange());
				line = line.trim();
				var addr = line.match(/^.*:/);
				var leTxt = line.replace(/^.*:/,'').trim();
				if(addr !== null){
					document.getElementById("dataHead").innerHTML = document.getElementById("dataHead").innerHTML + '<td>'+ addr +'</td>';
					document.getElementById("data").innerHTML = document.getElementById("data").innerHTML + '<td id="'+ addr +'">'+ leTxt +'</td>';
					}
				editor.selection.clearSelection();
				if(editor.selection.getCursor().row === (editor.session.getLength()-1)){
					alert('Done populating data!');
					break;
				}
			}
		}
	editor.selection.moveCursorFileStart();
}

function remData(){
	document.getElementById("dataHead").innerHTML = "";
	document.getElementById("data").innerHTML = "";
}

function thePrintf(label){
	document.getElementById("stdOut").innerHTML = document.getElementById(label).innerHTML.match(/"([^\\"]|\\.)*"/)[0].replace(/("|\\[a-zA-Z])/g,'');
}
		
function resetRegs(){
		mainFound = false;
		var reg = 'r';
		for(var i=0; i < 16; i++){
			reg = 'r'+i;
			registers[reg] = 0;
			document.getElementById(reg).innerHTML = '00';
			}
		registers['sp'] = 0;
		document.getElementById('sp').innerHTML = '00';
		registers['lr'] = 0;
		document.getElementById('lr').innerHTML = '00';
		registers['pc'] = 0;
		document.getElementById('pc').innerHTML = '00';
		document.getElementById("stack").innerHTML = "";
		remData();
}

function d2h(d) {
	if(typeof d === "number"){
		return "0x"+(+d).toString(16).toUpperCase();
	}else{
		return d;
	}
}

function d2b(d){
	if(typeof d === "number"){
		if(d >= 0){
			var leBin = (+d).toString(2);
			return  "00000000000000000000000000000000".substr(0,32 - leBin.length) + leBin;
		}else{
			return (8589934592 - d).toString(2);
		}
	}else{
		return d;
	}
}

function hexaIt(){
	for(var i=0; i<16; i++){
		document.getElementById("r"+i).innerHTML = d2h(registers["r"+i]);
	}
	document.getElementById("sp").innerHTML = d2h(registers["sp"]);
	document.getElementById("lr").innerHTML = d2h(registers["lr"]);
	document.getElementById("pc").innerHTML = d2h(registers["pc"]);
}

function binaIt(){
	for(var i=0; i<16; i++){
		document.getElementById("r"+i).innerHTML = d2b(registers["r"+i]);
	}
	document.getElementById("sp").innerHTML = d2b(registers["sp"]);
	document.getElementById("lr").innerHTML = d2b(registers["lr"]);
	document.getElementById("pc").innerHTML = d2b(registers["pc"]);
}

function setHex(){
	hex = true;
	bin = false;
	hexaIt();
}

function setBin(){
	hex = false;
	bin = true;
	binaIt();
}
