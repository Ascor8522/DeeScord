const fs = require("fs");

exploreDir("./out", 0);

function exploreDir(path, indent) {
	for(const element of fs.readdirSync(path)) {
		if(element.endsWith(".js")) {
			console.log(`${"\t".repeat(indent)}├File ${path}/${element}`);
			let doc = fs.readFileSync(`${path}/${element}`, 'utf8');
			doc = doc.replace(/import { (.+) } from "(.+)";/gim, "import { $1 } from \"$2.js\";");
			fs.writeFileSync(`${path}/${element}`, doc, 'utf8');
			fs.appendFileSync(`${path}/${element}`, `\n// Fixed at ${new Date().toString()}`, 'utf8');
		} else {
			console.log(`${"\t".repeat(indent)}└Entering dir ${path}/${element}`);
			exploreDir(`${path}/${element}`, indent+1);
			console.log(`${"\t".repeat(indent)}┌Exiting dir ${path}/${element}`);
		}
	}
}
