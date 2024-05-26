# Client-side Attack

This guide provides a step-by-step walkthrough for executing the keylogger exploit. Detailed information can be found in the report.

# Step 1 - Build malicious payload

Use the script `evilzip.py` to create a zip file (evil.zip). This zip file contains the malicious file we want to overwrite, with its name including the necessary relative directory path.

# Step 2 - Submit the malicious `evil.zip`

Submit `evil.zip` via the Juice Shop complaint form. Successfully submitting this zip file will overwrite the server's `index.html`, which is distributed to clients.

# Step 3 - Run our malicious server

Launch the malicious server using the script keylogger.py. This server will:

- Wait for stolen client data/session
- Serve the malicious JavaScript when the website is visited

# Step 4 - Visit the website

When a user visits the website, the following occurs:

- If logged in, a JSON file, e.g `teste@gmail.com.json`, is created in our malicious server directory. This file contains different stolen data with the user session cookies.
- As the user types, their inputs are sent to our server and saved in a .txt file.
- Our script generates a random ID for each user, which is included in all requests to differentiate between different users' keylogger data.
