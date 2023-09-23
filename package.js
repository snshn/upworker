import { exec } from "child_process";

import packageJson from "./package.json" assert { type: "json" };

const dependencies = [
        ...Object.entries(packageJson["dependencies"] || {}),
        ...Object.entries(packageJson["devDependencies"] || {}),
    ];

var command = "npm i -g";
dependencies.forEach(dependency => {
    command += ` ${dependency[0]}@${dependency[1]}`;
});

exec(command, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`${stdout}`);
        console.warn(`${stderr}`);
    }
});
