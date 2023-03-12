def Gamma():
    gamma_list = []
    for _ in range(12):
        y = (15 * 4003 + 17) % 4096
        gamma_list.append(y)
    return gamma_list

def Crypt():
    gamma = Gamma()
    res = open("Result.txt", "w",encoding="utf-8")
    with open('Sourse.txt', 'r',encoding="utf-8") as f:
        print("[+] Procesing...")
        while True:
            temp = f.read(12)
            if temp:
                for i, item in enumerate(temp):
                    res.write(chr(ord(item) + gamma[i] * ord[item]))
            else:
                break
    print("[+] Finish, have a nice day :3")
    res.close()
 
Crypt()