//Every update
var instMem = "";
function instDump() {
	instMem = "";
    changeDump();
}

function changeDump(){
	var text = editor.getValue();;
	text = text.trim();
	text = text.replace(/^\s*\n/gm,'');
	var lines = text.split('\n');
	var i=0;
	while(i<lines.length){
		instruct(lines[i].trim(), i);
		i++;
	}
	dump.setValue(instMem);
}

function instruct(line, lineNum){
	var instTemp = line.split(/([^(add|sub|mov))])(.+)?/i);
	var inst = line.split(/ (.+)?/);;
	inst[0] = instTemp[0];
	instTemp.shift();
	inst[1] = instTemp.join('');
	if((/^.*:/i).test(line)){
		lineNum ++;
		lineNum = lineNum*4 + 4096;
		instMem += "\n\n" + "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + line;
	}else if(inst[1] !== undefined){
		lineNum = lineNum*4 + 4096;
		inst[1] = inst[1].trim();
		var regs = inst[1].split(",");
		for(var i=0;i < regs.length; i++){
			regs[i] = regs[i].trim();
		}
		//This is where the instruction is tested against regex to call a function
		if((/add$/i).test(inst[0])){
			condFlag = 14;
			if(regs[2] === undefined){
				
			}else if((regs[2]).indexOf('#')>-1){
				var theInst = "0000".substr(0,4 - (+condFlag).toString(2).length) + (+condFlag).toString(2) + "001" + "01000" + findReg(regs[1]) + findReg(regs[0]) + "000000000000".substr(0,12 - (+(regs[2]).replace('#','')).toString(2).length)+(+(regs[2]).replace('#','')).toString(2);
				instMem += "\n"+ "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + "00000000".substr(0,8 - parseInt(theInst,2).toString(16).length) + parseInt(theInst,2).toString(16) + "\t" + line;
			}
			else{
				var theInst = "0000".substr(0,4 - (+condFlag).toString(2).length) + (+condFlag).toString(2) + "000" + "01000" + findReg(regs[1]) + findReg(regs[0]) + "000000000000".substr(0,12 - findReg(regs[2]).length) + findReg(regs[2]);
				instMem += "\n"+ "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + "00000000".substr(0,8 - parseInt(theInst,2).toString(16).length) + parseInt(theInst,2).toString(16) + "\t" + line;
			}
		}else if((/sub$/i).test(inst[0])){
			condFlag = 14;
			if(regs[2] === undefined){
				
			}else if((regs[2]).indexOf('#')>-1){
				var theInst = "0000".substr(0,4 - (+condFlag).toString(2).length) + (+condFlag).toString(2) + "001" + "00100" + findReg(regs[1]) + findReg(regs[0]) + "000000000000".substr(0,12 - (+(regs[2]).replace('#','')).toString(2).length)+(+(regs[2]).replace('#','')).toString(2);
				instMem += "\n" + "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + "00000000".substr(0,8 - parseInt(theInst,2).toString(16).length) + parseInt(theInst,2).toString(16) + "\t" + line;
			}
			else{
				var theInst = "0000".substr(0,4 - (+condFlag).toString(2).length) + (+condFlag).toString(2) + "000" + "00100" + findReg(regs[1]) + findReg(regs[0]) + "000000000000".substr(0,12 - findReg(regs[2]).length) + findReg(regs[2]);
				instMem += "\n" + "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + "00000000".substr(0,8 - parseInt(theInst,2).toString(16).length) + parseInt(theInst,2).toString(16) + "\t" + line;
			}
		}else if((/(#.?|@.?)/).test(inst[0])){
			//alert("Comment");
		}else if((/bl$/i).test(inst[0])){
			//bl(regs[0]+':');
		}else if((/b$/i).test(inst[0])){
			//b(regs[0]+':');
		}else if((/mov$/i).test(inst[0])){
			condFlag = 14;
			if((regs[1]).indexOf('#')>-1){
				var theInst = "0000".substr(0,4 - (+condFlag).toString(2).length) + (+condFlag).toString(2) + "001" + "110100000" + findReg(regs[0]) + "000000000000".substr(0,12 - (+(regs[1]).replace('#','')).toString(2).length)+(+(regs[1]).replace('#','')).toString(2);
				instMem += "\n" + "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + "00000000".substr(0,8 - parseInt(theInst,2).toString(16).length) + parseInt(theInst,2).toString(16) + "\t" + line;
			}
			else{
				var theInst = "0000".substr(0,4 - (+condFlag).toString(2).length) + (+condFlag).toString(2) + "000" + "110100000" + findReg(regs[0]) + "000000000000".substr(0,12 - findReg(regs[1]).length) + findReg(regs[1]);
				instMem += "\n" + "00000000".substr(0,8 - (+lineNum).toString(16).length) + (+lineNum).toString(16) + ":" + "00000000".substr(0,8 - parseInt(theInst,2).toString(16).length) + parseInt(theInst,2).toString(16) + "\t" + line;
			}
		}else if((/cmp$/i).test(inst[0])){
			//cmp(regs);
		}else if((/beq$/i).test(inst[0])){
			//beq((regs[0].replace((/^=/),''))+':');
		}else if((/bne$/i).test(inst[0])){
			//bne((regs[0].replace((/^=/),''))+':');
		}else if((/bgt$/i).test(inst[0])){
			//bgt((regs[0].replace((/^=/),''))+':');
		}else if((/blt$/i).test(inst[0])){
			//blt((regs[0].replace((/^=/),''))+':');
		}else if((/bge$/i).test(inst[0])){
			//bge((regs[0].replace((/^=/),''))+':');
		}else if((/ble$/i).test(inst[0])){
			//ble((regs[0].replace((/^=/),''))+':');
		}else if((/ldr$/i).test(inst[0])){
			//ldr(regs);
		}else if((/str$/i).test(inst[0])){
			//str(regs);
		}
	}
	
	function findReg(reg){
		if((/sp/i).test(reg)){
			return (13).toString(2);
		}else if((/lr/i).test(reg)){
			return (14).toString(2);
		}else if((/pc/i).test(reg)){
			return (15).toString(2);
		}else{
			var leReg = reg.replace(/r/i,'');
			return "0000".substr(0,4 -(+leReg).toString(2).length) + (+leReg).toString(2);
		}
	}
}