const { PrismaClient, Role, Category } = require('@prisma/client');
const bcrypt = require('bcrypt');
const yaml = require('js-yaml');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    await prisma.$queryRaw`SET TIMEZONE="Europe/Moscow";`

    const admin = await prisma.user.upsert({
        where: {
            id: 1
        },
        create: {
            email: "a@ctfboard.ru",
            name: "Admin",
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
            role: Role.ADMIN
        },
        update: {
            email: "a@ctfboard.ru",
            name: "Admin",
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
        }
    })

    const categoryInfo = [
        ["web", "WEB", "Посик и эксплуатация web-уязвимостей"],
        ["crypto", "Криптография", "Расшифровке зашифрованных строк различными сопосбами и шифрамии."],
        ["forensics", "Форензика", "Изучение данных, например, анализ пакетов в файле .pcap, анализ дампа памяти."],
        ["osint", "OSINT", "Поиск информации из открытых источников."],
        ["reverse", "Реверс", "Исследование программ без исходного кода."],
        ["misc", "Разное", "Развлекательные задачи."]
    ]
    const categories = await Promise.all(
        categoryInfo.map((category) => {
            return prisma.category.upsert({
                where: {
                    name: category[0]
                },
                create: {
                    name: category[0],
                    title: category[1],
                    about: category[2]
                },
                update: {
                    name: category[0],
                    title: category[1],
                    about: category[2]
                }
            })
        })
    )

    console.log(categories)

    const updateOrCreateTasks = async function (tasks, categoryID) {
        return await Promise.all(
            tasks.map(async function (task) {
                console.log(categoryID)
                try {
                    return await prisma.task.upsert({
                        create: {
                            title: task.title,
                            description: task.description,
                            points: task.points,
                            flag: task.flag,
                            category: {
                                connect: {
                                    id: categoryID
                                }
                            },
                            author: {
                                connectOrCreate: {
                                    where: {
                                        email: task.author.contact,
                                    },
                                    create: {
                                        email: task.author.contact,
                                        name: task.author.name,
                                        password: await bcrypt.hash("password", 10),
                                    },
                                },
                            },

                            status: {
                                create: {
                                    public: false,
                                    active: true
                                }
                            }
                        },
                        where: {
                            flag: task.flag,
                        },
                        update: {
                            title: task.title,
                            description: task.description,
                        },
                    })
                } catch (e) {
                    if (e.code == "P2002") {
                        return await prisma.task.upsert({
                            create: {
                                title: task.title,
                                description: task.description,
                                points: task.points,
                                flag: task.flag,
                                category: {
                                    connect: {
                                        id: categoryID
                                    }
                                },
                                author: {
                                    connectOrCreate: {
                                        where: {
                                            email: task.author.contact,
                                        },
                                        create: {
                                            email: task.author.contact,
                                            name: task.author.name,
                                            password: await bcrypt.hash("password", 10),
                                        },
                                    },
                                },

                                status: {
                                    create: {
                                        public: false,
                                        active: true
                                    }
                                }
                            },
                            where: {
                                flag: task.flag,
                            },
                            update: {
                                title: task.title,
                                description: task.description,
                            },
                        })
                    }

                }
            })
        )
    }

    const categoryIDs = categories.reduce(function (result, category) {
        return { ...result, [category.name]: category.id }
    }, {})

    console.log({ categoryIDs })
    const data = yaml.load(fs.readFileSync("./data.yml", 'utf8'));

    const webTasks = await updateOrCreateTasks(data.web, categoryIDs.web)
    const cryptoTasks = await updateOrCreateTasks(data.crypto, categoryIDs.crypto)
    const forensicsTasks = await updateOrCreateTasks(data.forensics, categoryIDs.forensics)
    const osintTasks = await updateOrCreateTasks(data.osint, categoryIDs.osint)
    const reverseTasks = await updateOrCreateTasks(data.reverse, categoryIDs.reverse)
    const miscTasks = await updateOrCreateTasks(data.misc, categoryIDs.misc)

    console.log({
        webTasks,
        cryptoTasks,
        forensicsTasks,
        osintTasks,
        reverseTasks,
        miscTasks,
    })

    await prisma.event.create({
        data: {
            name: 'Admiral Makarov CTF',
            startDate: new Date('March 11, 2023 12:00:00 GMT+03:00'),
            endDate: new Date('March 12, 2023 00:00:00 GMT+03:00'),
            location: "Online",
            format: 'Task-based'
        }
    })
}


main()
    .then(async function () {
        await prisma.$disconnect()
    })
    .catch(async function (e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })